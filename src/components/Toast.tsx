import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "error" | "info";
}

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-800 dark:text-emerald-200",
      icon: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
    },
    error: {
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-200",
      icon: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
    },
    info: {
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
      border: "border-indigo-200 dark:border-indigo-800",
      text: "text-indigo-800 dark:text-indigo-200",
      icon: <Info className="w-5 h-5 text-indigo-500 shrink-0" />
    }
  }[type];

  return (
    <div 
      className={`fixed bottom-5 right-5 z-50 flex items-start gap-3 p-4 rounded-xl border ${config.bg} ${config.border} ${config.text} shadow-lg max-w-sm w-full animate-slide-up`}
      role="alert"
    >
      {config.icon}
      <div className="flex-1 text-sm font-medium pr-2 break-words leading-snug">
        {message}
      </div>
      <button 
        onClick={onClose} 
        className="text-portfolio-text-muted hover:text-portfolio-text-primary dark:hover:text-portfolio-dark-text-primary p-0.5 rounded cursor-pointer"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 shrink-0" />
      </button>
    </div>
  );
};

// CSS class for slide-up animation is handled via simple utility classes or tailwind config
