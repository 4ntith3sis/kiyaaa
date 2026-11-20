/**
 * Soft-blow detection tuning guide.
 *
 * Real-world smoothed-RMS reference (0..1):
 *   quiet room noise floor ...... 0.008–0.02
 *   normal speech at distance ... 0.03–0.15 (in syllables, with pauses)
 *   soft blow at 20–50 cm ....... 0.03–0.08 sustained
 *   firm blow into the mic ...... 0.10–0.40 sustained
 *
 * Detection is RELATIVE, never an absolute "volume > X" gate:
 *   1. Track a slow-moving noise floor (frozen while blowing, so a
 *      sustained blow can't drag the floor up and kill its own detection).
 *   2. A frame counts as blow when the level clearly exceeds the floor:
 *        level > floor * THRESHOLD_MULTIPLIER
 *        AND delta >= MIN_AMPLITUDE_DELTA
 *        AND strength >= SOFT_GATE
 *   3. Blow frames charge an energy accumulator (weighted by strength);
 *      silence drains it over RELEASE_MS. Detection fires at energy >= 1.
 *      Sustained soft blows charge slowly but get there; speech syllables
 *      decay between pauses and never accumulate enough.
 *
 * Bias: when in doubt, err on the side of slightly too sensitive — a soft
 * "fuuuh..." must always get a visible flame response.
 *
 * How to tune:
 *   - Soft blows never detected .... lower THRESHOLD_MULTIPLIER (→1.5)
 *     or MIN_AMPLITUDE_DELTA, or raise CHARGE_GAIN.
 *   - Speech falsely triggers ...... raise THRESHOLD_MULTIPLIER (→2.0),
 *     raise SOFT_GATE, or lower CHARGE_GAIN.
 *   - Detection feels laggy ......... raise LEVEL_SMOOTHING / CHARGE_GAIN.
 *   - Detection feels jittery ....... lower LEVEL_SMOOTHING.
 */

/** New-sample weight for the fast level tracker (higher = more responsive). */
export const LEVEL_SMOOTHING = 0.45;
/** Per-frame weight for slow noise-floor tracking (frozen while blowing). */
export const FLOOR_ADAPT_RATE = 0.03;
/** Ignore loud transients (claps, taps) when adapting the floor. */
export const FLOOR_SPIKE_GUARD = 6;
export const FLOOR_INIT = 0.02;
export const FLOOR_MIN = 0.004;
export const FLOOR_MAX = 0.15;

/** Level must exceed floor × this to count as a blow frame. */
export const THRESHOLD_MULTIPLIER = 1.7;
/** Absolute headroom above the floor: a frame needs delta >= this. */
export const MIN_AMPLITUDE_DELTA = 0.008;

/**
 * Strength scale: delta RMS that maps to strength 1.0.
 * strength = clamp01((level - floor) / STRENGTH_REF)
 *   > 0.12 soft   → enough to trigger after a short steady blow
 *   > 0.35 medium → triggers noticeably faster
 *   > 0.60 strong → triggers fast (~0.5s)
 */
export const STRENGTH_REF = 0.05;
export const SOFT_GATE = 0.12;

/** Energy charge rate per second = CHARGE_BASE + CHARGE_GAIN × strength. */
export const CHARGE_BASE = 0.6;
export const CHARGE_GAIN = 1.8;
/** Full energy drains over this long when the blow pauses (ms). */
export const RELEASE_MS = 160;
/** Ignore further triggers for this long after a blow (ms). */
export const BLOW_COOLDOWN_MS = 800;

export const FFT_SIZE = 2048;
// Keep state-driven visualizer updates modest; audio sampling still runs each frame.
export const VOLUME_UI_UPDATE_MS = 180;
