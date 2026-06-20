import React from "react";
import { Play, Eye, Calendar, Award } from "lucide-react";
import type { Video } from "../firebase";

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
  const formattedDate = new Date(video.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <article className="group border border-portfolio-border dark:border-portfolio-dark-border rounded-xl p-5 bg-white dark:bg-slate-800/50 hover:border-portfolio-accent-border dark:hover:border-portfolio-dark-accent-border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4 transform hover:-translate-y-1">
      
      {/* Thumbnail Aspect Container */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 shadow-inner shrink-0">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button 
            onClick={() => onPlay(video)}
            className="w-12 h-12 bg-portfolio-accent hover:bg-portfolio-accent-hover text-white rounded-full flex items-center justify-center shadow-lg transition-transform scale-90 group-hover:scale-100 cursor-pointer"
            aria-label={`Play ${video.title}`}
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>

        {/* Featured Overlay Badge */}
        {video.featured && (
          <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wide bg-amber-500 text-white py-1 px-2 rounded shadow">
            <Award className="w-3 h-3" />
            <span>Featured</span>
          </div>
        )}

        {/* Category Tag */}
        <div className="absolute bottom-2 right-2 text-[10px] font-semibold bg-slate-900/70 text-white backdrop-blur-sm py-0.5 px-2 rounded-full">
          {video.category}
        </div>
      </div>

      {/* Date & Views Row */}
      <div className="flex justify-between items-center text-xs text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary font-medium">
        <span className="flex items-center gap-1 text-portfolio-text-muted dark:text-portfolio-dark-text-muted">
          <Calendar className="w-3.5 h-3.5" />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1 text-portfolio-text-muted dark:text-portfolio-dark-text-muted">
          <Eye className="w-3.5 h-3.5" />
          {video.views} views
        </span>
      </div>

      {/* Text Copy Details */}
      <div className="flex flex-col gap-1.5 flex-1">
        <h3 className="text-base font-bold text-portfolio-text-primary dark:text-portfolio-dark-text-primary line-clamp-1 group-hover:text-portfolio-accent transition-colors leading-tight">
          {video.title}
        </h3>
        <p className="text-xs text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary line-clamp-2 leading-relaxed">
          {video.description}
        </p>
      </div>

      {/* Action Play Button */}
      <button 
        onClick={() => onPlay(video)}
        className="w-full mt-auto py-2.5 px-4 bg-portfolio-accent-light dark:bg-portfolio-dark-accent-light hover:bg-portfolio-accent hover:text-white dark:hover:bg-portfolio-accent border border-portfolio-accent-border dark:border-portfolio-dark-accent-border hover:border-portfolio-accent rounded-lg text-xs font-semibold text-portfolio-accent dark:text-indigo-300 transition-all cursor-pointer flex items-center justify-center gap-1.5"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        <span>Watch Assessment</span>
      </button>

    </article>
  );
};
