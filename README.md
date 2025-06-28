# Dobby Tour Website

Dobby Tour Website is a web and mobile application designed to provide users with an interactive and seamless experience for exploring landmarks and tours. This project is built using React Native and Firebase.

## Features
- User authentication (Login/Signup)
- Interactive map view for landmarks
- Tour management and booking
- Responsive design for web and mobile

## Prerequisites
Before setting up the project, ensure you have the following installed:

- Node.js (>= 14.x)
- npm or yarn
- Expo CLI
- Firebase account

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd DobbyTourWebsite
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set Up Firebase
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project or use an existing one.
3. Add a new web app to your Firebase project.
4. Copy the Firebase configuration and replace the content in `FirebaseConfig.ts` with your Firebase credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export default firebaseConfig;
```

5. Enable the required Firebase services (e.g., Authentication, Firestore, Storage) in the Firebase Console.

### 4. Start the Development Server
```bash
npm start
# or
yarn start
```

This will start the Expo development server. You can scan the QR code with the Expo Go app or run the app on an emulator/simulator.

### 5. Build for Production
To build the project for production, follow the Expo documentation for [building standalone apps](https://docs.expo.dev/build/introduction/).

## Linking to the Robot

The `load_tour_data.py` script demonstrates how to:

1. Download tour data from the Firebase database
2. Translate image coordinates to the robot's map frame.
3. Save the processed data in a YAML file format for robot integration.

Save the module into your robot workspace and edit the file paths as needed.

## Project Structure
```
DobbyTourWebsite/
├── app/
│   ├── screens/
│   │   ├── LandmarksView.tsx
│   │   ├── Login.tsx
│   │   ├── MapView.tsx
│   │   └── Drawer/
│   │       ├── DrawerView.tsx
│   │       ├── styles.tsx
│   │       └── ToursView.tsx
├── assets/
├── web-build/
├── FirebaseConfig.ts
├── App.js
├── package.json
└── ...
```

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.
