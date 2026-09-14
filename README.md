# 🎂 Birthday Card & Gift Experience

An interactive, handmade digital birthday card website built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**. Features a cute animated SVG companion, customizable birthday wish card, background music, celebration audio, confetti, and an interactive birthday cake where users can **blow out real candles using their microphone**!

---

## ✨ Features

- 🦄 **Interactive SVG Companion**: A cute dancing unicorn that invites you to open your gift (with a funny crying state if rejected!).
- 📜 **Handmade Paper Card Aesthetic**: Beautiful textured card UI with smooth entrance animations powered by **Framer Motion**.
- 🎂 **Interactive Birthday Cake**: Multi-layered SVG cake with animated living candle flames and realistic smoke particle physics upon blowout.
- 🎤 **Real Microphone Blow Detection**: Powered by the **Web Audio API** with adaptive noise floor calibration (also supports a manual click fallback for devices without mic permissions).
- 🎵 **Audio & FX Experience**: Includes festive background music (`birthday-music.mp3`), applause audio (`applause.mp3`), floating hearts/sparkles ambient background, and confetti bursts (`canvas-confetti`).
- ⚙️ **Simple Centralized Customization**: Easily personalize the recipient's name, message, title, candle count, and hints from a single configuration file (`config/birthday.ts`).
- 📱 **Fully Responsive & Accessible**: Looks great on desktop, tablet, and mobile browsers with reduced-motion support.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Audio & Visual Effects**: Web Audio API & [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 📂 Project Structure

```text
birthday-cake/
├── app/                  # Next.js App Router (layout, page, styles)
├── components/           # React Components
│   ├── AmbientBackground.tsx   # Floating particles & light effects
│   ├── BirthdayCake.tsx        # SVG Cake & candle state management
│   ├── BirthdayExperience.tsx  # Main interactive flow coordinator
│   ├── BirthdayMessage.tsx     # Final celebratory message modal
│   ├── Candle.tsx              # Individual candle component
│   ├── Flame.tsx               # Animated candle flame SVG
│   ├── Smoke.tsx               # Blowout smoke particle effect
│   ├── Unicorn.tsx             # Interactive SVG Unicorn companion
│   └── ...
├── config/
│   └── birthday.ts       # Centralized birthday customization file
├── hooks/
│   └── useBlowDetection.ts # Web Audio API microphone blow detector
├── public/
│   └── audio/            # Background music & sound effects
├── README.md             # Project documentation
└── package.json          # Project dependencies & scripts
```

---

## ⚙️ Customization Guide

You can easily adapt this birthday card for anyone by editing [`config/birthday.ts`](file:///Users/4ntith3sis/Documents/My%20project/mini%20project/birthday-cake/config/birthday.ts):

```typescript
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
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/4ntith3sis/birthday-card-gift.git
   cd birthday-card-gift
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

> 💡 **Note on Microphone Access**: Modern browsers require HTTPS or `localhost` / `127.0.0.1` to grant microphone permissions for Web Audio API blow detection.

---

## 📜 Available Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the application for production.
- `npm run start` - Runs the built production server.
- `npm run lint` - Runs ESLint to check for code issues.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

