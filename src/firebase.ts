import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword as fbSignIn, 
  signOut as fbSignOut, 
  onAuthStateChanged as fbOnAuthStateChange,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth";
import type { User } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  increment,
  Timestamp,
  getDoc,
  setDoc
} from "firebase/firestore";

// Video Interface
export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  youtubeId: string;
  thumbnail: string;
  featured: boolean;
  views: number;
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  order: number;
  category: string;
}

// 1. Firebase Config Check
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if any required key is missing or is placeholder
const isFirebaseSetup = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId;

export let isMockMode = !isFirebaseSetup;

// Define Auth & DB variables
let firebaseApp;
let firestoreDb: any;
let firebaseAuth: any;

if (!isMockMode) {
  try {
    firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    firestoreDb = getFirestore(firebaseApp);
    firebaseAuth = getAuth(firebaseApp);
    
    // Restrict auth session persistence to browser tab session
    setPersistence(firebaseAuth, browserSessionPersistence).catch((err) => {
      console.error("Firebase persistence setup failed:", err);
    });
  } catch (error) {
    console.error("Failed to initialize Firebase, falling back to Mock Mode.", error);
    isMockMode = true;
    (window as any)._isMockModeOverride = true;
  }
} else {
  console.warn("Running in Mock Mode. Please configure Firebase keys in .env for live database functionality.");
}

// Helper to race a promise against a timeout to prevent hanging queries
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> => {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });
  return Promise.race([
    promise.then((val) => {
      clearTimeout(timeoutId);
      return val;
    }),
    timeoutPromise
  ]);
};

// ── Mock Database Seed Data ──────────────────────────────────────
const MOCK_VIDEOS_KEY = "video_portfolio_videos";
const MOCK_AUTH_KEY = "video_portfolio_auth_user";

const seedMockData = (): Video[] => {
  const existing = localStorage.getItem(MOCK_VIDEOS_KEY);
  if (existing) {
    return JSON.parse(existing);
  }

  const initialVideos: Video[] = [
    {
      id: "mock-video-1",
      title: "UMT Classroom Booking System Demo",
      description: "Complete walkthrough of the Java / JSP booking system. Demonstrates MySQL schema mappings, collision detection algorithms, and Tomcat server deployment.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      featured: true,
      views: 324,
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      order: 1,
      category: "System Demo"
    },
    {
      id: "mock-video-2",
      title: "IoT Weather Monitoring Station Showcase",
      description: "Live recording of the IoT sensor array connecting to ThingSpeak. Showcases temperature, humidity, and ultrasonic readings powered by a Raspberry Pi Pico W.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      featured: false,
      views: 145,
      createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      order: 2,
      category: "IoT / Hardware"
    },
    {
      id: "mock-video-3",
      title: "Virtual Kelulut Database Architecture & Queries",
      description: "Presentation covering structural database schema design, advanced CRUD queries, and indexed data retrieval models for UMT researchers.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      featured: false,
      views: 92,
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      order: 3,
      category: "Database"
    }
  ];

  localStorage.setItem(MOCK_VIDEOS_KEY, JSON.stringify(initialVideos));
  return initialVideos;
};

if (isMockMode) {
  seedMockData();
}

// ── Database Layer Abstraction ────────────────────────────────────

export const getVideos = async (): Promise<Video[]> => {
  if (isMockMode || (window as any)._isMockModeOverride) {
    const list = seedMockData();
    return list.sort((a, b) => a.order - b.order || b.createdAt - a.createdAt);
  }

  // Live Firestore fetch with timeout
  try {
    const q = query(collection(firestoreDb, "videos"), orderBy("order", "asc"));
    const querySnapshot = await withTimeout(getDocs(q), 3500, "Firestore database query timed out");
    const videos: Video[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      videos.push({
        id: docSnap.id,
        title: data.title || "",
        description: data.description || "",
        youtubeUrl: data.youtubeUrl || "",
        youtubeId: data.youtubeId || "",
        thumbnail: data.thumbnail || "",
        featured: !!data.featured,
        views: Number(data.views || 0),
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Number(data.createdAt || Date.now()),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : Number(data.updatedAt || Date.now()),
        order: Number(data.order || 0),
        category: data.category || "General"
      });
    });
    // Sort locally by order and createdAt to avoid Firestore composite index requirement
    return videos.sort((a, b) => a.order - b.order || b.createdAt - a.createdAt);
  } catch (error: any) {
    console.error("Firestore fetch failed. Falling back to Mock local database.", error);
    
    // Check if the query timed out or had a connection issue
    if (
      error?.message === "Firestore database query timed out" || 
      error?.code === "unavailable" || 
      error?.message?.includes("timed out") ||
      error?.message?.includes("unreachable")
    ) {
      console.warn("Firestore timed out or is unavailable. Enabling Mock Mode fallback override.");
      (window as any)._firestoreTimeout = true;
      isMockMode = true;
      (window as any)._isMockModeOverride = true;
      
      // Trigger session update for active listeners
      const saved = sessionStorage.getItem(MOCK_AUTH_KEY);
      triggerAuthChange(saved ? JSON.parse(saved) : null);
    }
    
    const list = seedMockData();
    return list.sort((a, b) => a.order - b.order || b.createdAt - a.createdAt);
  }
};

export const addVideo = async (video: Omit<Video, "id" | "views" | "createdAt" | "updatedAt" | "youtubeId" | "thumbnail">): Promise<string> => {
  const youtubeId = extractYoutubeId(video.youtubeUrl);
  const thumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  
  const newVideoData = {
    title: video.title,
    description: video.description,
    youtubeUrl: video.youtubeUrl,
    youtubeId,
    thumbnail,
    featured: video.featured,
    views: 0,
    order: Number(video.order),
    category: video.category || "General",
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  if (isMockMode || (window as any)._isMockModeOverride) {
    const list = seedMockData();
    const newId = `mock-video-${Date.now()}`;
    list.push({ id: newId, ...newVideoData });
    localStorage.setItem(MOCK_VIDEOS_KEY, JSON.stringify(list));
    return newId;
  }

  // Live Firestore
  const docRef = await addDoc(collection(firestoreDb, "videos"), {
    ...newVideoData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const updateVideo = async (id: string, video: Partial<Video>): Promise<void> => {
  const updates: any = { ...video, updatedAt: Date.now() };
  if (video.youtubeUrl) {
    const youtubeId = extractYoutubeId(video.youtubeUrl);
    updates.youtubeId = youtubeId;
    updates.thumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }

  if (isMockMode || (window as any)._isMockModeOverride) {
    const list = seedMockData();
    const index = list.findIndex(v => v.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      localStorage.setItem(MOCK_VIDEOS_KEY, JSON.stringify(list));
    }
    return;
  }

  // Live Firestore
  const cleanUpdates = { ...updates };
  delete cleanUpdates.id; // cannot update doc ID field
  if (cleanUpdates.createdAt) delete cleanUpdates.createdAt; // keep original timestamp
  
  // Format dates for Firestore
  cleanUpdates.updatedAt = Timestamp.now();

  const docRef = doc(firestoreDb, "videos", id);
  await updateDoc(docRef, cleanUpdates);
};

export const deleteVideo = async (id: string): Promise<void> => {
  if (isMockMode || (window as any)._isMockModeOverride) {
    const list = seedMockData();
    const filtered = list.filter(v => v.id !== id);
    localStorage.setItem(MOCK_VIDEOS_KEY, JSON.stringify(filtered));
    return;
  }

  // Live Firestore
  await deleteDoc(doc(firestoreDb, "videos", id));
};

export const incrementVideoViews = async (id: string): Promise<void> => {
  if (isMockMode || (window as any)._isMockModeOverride) {
    const list = seedMockData();
    const index = list.findIndex(v => v.id === id);
    if (index !== -1) {
      list[index].views += 1;
      localStorage.setItem(MOCK_VIDEOS_KEY, JSON.stringify(list));
    }
    return;
  }

  // Live Firestore
  try {
    const docRef = doc(firestoreDb, "videos", id);
    await updateDoc(docRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error("Failed to increment views in Firestore:", error);
  }
};

// ── Auth Layer Abstraction ────────────────────────────────────

export interface AuthStateUser {
  uid: string;
  email: string | null;
}

export const signIn = async (email: string, password: string): Promise<AuthStateUser> => {
  if (isMockMode || (window as any)._isMockModeOverride) {
    // Mock Login details: admin@example.com / admin123
    if (email === "admin@example.com" && password === "admin123") {
      const mockUser = { uid: "mock-admin-uid", email: "admin@example.com" };
      sessionStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(mockUser));
      
      // Trigger callback manually in active subscribers
      triggerAuthChange(mockUser);
      return mockUser;
    } else {
      throw new Error("Invalid admin credentials. (Mock Mode user is: admin@example.com / admin123)");
    }
  }

  // Live Firebase
  const credential = await fbSignIn(firebaseAuth, email, password);
  return {
    uid: credential.user.uid,
    email: credential.user.email
  };
};

export const logout = async (): Promise<void> => {
  // Clear local mock session credentials in either case
  sessionStorage.removeItem(MOCK_AUTH_KEY);
  triggerAuthChange(null);

  try {
    // Always sign out of live Firebase Auth if it was initialized
    if (firebaseAuth) {
      await fbSignOut(firebaseAuth);
    }
  } catch (error) {
    console.error("Firebase live logout failed:", error);
  }
};

// Simple custom listener array for Mock Auth state changes
const authSubscribers: ((user: AuthStateUser | null) => void)[] = [];

const triggerAuthChange = (user: AuthStateUser | null) => {
  authSubscribers.forEach(cb => cb(user));
};

export const subscribeAuth = (callback: (user: AuthStateUser | null) => void): (() => void) => {
  // Always register in mock subscribers to support dynamic switching
  authSubscribers.push(callback);
  
  // Call immediately with current mock state if mock fallback is active
  if (isMockMode || (window as any)._isMockModeOverride) {
    const saved = sessionStorage.getItem(MOCK_AUTH_KEY);
    callback(saved ? JSON.parse(saved) : null);
  }

  let unsubscribeLive: (() => void) | null = null;
  if (firebaseAuth) {
    unsubscribeLive = fbOnAuthStateChange(firebaseAuth, (user: User | null) => {
      // Only set live session if mock fallback is NOT active
      if (!(window as any)._isMockModeOverride) {
        if (user) {
          callback({ uid: user.uid, email: user.email });
        } else {
          callback(null);
        }
      }
    });
  }

  // Return unified unsubscribe function
  return () => {
    const idx = authSubscribers.indexOf(callback);
    if (idx !== -1) authSubscribers.splice(idx, 1);
    if (unsubscribeLive) unsubscribeLive();
  };
};

export const extractYoutubeId = (url: string): string => {
  if (!url) return "";
  
  try {
    // Check youtu.be/ID
    if (url.includes("youtu.be/")) {
      const parts = url.split("youtu.be/");
      if (parts[1]) {
        return parts[1].split(/[?#]/)[0];
      }
    }
    
    // Check youtube.com/shorts/ID
    if (url.includes("/shorts/")) {
      const parts = url.split("/shorts/");
      if (parts[1]) {
        return parts[1].split(/[?#]/)[0];
      }
    }
    
    // Check youtube.com/embed/ID
    if (url.includes("/embed/")) {
      const parts = url.split("/embed/");
      if (parts[1]) {
        return parts[1].split(/[?#]/)[0];
      }
    }

    // Check query param watch?v=ID
    if (url.includes("v=")) {
      const urlObj = new URL(url);
      const v = urlObj.searchParams.get("v");
      if (v) return v;
    }
    
    // Fallback regex match
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "";
  } catch (e) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "";
  }
};

// ── Student Profile Management ────────────────────────────────────

export interface StudentProfile {
  name: string;
  studentId: string;
  course: string;
  semester: string;
  lecturer: string;
}

const MOCK_PROFILE_KEY = "video_portfolio_student_profile";

const seedMockProfile = (): StudentProfile => {
  const existing = localStorage.getItem(MOCK_PROFILE_KEY);
  if (existing) {
    return JSON.parse(existing);
  }

  const defaultProfile: StudentProfile = {
    name: "Azmin Hassan",
    studentId: "S64721",
    course: "Bachelor of Computer Science (Software Engineering)",
    semester: "Semester 5 (Academic Year 2026/2027)",
    lecturer: "Dr. Wan Mohd Amir Fazamin"
  };

  localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(defaultProfile));
  return defaultProfile;
};

export const getStudentProfile = async (): Promise<StudentProfile> => {
  if (isMockMode || (window as any)._isMockModeOverride) {
    return seedMockProfile();
  }

  // Live Firestore fetch
  try {
    const docRef = doc(firestoreDb, "config", "studentProfile");
    const docSnap = await withTimeout(getDoc(docRef), 3500, "Firestore student profile query timed out");
    if (docSnap.exists()) {
      return docSnap.data() as StudentProfile;
    } else {
      const defaultProfile = seedMockProfile();
      await setDoc(docRef, defaultProfile);
      return defaultProfile;
    }
  } catch (error) {
    console.error("Firestore profile fetch failed. Falling back to local mock profile.", error);
    return seedMockProfile();
  }
};

export const updateStudentProfile = async (profile: StudentProfile): Promise<void> => {
  if (isMockMode || (window as any)._isMockModeOverride) {
    localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(profile));
    return;
  }

  // Live Firestore update
  try {
    const docRef = doc(firestoreDb, "config", "studentProfile");
    await setDoc(docRef, profile);
  } catch (error) {
    console.error("Firestore profile update failed, saving locally:", error);
    localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(profile));
  }
};
