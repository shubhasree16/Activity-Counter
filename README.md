# Veera's Activity Counter

A personal weekly fitness tracker built with React Native (Expo).

## Activities Tracked
- Swimming x1
- Pilates x2
- Gym x2
- Yoga x1
- Walk x1

## Features
- **Home**: Tap pill checkboxes to track each session
- **Summary**: See weekly completion percentage and per-activity breakdown
- **History**: Browse past weeks with color-coded indicators
- **Settings**: Change your name, daily reminder (with time), manual week reset
- **Party pop**: Confetti burst every time you check a box
- **Daily nudge**: Notification if no box is checked by your chosen time

## Design
- Cormorant Garamond font
- Barbie pink + black theme (4 colors only)
- Flat SVG icons, pill-shaped checkboxes
- Auto-resets every Monday

## Tech Stack
- React Native + Expo
- AsyncStorage for local persistence
- No backend required

## Run it locally

You need [Node.js](https://nodejs.org) 20 or newer and Yarn (`corepack enable` turns it on).

```bash
git clone https://github.com/shubhasree16/Activity-Counter.git
cd Activity-Counter/react_native_space
yarn install
yarn web        # opens the app in your browser
```

To run it on an Android phone, use `yarn android` with an emulator or a connected device
(needs [Android Studio](https://developer.android.com/studio)).

Notes:
- Notifications and haptics only work on a phone, not in the browser.
- All data stays on the device (AsyncStorage) — there is no account or server.
