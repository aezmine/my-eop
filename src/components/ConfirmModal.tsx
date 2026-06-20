import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  confirmText = "Delete Video",
  cancelText = "Cancel",
  isOpen,
  onClose,
  onConfirm
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-xl max-w-md w-full border border-portfolio-border dark:border-portfolio-dark-border animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
      >
        <div className="p-6 flex flex-col gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 id="confirm-title" className="text-lg font-bold text-portfolio-text-primary dark:text-portfolio-dark-text-primary">
              {title}
            </h3>
            <button 
              onClick={onClose}
              className="ml-auto p-1.5 hover:bg-portfolio-surface-alt dark:hover:bg-slate-700 text-portfolio-text-muted hover:text-portfolio-text-primary dark:hover:text-portfolio-dark-text-primary rounded cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p id="confirm-desc" className="text-sm text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3 justify-end mt-2">
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-portfolio-surface-alt dark:hover:bg-slate-700 border border-portfolio-border-dark dark:border-portfolio-dark-border text-portfolio-text-primary dark:text-portfolio-dark-text-primary rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm"
            >
              {confirmText}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
