import React, { useState, useEffect } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
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
    // Unconditionally apply light/white mode to match the main portfolio
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (currentPath !== "/") {
      // First navigate back to the main page
      onNavigate("/");
      // Set the hash so Portfolio knows where to scroll on mount
      window.location.hash = `#${sectionId}`;
    } else {
      // Scroll locally if already on the main page
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/96 border-b border-slate-200 backdrop-blur-md shadow-sm transition-colors duration-200" role="banner">
      <div className="max-w-[1100px] mx-auto px-5 flex items-center justify-between h-16">

        {/* Brand Logo - Matches Main Portfolio Style & Casing */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onNavigate("/"); }}
          className="font-bold text-[#0F172A] hover:text-[#4F46E5] transition-colors tracking-wide text-base shrink-0"
          aria-label="Azmin Hassan — home"
        >
          Azmin Hassan
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
          <a
            href="#summary"
            onClick={(e) => handleNavClick(e, "summary")}
            className="text-sm font-medium text-slate-600 hover:text-[#4F46E5] transition-colors"
          >
            Summary
          </a>

          <a
            href="#skills"
            onClick={(e) => handleNavClick(e, "skills")}
            className="text-sm font-medium text-slate-600 hover:text-[#4F46E5] transition-colors"
          >
            Skills
          </a>

          <a
            href="#experience"
            onClick={(e) => handleNavClick(e, "experience")}
            className="text-sm font-medium text-slate-600 hover:text-[#4F46E5] transition-colors"
          >
            Experience
          </a>

          <a
            href="#projects"
            onClick={(e) => handleNavClick(e, "projects")}
            className="text-sm font-medium text-slate-600 hover:text-[#4F46E5] transition-colors"
          >
            Projects
          </a>

          <a
            href="#education"
            onClick={(e) => handleNavClick(e, "education")}
            className="text-sm font-medium text-slate-600 hover:text-[#4F46E5] transition-colors"
          >
            Education
          </a>

          <a
            href="#resume"
            onClick={(e) => handleNavClick(e, "resume")}
            className="text-sm font-medium text-slate-600 hover:text-[#4F46E5] transition-colors"
          >
            Resume
          </a>

          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate("/eop"); }}
            className={`text-sm font-medium transition-colors ${currentPath === "/eop" ? "text-[#4F46E5] font-semibold" : "text-slate-600 hover:text-[#4F46E5]"}`}
          >
            EOP Assessment
          </a>

          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <User className="w-3.5 h-3.5" />
                {user.email?.split("@")[0]}
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-semibold cursor-pointer py-1 px-2 hover:bg-red-50 rounded"
                title="Log out from Admin panel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </nav>

        {/* ATS Mode Button - Matches Main Portfolio Layout */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="ats.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border border-slate-200 rounded-md py-1.5 px-3 text-xs font-semibold text-slate-700 bg-transparent hover:bg-slate-50 transition-colors"
            id="nav-ats-btn"
            aria-label="Open ATS-optimised resume view (opens in new tab)"
            title="ATS Mode — plain text resume for job applications"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            ATS Mode
          </a>
        </div>

        {/* Mobile Hamburger Controls */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-slate-200 rounded-lg text-slate-700"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-200 bg-white px-5 py-4 flex flex-col gap-4 shadow-lg" aria-label="Mobile navigation">
          <a
            href="#summary"
            onClick={(e) => handleNavClick(e, "summary")}
            className="py-2 text-sm font-medium border-b border-slate-100 text-slate-600"
          >
            Summary
          </a>

          <a
            href="#skills"
            onClick={(e) => handleNavClick(e, "skills")}
            className="py-2 text-sm font-medium border-b border-slate-100 text-slate-600"
          >
            Skills
          </a>

          <a
            href="#experience"
            onClick={(e) => handleNavClick(e, "experience")}
            className="py-2 text-sm font-medium border-b border-slate-100 text-slate-600"
          >
            Experience
          </a>

          <a
            href="#projects"
            onClick={(e) => handleNavClick(e, "projects")}
            className="py-2 text-sm font-medium border-b border-slate-100 text-slate-600"
          >
            Projects
          </a>

          <a
            href="#education"
            onClick={(e) => handleNavClick(e, "education")}
            className="py-2 text-sm font-medium border-b border-slate-100 text-slate-600"
          >
            Education
          </a>

          <a
            href="#resume"
            onClick={(e) => handleNavClick(e, "resume")}
            className="py-2 text-sm font-medium border-b border-slate-100 text-slate-600"
          >
            Resume
          </a>

          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate("/eop"); setMobileMenuOpen(false); }}
            className={`py-2 text-sm font-medium border-b border-slate-100 ${currentPath === "/eop" ? "text-[#4F46E5] font-semibold" : "text-slate-600"}`}
          >
            EOP Assessment
          </a>

          <a
            href="ats.html"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 text-sm font-semibold text-slate-700 flex items-center gap-1.5 border-b border-slate-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            ATS Mode
          </a>

          {user && (
            <div className="pt-2 flex flex-col gap-2">
              <span className="text-xs text-slate-500 font-medium">
                Signed in as: {user.email?.split("@")[0]}
              </span>
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-1.5 text-sm w-full py-2 bg-red-50 text-red-500 rounded font-semibold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};
