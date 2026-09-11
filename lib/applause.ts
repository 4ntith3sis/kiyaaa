import {
  MUSIC_DEFAULT_VOLUME,
  isMusicPlaying,
  setMusicVolume,
} from "./music";

/**
 * One-shot applause celebration effect.
 *
 * - Exactly one HTMLAudioElement exists per page load (module singleton),
 *   created lazily on first play: zero network activity until needed.
 * - The caller (BirthdayExperience) guarantees single firing per cake
 *   session via a ref guard + a 400ms delay after the last candle dies.
 * - If background music happens to be playing, it ducks slightly while
 *   the applause runs and swells back smoothly afterwards.
 * - Audio is local only (`public/audio/applause.mp3`). If the file is
 *   missing, play() rejects, we warn once, and the site flow is unaffected.
 */

const APPLAUSE_SRC = "/audio/applause.mp3";
const APPLAUSE_VOLUME = 0.55;
const DUCKED_MUSIC_VOLUME = 0.15;
const RESTORE_FALLBACK_MS = 8000;

let audio: HTMLAudioElement | null = null;
let restoreTimer = 0;
let restoreDone = true;

function getApplause(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!audio) {
    audio = new Audio(APPLAUSE_SRC);
    audio.loop = false;
    audio.volume = APPLAUSE_VOLUME;
    audio.preload = "auto";
  }
  return audio;
}

function restoreMusic(): void {
  if (restoreDone) return;
  restoreDone = true;
  if (restoreTimer) {
    window.clearTimeout(restoreTimer);
    restoreTimer = 0;
  }
  setMusicVolume(MUSIC_DEFAULT_VOLUME);
}

/** Fire-and-forget celebration sfx. Safe to call; caller guards frequency. */
export function playApplause(): void {  const el = getApplause();
  if (!el || typeof window === "undefined") return;
  restoreDone = false;
  if (isMusicPlaying()) {
    setMusicVolume(DUCKED_MUSIC_VOLUME);
    el.onended = () => restoreMusic();
    restoreTimer = window.setTimeout(restoreMusic, RESTORE_FALLBACK_MS);
  } else {
    restoreDone = true;
  }
  try {
    el.currentTime = 0;
    void el.play().catch((err: unknown) => {
      console.warn("Applause playback failed:", err);
      restoreMusic();
    });
  } catch (err) {
    console.warn("Applause playback failed:", err);
    restoreMusic();
  }
}

/** Stop a running applause immediately (used on Replay). */
export function stopApplause(): void {
  if (!audio) return;
  try {
    audio.pause();
    audio.currentTime = 0;
  } catch (err) {
    console.warn("Applause stop failed:", err);
  }
  restoreMusic();
}
