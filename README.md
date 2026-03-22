<div align="center">
  <h1>💸 Splitify</h1>
  <p><strong>A beautiful local-first bill splitting app built with Expo + React Native.</strong></p>
  <p>
    Track shared expenses, see who owes whom, settle up faster, and keep everything on-device.
  </p>

  <p>
    <img src="https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo&logoColor=white" alt="Expo 54" />
    <img src="https://img.shields.io/badge/React%20Native-0.81-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React Native 0.81" />
    <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript Strict" />
    <img src="https://img.shields.io/badge/Storage-MMKV-6C5CE7?style=flat-square" alt="MMKV storage" />
    <img src="https://img.shields.io/badge/License-MIT-10B981?style=flat-square" alt="MIT License" />
  </p>
</div>

---

## ✨ Why Splitify?

Splitify is made for the moments when money gets awkward:

- a weekend trip with friends
- a shared apartment grocery run
- office lunch collections
- a movie night, cab ride, or coffee round

Instead of juggling screenshots, notes apps, and mental math, Splitify gives you one clean place to:

- create a group,
- add members,
- record expenses,
- split equally, exactly, or by percentage,
- and instantly see the simplest way to settle up.

Best part? **Your data stays on your device.** No login, no server, no cloud dependency.

---

## 🌟 Highlights

### 🔒 Local-first and private

All groups, expenses, and settlements are stored locally using `react-native-mmkv` through persisted Zustand stores. That means the app works without accounts or backend infrastructure.

### 🧮 Smart debt simplification

Splitify does not just total numbers — it calculates net balances and reduces them into a smaller set of “A pays B” settlements, making it easier for groups to close out debts.

### 👥 Flexible group setup

Create groups with:

- a custom name
- a fun emoji icon
- a custom currency symbol
- multiple members with auto-generated avatars

### 💵 Multiple split styles

When adding an expense, you can split it:

- **Equally**
- **By exact amount**
- **By percentage**

### 📦 Easy sharing and backup

Splitify supports:

- exporting a single group as a `.spt` file
- exporting all groups into a ZIP backup
- importing `.spt` files back into the app

### 🎨 Polished mobile experience

The app includes:

- custom bottom tab bar with floating action button
- light/dark theme support based on system settings
- native-feeling haptics on key interactions
- clean cards, avatars, and balance summaries

---

## 🧭 What you can do in the app

### Home

- View overall balance across groups
- See your group previews
- Check recent activity from expenses and settlements

### Groups

- Browse all groups
- Long-press a group to edit or delete it
- Prevent accidental deletion when unsettled balances still exist

### Group Details

- See all members in a group
- View total spending
- Check simplified balances
- Add a new expense
- Share a group as a `.spt` file
- Open the settle-up flow

### Add Expense

- Enter a description and total amount
- Choose who paid
- Select who participated
- Split by equal, exact, or percentage rules

### Settle Up

- View who owes whom
- Record full or partial payments
- Watch the balance list update as debts are cleared

### Activity

- Review expense history across groups

### Settings

- Import a `.spt` group file
- Export all groups to a ZIP backup
- Clear all local data
- View app version and theme mode

---

## 🛠 Tech stack

- **Framework:** Expo + React Native
- **Routing:** Expo Router
- **Language:** TypeScript
- **State management:** Zustand
- **Persistence:** Zustand `persist` + `react-native-mmkv`
- **Icons:** `lucide-react-native`
- **Animations:** `react-native-reanimated`
- **Haptics:** `expo-haptics`
- **File sharing/import:** `expo-sharing`, `expo-document-picker`, `expo-file-system`, `jszip`
- **Color generation:** `@material/material-color-utilities`

---

## 📁 Project structure

```text
splitify/
├── app/                  # Expo Router screens
│   ├── (tabs)/           # Home, Groups, Activity, Settings tabs
│   ├── group/            # Group details, add expense, settle-up screens
│   └── modals/           # Create/edit group flows
├── src/
│   ├── components/       # Reusable UI building blocks
│   ├── services/         # Split logic + import/export services
│   ├── store/            # Zustand stores + MMKV adapter
│   ├── theme/            # Colors, shadows, spacing, typography
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Currency, date, avatar, ID helpers
├── app.json              # Expo app configuration
└── package.json          # Scripts and dependencies
```

---

## 🚀 Getting started

### Prerequisites

Make sure you have:

- **Node.js** 18+
- **npm**
- **Expo Go** on your phone, or
- an Android emulator / iOS simulator for local testing

### Installation

```bash
git clone https://github.com/soumya-99/splitify.git
cd splitify
npm install
```

### Start the development server

```bash
npm run start
```

Then choose one of the following:

- press **`a`** to open Android
- press **`i`** to open iOS
- press **`w`** to open web
- or scan the QR code in **Expo Go**

---

## 📜 Available scripts

```bash
npm run start          # Start Expo dev server
npm run android        # Run on Android
npm run ios            # Run on iOS
npm run web            # Run on web
npm run prebuild       # Generate native projects
npm run prebuild:clean # Clean prebuild
npm run build:apk      # Android release build command
npm run lint           # Run Expo/ESLint checks
```

---

## 🧠 How settlement calculation works

Splitify keeps track of:

1. **expenses** — who paid and how the cost was split
2. **settlements** — payments recorded later between members

From that, it computes each member’s **net balance**:

- if someone paid more than their share, they become a creditor
- if someone paid less than their share, they become a debtor

The app then simplifies debts into a minimal-style payment list such as:

- Alice pays Bob ₹250
- Carol pays Dan ₹120

This keeps settlement suggestions easier to follow than a raw expense-by-expense ledger.

---

## 💾 Data import/export

Splitify supports portable group files:

### `.spt` file

A single exported group contains:

- app export version
- group metadata
- all expenses in that group
- all recorded settlements in that group

### ZIP backup

The app can also package every group into a ZIP archive so you can back up all your local ledgers at once.

### Import behavior

When importing a `.spt` file, Splitify checks for duplicate group IDs and avoids importing the same group twice.

---

## 🎨 Design notes

A few implementation details that make the app feel more refined:

- avatars use Material color utilities to generate pleasant, distinct colors from names
- the app follows the device’s system theme automatically
- interactions such as add/save/select trigger haptic feedback
- the custom bottom tab bar includes a centered floating action button for quick group creation

---

## ⚠️ Current behavior to know

These are not necessarily problems, just useful product notes based on the current implementation:

- The app is **local-first** — there is no account sync or remote backup.
- Theme selection is **automatic** and follows the system theme.
- Group deletion is blocked when unresolved balances still exist.
- The first member added during group creation starts as **“You”** by default.

---

## 🤝 Contributing

Contributions are welcome.

If you want to improve the app:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run lint checks
5. Open a pull request

Example:

```bash
git checkout -b feat/improve-readme
npm run lint
git commit -m "docs: improve README"
```

---

## 📄 License

This project is licensed under the **MIT License**.
See [`LICENSE`](./LICENSE) for details.

---

## 💜 Closing note

Splitify is the kind of app that tries to stay out of your way:
fast to open, simple to use, and clear when money gets messy.

If you like the idea, star the project and make it your go-to shared expense tracker.
