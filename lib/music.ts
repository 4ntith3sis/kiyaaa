/**
 * Single-instance background music controller.
 *
 * - Exactly one HTMLAudioElement exists per page load (module singleton),
 *   so React re-renders can never stack duplicate audio.
 * - The element is created lazily on first play: zero network activity
 *   until the user clicks "Light the Candles".
 * - `playMusic()` must be invoked directly inside the click handler so the
 *   browser counts it as a user gesture (no autoplay on page load).
 * - Audio is local only (`public/audio/birthday-music.mp3`) — no streams,
 *   no external services. If the file is missing, play() rejects and we
 *   fail silently with a console warning; the site flow is unaffected.
 */

let audio: HTMLAudioElement | null = null;
let muted = false;

const MUSIC_SRC = "/audio/birthday-music.mp3";
export const MUSIC_DEFAULT_VOLUME = 0.35;

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!audio) {
    audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.volume = MUSIC_DEFAULT_VOLUME;
    audio.preload = "auto";
  }
  return audio;
}

export function isMusicMuted(): boolean {
  return muted;
}

/** Call directly from the "Light the Candles" click handler. */
export async function playMusic(): Promise<boolean> {
  const el = getAudio();
  if (!el) return false;
  el.muted = muted;
  try {
    await el.play();
    return true;
  } catch (err) {
    console.warn("Music playback failed:", err);
    return false;
  }
}

export function setMusicMuted(next: boolean): void {
  muted = next;
  if (audio) {
    audio.muted = next;
  }
}

/** Stop playback and rewind, so the next "yes please" starts from the top. */
export function stopMusic(): void {
  if (!audio) return;
  try {
    audio.pause();
    audio.currentTime = 0;
  } catch (err) {
    console.warn("Music stop failed:", err);
  }
}

export function isMusicPlaying(): boolean {
  return !!audio && !audio.paused && !audio.ended;
}

export function setMusicVolume(volume: number): void {
  if (audio) {
    audio.volume = volume;
  }
}
