import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-portfolio-border dark:border-portfolio-dark-border bg-white dark:bg-slate-900 py-6 transition-colors duration-200 mt-auto">
      <div className="max-w-[1100px] mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <p className="text-xs text-portfolio-text-muted dark:text-portfolio-dark-text-muted">
          &copy; {new Date().getFullYear()} Azmin Hassan. All rights reserved.
        </p>
        <nav className="flex items-center gap-5" aria-label="Footer links">
          <a 
            href="https://github.com/aezmine" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-portfolio-text-muted dark:text-portfolio-dark-text-muted hover:text-portfolio-accent transition-colors"
          >
            GitHub
          </a>
          <a 
            href="https://www.linkedin.com/in/aezmine/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-portfolio-text-muted dark:text-portfolio-dark-text-muted hover:text-portfolio-accent transition-colors"
          >
            LinkedIn
          </a>
          <a 
            href="mailto:aezmine@gmail.com"
            className="text-xs text-portfolio-text-muted dark:text-portfolio-dark-text-muted hover:text-portfolio-accent transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
};
