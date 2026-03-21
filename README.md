<div align="center">
  <h1>💸 Splitify</h1>
  <p><b>A modern, local-first expense splitting app built with React Native.</b></p>
  
  <p>
    <a href="https://github.com/soumya-99/splitify/stargazers"><img src="https://img.shields.io/github/stars/soumya-99/splitify?style=flat-square&color=6C5CE7" alt="Stars" /></a>
    <a href="https://github.com/soumya-99/splitify/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&color=00B894" alt="License" /></a>
  </p>
</div>

<br />

**Splitify** is a delightfully simple and beautifully crafted mobile application for splitting bills, calculating shared expenses with friends, and settling up exactly who owes what—with absolutely zero hassle or online accounts needed.

Everything runs seamlessly on your device.

## ✨ Features

- 🔒 **Privacy-First & Offline:** There are no servers, databases, or accounts here. Splitify uses `react-native-mmkv` to securely store your ledgers locally on your device.
- 🎨 **Material You Avatars:** Uses Google's HCT (Hue, Chroma, Tone) formulas to mathematically generate stunning and perceptually harmonious pastel colors for your group members.
- 🧮 **Smart Settlements:** Add your expenses and watch Splitify calculate the shortest path to settle all debts in the group!
- 📳 **Refined UX & Native Haptics:** Polished fluid animations paired with native iOS-like haptic feedback throughout the navigation and core interactions.
- 📦 **Seamless Exporting:** Batch backup all of your group ledgers to a `.zip` archive or directly share individual `.spt` files with friends so everyone can load the exact same data!

## 🛠️ Technology Stack

- **Framework:** React Native & [Expo](https://expo.dev/) (Utilizes Expo Router)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Storage:** [React Native MMKV](https://github.com/mrousavy/react-native-mmkv) (Fastest synchronous key-value storage)
- **Icons:** [Lucide React Native](https://lucide.dev/)
- **Colors:** `@material/material-color-utilities`

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed.

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/soumya-99/splitify.git
   cd splitify
   ```
2. Install NPM dependencies
   ```bash
   npm install
   ```
3. Start the Expo development server
   ```bash
   npx expo start
   ```

Simply scan the QR code printed in the terminal with the **Expo Go** app on your physical device, or press `a` or `i` to launch it instantly in an Android Emulator or iOS Simulator!

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
