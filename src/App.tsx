import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Portfolio } from "./pages/Portfolio";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Toast } from "./components/Toast";
import type { ToastMessage } from "./components/Toast";
import { VideoModal } from "./components/VideoModal";
import { subscribeAuth, logout } from "./firebase";
import type { Video, AuthStateUser } from "./firebase";

function App() {
  const [user, setUser] = useState<AuthStateUser | null>(null);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    // Basic route parsing from hash or url path
    const hash = window.location.hash;
    if (hash === "#/admin" || window.location.pathname === "/admin") {
      return "/admin";
    }
    if (hash === "#/eop" || window.location.pathname === "/eop") {
      return "/eop";
    }
    return "/";
  });

  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 1. Listen for Auth State changes
  useEffect(() => {
    const unsubscribe = subscribeAuth((activeUser) => {
      setUser(activeUser);
    });
    return () => unsubscribe();
  }, []);

  // Sync hash routing triggers
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      if (hash === "#/admin") {
        setCurrentPath("/admin");
      } else if (hash === "#/eop") {
        setCurrentPath("/eop");
      } else {
        setCurrentPath("/");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    // Sync hash to allow browser navigation back/forward support
    if (path === "/admin") {
      window.location.hash = "/admin";
    } else if (path === "/eop") {
      window.location.hash = "/eop";
    } else {
      window.location.hash = "";
    }
    window.scrollTo(0, 0);
  };

  // 2. Toast managers
  const showToast = (text: string, type: "success" | "error" | "info") => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}`,
      text,
      type
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 3. Auth Actions
  const handleLogout = async () => {
    try {
      await logout();
      showToast("Signed out of administrator session.", "success");
      navigateTo("/eop");
    } catch (err) {
      showToast("Failed to sign out.", "error");
    }
  };

  if (currentPath === "/") {
    return <Portfolio onNavigate={navigateTo} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-portfolio-bg dark:bg-portfolio-dark-bg text-portfolio-text-primary dark:text-portfolio-dark-text-primary transition-colors duration-200">
      
      {/* Universal Sticky Nav Header */}
      <Header 
        user={user} 
        onLogout={handleLogout} 
        currentPath={currentPath} 
        onNavigate={navigateTo} 
      />

      {/* Primary Page Router */}
      <main className="flex-1">
        {currentPath === "/admin" ? (
          user ? (
            <AdminDashboard onShowToast={showToast} />
          ) : (
            <AdminLogin 
              user={user}
              onLoginSuccess={() => {
                showToast("Welcome to Admin Dashboard!", "success");
                navigateTo("/admin");
              }} 
              onNavigate={navigateTo}
            />
          )
        ) : (
          <Home onPlayVideo={setActiveVideo} />
        )}
      </main>

      {/* Universal Footer */}
      <Footer />

      {/* Overlay Modal Player */}
      {activeVideo && (
        <VideoModal 
          video={activeVideo} 
          onClose={() => setActiveVideo(null)} 
        />
      )}

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((toast) => (
          <Toast 
            key={toast.id} 
            message={toast.text} 
            type={toast.type} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>

    </div>
  );
}

export default App;
