import React, { useState, useEffect } from "react";
import { Menu, X, Video, LogOut, User } from "lucide-react";
import type { AuthStateUser } from "../firebase";

interface HeaderProps {
  user: AuthStateUser | null;
  onLogout: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Unconditionally apply light/white mode
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 border-b border-portfolio-border dark:border-portfolio-dark-border backdrop-blur-md transition-colors duration-200">
      <div className="max-w-[1100px] mx-auto px-5 flex items-center justify-between min-height h-16">

        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onNavigate("/eop"); }}
          className="flex items-center gap-2 font-bold text-portfolio-text-primary dark:text-portfolio-dark-text-primary tracking-wide text-lg"
          aria-label="Video Showcase Homepage"
        >
          <Video className="w-5 h-5 text-portfolio-accent" />
          <span>AZMIN EOP</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate("/eop"); }}
            className={`text-sm font-medium transition-colors ${currentPath === "/eop" ? "text-portfolio-accent font-semibold" : "text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary hover:text-portfolio-accent"}`}
          >
            Videos Showcase
          </a>

          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate("/"); }}
            className="text-sm font-medium text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary hover:text-portfolio-accent transition-colors"
          >
            Main Portfolio
          </a>

          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-portfolio-border dark:border-portfolio-dark-border">
              <span className="flex items-center gap-1.5 text-xs text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary font-medium">
                <User className="w-3.5 h-3.5" />
                {user.email?.split("@")[0]}
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-semibold cursor-pointer py-1 px-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                title="Log out from Admin panel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Controls */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-portfolio-border dark:border-portfolio-dark-border rounded-lg text-portfolio-text-primary dark:text-portfolio-dark-text-primary"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-portfolio-border dark:border-portfolio-dark-border bg-white dark:bg-slate-900 px-5 py-4 flex flex-col gap-4 shadow-lg animate-fade-in" aria-label="Mobile navigation">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate("/eop"); setMobileMenuOpen(false); }}
            className={`py-2 text-sm font-medium border-b border-portfolio-border/50 dark:border-portfolio-dark-border/50 ${currentPath === "/eop" ? "text-portfolio-accent font-semibold" : "text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary"}`}
          >
            Videos Showcase
          </a>

          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate("/"); setMobileMenuOpen(false); }}
            className="py-2 text-sm font-medium border-b border-portfolio-border/50 dark:border-portfolio-dark-border/50 text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary"
          >
            Main Portfolio
          </a>

          {user && (
            <div className="flex flex-col gap-3 pt-2">
              <span className="flex items-center gap-1.5 text-xs text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary font-medium">
                <User className="w-3.5 h-3.5" />
                Active Account: {user.email}
              </span>
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-1.5 text-sm w-full py-2 bg-red-50 dark:bg-red-950/20 text-red-500 rounded font-semibold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};
