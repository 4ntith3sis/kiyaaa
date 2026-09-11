export const birthdayConfig = {
  name: "Lorem ipsum",
  title: "Happy Birthday!",
  subtitle: "Make a wish...",
  welcomeEyebrow: "your gift is ready",
  welcomeTitle: "Make a Wish",
  instruction: "Blow out the candles",
  blowHint: "Now blow gently toward your microphone",
  breathHint: "Take a breath...",
  message:
    "May this new chapter bring you beautiful moments, genuine happiness, and everything your heart wishes for.",
  closing: "With love ❤️",
  candleCount: 5,
} as const;

export type BirthdayConfig = typeof birthdayConfig;
