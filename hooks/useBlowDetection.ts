"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BLOW_COOLDOWN_MS,
  CHARGE_BASE,
  CHARGE_GAIN,
  FFT_SIZE,
  FLOOR_ADAPT_RATE,
  FLOOR_INIT,
  FLOOR_MAX,
  FLOOR_MIN,
  FLOOR_SPIKE_GUARD,
  LEVEL_SMOOTHING,
  MIN_AMPLITUDE_DELTA,
  RELEASE_MS,
  SOFT_GATE,
  STRENGTH_REF,
  THRESHOLD_MULTIPLIER,
  VOLUME_UI_UPDATE_MS,
} from "@/lib/blow-constants";

export type MicrophoneErrorKind =
  | "unsupported"
  | "denied"
  | "unavailable"
  | "insecure-context"
  | null;

interface UseBlowDetectionOptions {
  /** Called once per detected blow with the blow strength (0..1). */
  onBlow?: (strength: number) => void;
}

interface UseBlowDetectionReturn {
  isListening: boolean;
  /** Normalised 0..1 level for UI visualisers. */
  volume: number;
  /** Raw smoothed RMS (same scale as the noise floor). */
  level: number;
  /** Slowly-tracked noise floor (adapts to the room, frozen while blowing). */
  noiseFloor: number;
  /** Current blow strength 0..1 (soft >0.12, medium >0.35, strong >0.6). */
  strength: number;
  /** Blow energy 0..1 — detection fires at 1. */
  charge: number;
  /** Subtle pre-trigger wind hint 0..1 for progressive flame lean. */
  wind: number;
  /** Effective absolute trigger level (same scale as `level`). */
  threshold: number;
  isBlowing: boolean;
  microphoneError: MicrophoneErrorKind;
  startListening: () => Promise<boolean>;
  stopListening: () => void;
}

function classifyMicError(err: unknown): MicrophoneErrorKind {
  if (
    typeof window === "undefined" ||
    !navigator.mediaDevices?.getUserMedia ||
    typeof AudioContext === "undefined"
  ) {
    return "unsupported";
  }
  if (!window.isSecureContext && window.location.hostname !== "localhost") {
    return "insecure-context";
  }
  if (err instanceof DOMException) {
    if (err.name === "NotAllowedError" || err.name === "SecurityError") {
      return "denied";
    }
    if (
      err.name === "NotFoundError" ||
      err.name === "NotReadableError" ||
      err.name === "OverconstrainedError"
    ) {
      return "unavailable";
    }
  }
  return "unavailable";
}

/**
 * Owns microphone access + realtime soft-blow detection.
 * Audio is analysed in-memory only — nothing is recorded, stored or uploaded.
 *
 * Algorithm: fast level tracker vs slow adaptive noise floor → per-frame
 * blow strength → energy accumulator (charges while blowing, drains on
 * pause) → trigger at energy >= 1. Gentle sustained blows charge slowly
 * but reliably; speech decays between syllables and never fires.
 */
export function useBlowDetection(
  options: UseBlowDetectionOptions = {},
): UseBlowDetectionReturn {
  const { onBlow } = options;
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [level, setLevel] = useState(0);
  const [noiseFloor, setNoiseFloor] = useState(FLOOR_INIT);
  const [strength, setStrength] = useState(0);
  const [charge, setCharge] = useState(0);
  const [wind, setWind] = useState(0);
  const [threshold, setThreshold] = useState(
    FLOOR_INIT * THRESHOLD_MULTIPLIER + MIN_AMPLITUDE_DELTA,
  );
  const [isBlowing, setIsBlowing] = useState(false);
  const [microphoneError, setMicrophoneError] =
    useState<MicrophoneErrorKind>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number>(0);
  const onBlowRef = useRef(options.onBlow);
  useEffect(() => {
    onBlowRef.current = onBlow;
  }, [onBlow]);

  const smoothedRef = useRef(0);
  const floorRef = useRef(FLOOR_INIT);
  const energyRef = useRef(0);
  const windRef = useRef(0);
  const lastTickRef = useRef(0);
  const lastTriggerRef = useRef(0);
  const blowingRef = useRef(false);
  const lastUiUpdateRef = useRef(0);
  const stoppedRef = useRef(false);

  const cleanupNodes = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    try {
      sourceRef.current?.disconnect();
    } catch {
      /* noop */
    }
    try {
      analyserRef.current?.disconnect();
    } catch {
      /* noop */
    }
    sourceRef.current = null;
    analyserRef.current = null;
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        try {
          track.stop();
        } catch {
          /* noop */
        }
      }
      streamRef.current = null;
    }
    const ctx = audioCtxRef.current;
    audioCtxRef.current = null;
    if (ctx && ctx.state !== "closed") {
      void ctx.close().catch(() => undefined);
    }
  }, []);

  const stopListening = useCallback(() => {
    stoppedRef.current = true;
    cleanupNodes();
    blowingRef.current = false;
    setIsBlowing(false);
    setIsListening(false);
    setVolume(0);
    setLevel(0);
    setStrength(0);
    setCharge(0);
    setWind(0);
  }, [cleanupNodes]);

  const startListening = useCallback(async () => {
    if (typeof window === "undefined") return false;
    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof AudioContext === "undefined"
    ) {
      setMicrophoneError("unsupported");
      return false;
    }
    if (!window.isSecureContext && window.location.hostname !== "localhost") {
      setMicrophoneError("insecure-context");
      return false;
    }

    stoppedRef.current = false;
    setMicrophoneError(null);
    cleanupNodes();

    try {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) {
        setMicrophoneError("unsupported");
        return false;
      }
      // iOS Safari requires AudioContext.resume() to happen in the same user
      // activation as the tap. Create and resume it before awaiting permission.
      const ctx = new Ctx();
      audioCtxRef.current = ctx;
      const resumePromise = ctx.state === "suspended" ? ctx.resume() : Promise.resolve();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // Echo cancellation on (harmless for blows, helps laptop
          // speaker→mic feedback). Noise suppression stays OFF — it would
          // eat sustained breath noise. AGC stays OFF — its per-device
          // behaviour would make detection unpredictable.
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      if (stoppedRef.current) {
        for (const t of stream.getTracks()) t.stop();
        return false;
      }
      streamRef.current = stream;
      await resumePromise.catch(() => undefined);

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0;
      source.connect(analyser);
      sourceRef.current = source;
      analyserRef.current = analyser;

      const buffer = new Float32Array(analyser.fftSize);
      smoothedRef.current = 0;
      floorRef.current = FLOOR_INIT;
      energyRef.current = 0;
      windRef.current = 0;
      lastTickRef.current = 0;
      lastTriggerRef.current = 0;

      setIsListening(true);

      const tick = (now: number) => {
        if (stoppedRef.current) return;
        analyser.getFloatTimeDomainData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
          const v = buffer[i];
          sum += v * v;
        }
        const rms = Math.sqrt(sum / buffer.length);

        // Fast level tracker — responsive to soft blow onsets.
        const prev = smoothedRef.current;
        const current = prev + LEVEL_SMOOTHING * (rms - prev);
        smoothedRef.current = current;

        // Adaptive noise floor. Frozen while blowing (a sustained blow must
        // not drag the floor up and kill its own detection) and immune to
        // loud transients (claps, taps).
        let floor = floorRef.current;
        const delta = current - floor;
        const blowStrength = Math.min(1, Math.max(0, delta / STRENGTH_REF));
        const isBlowFrame =
          blowStrength >= SOFT_GATE &&
          delta >= MIN_AMPLITUDE_DELTA &&
          current > floor * THRESHOLD_MULTIPLIER;
        if (!isBlowFrame && current < floor * FLOOR_SPIKE_GUARD) {
          floor += (current - floor) * FLOOR_ADAPT_RATE;
          floor = Math.min(FLOOR_MAX, Math.max(FLOOR_MIN, floor));
          floorRef.current = floor;
        }

        // Energy accumulator: blow frames charge (weighted by strength),
        // pauses drain over RELEASE_MS. Fires at >= 1, so a gentle steady
        // "fuuuh..." gets there in ~1s while speech decays between
        // syllables and never accumulates enough.
        const dt = Math.min(64, now - (lastTickRef.current || now));
        lastTickRef.current = now;
        let energy = energyRef.current;
        if (isBlowFrame) {
          energy += ((CHARGE_BASE + CHARGE_GAIN * blowStrength) * dt) / 1000;
        } else {
          energy -= dt / RELEASE_MS;
        }
        energy = Math.min(1.2, Math.max(0, energy));
        energyRef.current = energy;

        if (energy >= 1 && now - lastTriggerRef.current > BLOW_COOLDOWN_MS) {
          lastTriggerRef.current = now;
          energyRef.current = 0;
          blowingRef.current = true;
          setIsBlowing(true);
          console.info(
            `[BLOW] level: ${current.toFixed(3)} ` +
              `noiseFloor: ${floor.toFixed(3)} ` +
              `delta: ${delta.toFixed(3)} ` +
              `strength: ${blowStrength.toFixed(2)} blowing: true`,
          );
          onBlowRef.current?.(blowStrength);
          window.setTimeout(() => {
            blowingRef.current = false;
            if (!stoppedRef.current) setIsBlowing(false);
          }, 900);
        }

        // Pre-trigger wind hint (fast attack, slow release) so the flame
        // can lean progressively while a soft blow is still charging.
        const wPrev = windRef.current;
        const wTarget = isBlowFrame ? blowStrength : 0;
        const wNext = wPrev + (wTarget - wPrev) * (wTarget > wPrev ? 0.5 : 0.15);
        windRef.current = wNext;

        if (now - lastUiUpdateRef.current > VOLUME_UI_UPDATE_MS) {
          lastUiUpdateRef.current = now;
          // Normalise for UI: map 0..0.6 RMS to 0..1
          setVolume(Math.min(1, current / 0.6));
          setLevel(current);
          setNoiseFloor(floor);
          setStrength(blowStrength);
          setCharge(Math.min(1, energy));
          setWind(wNext);
          setThreshold(
            Math.max(
              floor * THRESHOLD_MULTIPLIER,
              floor + SOFT_GATE * STRENGTH_REF,
            ),
          );
        }

        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      return true;
    } catch (err) {
      cleanupNodes();
      setMicrophoneError(classifyMicError(err));
      setIsListening(false);
      return false;
    }
  }, [cleanupNodes]);

  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      cancelAnimationFrame(rafRef.current);
      try {
        sourceRef.current?.disconnect();
      } catch {
        /* noop */
      }
      try {
        analyserRef.current?.disconnect();
      } catch {
        /* noop */
      }
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) {
          try {
            track.stop();
          } catch {
            /* noop */
          }
        }
      }
      const ctx = audioCtxRef.current;
      if (ctx && ctx.state !== "closed") {
        void ctx.close().catch(() => undefined);
      }
    };
  }, []);

  return {
    isListening,
    volume,
    level,
    noiseFloor,
    strength,
    charge,
    wind,
    threshold,
    isBlowing,
    microphoneError,
    startListening,
    stopListening,
  };
}
