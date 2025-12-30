# Human OS Mobile App

Welcome to the **Human OS** mobile client. This application is a social platform focused on real-life interactions, digital identity, and community discovery.

## 📱 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Networking**: [Axios](https://axios-http.com/) & [Socket.io](https://socket.io/)
- **Styling**: React Native StyleSheet + Custom Theme System

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo Go](https://expo.dev/client) app on your physical iOS/Android device OR an emulator.

### Installation

1.  **Clone the repository** (if you haven't already):

    ```bash
    git clone https://github.com/tanbiralam06/homanos_mobile_app.git
    cd homanos_mobile_app
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**:
    - Identify your local IP address (e.g., `192.168.1.5`).
    - Open `src/services/api.js` (or similar config) and ensure the backend URL points to your running server (e.g., `http://192.168.1.5:5000`).

### Running the App

1.  **Start the development server**:

    ```bash
    npx expo start --clear
    ```

2.  **Open the app**:
    - **Physical Device**: Scan the QR code displayed in the terminal with the Expo Go app (Android) or Camera app (iOS).
    - **Emulator**: Press `a` for Android Emulator or `i` for iOS Simulator.

## 📂 Project Structure

```
mobile/
├── src/
│   ├── app/                # Expo Router pages (screens)
│   │   ├── (auth)/         # Authentication routes (login, signup)
│   │   ├── (tabs)/         # Main tab navigation (home, profile, etc.)
│   │   └── user/           # Public user profiles
│   ├── components/         # Reusable UI components
│   ├── context/            # Context providers (ThemeContext)
│   ├── services/           # API calls (profile, auth, followers)
│   ├── store/              # Zustand state stores (authStore, profileStore)
│   └── utils/              # Helpers and theme tokens
└── package.json            # Dependencies and scripts
```

## 🎨 Theme & Styling

The app supports **Dark Mode** and **Light Mode** out of the box.

- We use a custom `ThemeContext` to provide colors.
- All styles should reference the dynamic `colors` object from the hook `useTheme()`.
- Global constants (spacing, font sizes) are imported from `src/utils/theme.js`.

## 🛠 Key Features

- **Digital Identity**: Edit profile with bio, location, and avatar.
- **Discovery**: Find nearby users using geolocation.
- **Chatrooms**: Real-time messaging with Socket.io.
- **Social Graph**: Follow/Unfollow users, view followers/following lists.

---

_Built with ❤️ for Human Connection._
