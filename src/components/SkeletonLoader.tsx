import React from "react";

export const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="border border-portfolio-border dark:border-portfolio-dark-border rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm animate-pulse flex flex-col gap-4">
      {/* Thumbnail Aspect Box */}
      <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
      
      {/* Category & Date Line */}
      <div className="flex justify-between items-center mt-1">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
      </div>
      
      {/* Title */}
      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mt-2"></div>
      
      {/* Description lines */}
      <div className="space-y-2 mt-1">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      </div>

      {/* Button */}
      <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-lg w-full mt-auto"></div>
    </div>
  );
};

export const VideoGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <VideoCardSkeleton />
      <VideoCardSkeleton />
      <VideoCardSkeleton />
    </div>
  );
};

export const SpotlightSkeleton: React.FC = () => {
  return (
    <div className="border border-portfolio-border dark:border-portfolio-dark-border bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm animate-pulse mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Video Player */}
        <div className="lg:col-span-3 aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl w-full"></div>
        
        {/* Right Copy details */}
        <div className="lg:col-span-2 flex flex-col gap-4 justify-center">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
          <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
          <div className="space-y-2 mt-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
          </div>
        </div>

      </div>
    </div>
  );
};
