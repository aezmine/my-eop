import React, { useEffect } from "react";
import { X, Eye, Calendar, Award } from "lucide-react";
import type { Video } from "../firebase";

interface VideoModalProps {
  video: Video;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  // Lock background scrolling when modal is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Close modal on escape keypress
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const formattedDate = new Date(video.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full flex flex-col border border-portfolio-border dark:border-portfolio-dark-border animate-scale-up"
        onClick={(e) => e.stopPropagation()} // prevent close on clicking card content
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-video-title"
      >
        
        {/* Video Responsive Embed Area */}
        <div className="relative aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Info Area */}
        <div className="p-6 md:p-8 flex flex-col gap-4">
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              
              {/* Category & Featured Badges */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-portfolio-accent bg-portfolio-accent-light dark:bg-portfolio-dark-accent-light border border-portfolio-accent-border dark:border-portfolio-dark-accent-border py-0.5 px-2 rounded-full">
                  {video.category}
                </span>
                {video.featured && (
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 py-0.5 px-2 rounded-full">
                    <Award className="w-3 h-3" />
                    <span>Featured</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 id="modal-video-title" className="text-xl font-bold text-portfolio-text-primary dark:text-portfolio-dark-text-primary leading-tight">
                {video.title}
              </h2>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 border border-portfolio-border dark:border-portfolio-dark-border hover:bg-portfolio-surface-alt dark:hover:bg-slate-700 text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary rounded-lg transition-colors cursor-pointer shrink-0"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Views & Date Metadata */}
          <div className="flex gap-4 text-xs font-semibold text-portfolio-text-muted dark:text-portfolio-dark-text-muted border-b border-portfolio-border dark:border-portfolio-dark-border pb-3.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Uploaded on {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {video.views + 1} views
            </span>
          </div>

          {/* Description */}
          <div className="max-h-40 overflow-y-auto pr-1 text-sm text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary leading-relaxed">
            {video.description}
          </div>

        </div>

      </div>
    </div>
  );
};
