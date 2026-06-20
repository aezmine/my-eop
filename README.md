# Assessment Video Portfolio & Showcase Website

A responsive, state-of-the-art web application for showcasing and managing student assessment and demo videos. Built using **React**, **Vite**, **TypeScript**, and **Tailwind CSS**, with **Firebase** backing database and authentication services.

This project maps directly to the design tokens and layout specifications detailed in the visual design guide (`/docs`).

---

## Core Features

- **Automated YouTube Data Parser**: Simply paste a YouTube URL; the system automatically extracts the ID, fetches high-quality thumbnail overlays, and configures the embedded responsive player.
- **Embedded Modal Player**: Stream assessment videos directly in-app using backdrop-blurred, high-fidelity overlays without redirecting users away.
- **Filtering & Spotlight spotlight**: Prominently features highlighted assessments at the top of the showcase list, with interactive category buttons and title search logic.
- **Analytics Indicators**: Admin panel lists total catalog records, total viewer clicks, category counts, and features indicators.
- **Light/Dark Mode Toggles**: Full visual dark and light support adjusting color swatches dynamically.
- **Seamless Local Mock Mode**: Default fallback to `localStorage` and mock session checks if environment keys are missing, permitting immediate, zero-config testing.

---

## Getting Started (Local Setup)

### 1. Install Dependencies
Ensure you have Node.js installed, then run:
```bash
npm install
```

### 2. Launch Local Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Local Mock Mode Details

If no Firebase credentials are set in your env configs, the app runs in **Mock Mode** using local browser storage.
- **Default Admin Portal Account**:
  - Email: `admin@example.com`
  - Password: `admin123`
- Database changes (adding, editing, reordering, deleting, and incrementing views) persist in the local browser state.

---

## Firebase Live Database Setup

To connect to live Cloud services, follow these setup steps:

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Register a web application to obtain your Firebase Config credentials.

### 2. Configure Authentication
1. Navigate to **Authentication** in the Firebase sidebar.
2. Enable the **Email/Password** sign-in provider.
3. Click "Add User" and create an administrator account (e.g. `admin@example.com`).

### 3. Configure Firestore Database
1. Go to **Firestore Database** and click **Create database**.
2. Select database location and select **Start in production mode** (or test mode).
3. Under **Rules**, publish the following rules to secure database writes while allowing public reads:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /videos/{videoId} {
      // Anyone can read videos and increment views
      allow read, update: if true;
      // Only authenticated users can create, modify, or delete videos
      allow create, delete: if request.auth != null;
    }
  }
}
```

### 4. Setup Firestore Index (Recommended)
To enable custom sorting and catalog orders, verify that a composite index is created in your Firestore settings for query ordering:
- Collection ID: `videos`
- Fields: `order` (Ascending), `createdAt` (Descending)

### 5. Local Environment Config
Create a file named `.env.local` in the project root and fill in your Firebase Web App credentials (copied from `.env.example`):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

---

## Deployment (Vercel)

1. Commit and push the project files to a GitHub, GitLab, or Bitbucket repository.
2. Connect your repository to [Vercel](https://vercel.com/).
3. In your Vercel Project Settings, add the Environment Variables mapped in your `.env.local` configurations.
4. Click **Deploy**. Vercel will build and host the application, automatically enabling Firestore connectivity.
