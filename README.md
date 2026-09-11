# birthday-card-gift

An interactive handmade birthday card on the web: a cute dancing unicorn invites you to open your gift, leading to a semi-realistic birthday cake whose candles you blow out for real using your microphone.

## Flow

Opening card → `yes please` → cake surprise (blow the candles, make a wish) · `no thanks` → sad unicorn → `try again`

## Features

- Dancing / crying unicorn companion (pure SVG + CSS)
- Crumpled-paper handmade card aesthetic
- Real microphone blow detection (Web Audio API, adaptive noise floor, soft-blow friendly)
- Living SVG flames, smoke, confetti, cinematic birthday message
- Personalize everything from one file: `config/birthday.ts`
- Fully responsive, `prefers-reduced-motion` friendly

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (use `localhost` so microphone access works).

```bash
npm run lint
npx tsc --noEmit
npm run build
```
