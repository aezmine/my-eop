import React, { useState, useEffect } from "react";
import { 
  Search, Play, LayoutGrid, Calendar, Eye, AlertCircle,
  BookOpen, User, GraduationCap, Award, CheckCircle, Quote, Target 
} from "lucide-react";
import { getVideos, incrementVideoViews, isMockMode, getStudentProfile } from "../firebase";
import type { Video, StudentProfile } from "../firebase";
import { VideoCard } from "../components/VideoCard";
import { SpotlightSkeleton, VideoGridSkeleton } from "../components/SkeletonLoader";

interface HomeProps {
  onPlayVideo: (video: Video) => void;
}

export const Home: React.FC<HomeProps> = ({ onPlayVideo }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  // Fetch Videos & Profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [videosData, profileData] = await Promise.all([
          getVideos(),
          getStudentProfile()
        ]);
        setVideos(videosData);
        setProfile(profileData);
        
        // Extract unique categories dynamically
        const uniqueCategories = ["All", ...Array.from(new Set(videosData.map(v => v.category)))];
        setCategories(uniqueCategories);
        setError(null);
      } catch (err) {
        console.error("Error fetching homepage details:", err);
        setError("Failed to load showcase videos. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Play handler with view incrementation
  const handlePlayVideo = async (video: Video) => {
    onPlayVideo(video);
    
    // Optimistic local count increment
    setVideos(prev => 
      prev.map(v => v.id === video.id ? { ...v, views: v.views + 1 } : v)
    );

    // DB update
    try {
      await incrementVideoViews(video.id);
    } catch (err) {
      console.error("Could not update view count:", err);
    }
  };

  // Filter Logic
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Spotlight featured selector (prefer featured video, fallback to first in list)
  const spotlightVideo = videos.find(v => v.featured) || videos[0];

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-8 flex flex-col min-h-screen">
      
      {/* Dynamic Mock Mode Warning Banner */}
      {!loading && (isMockMode || (window as any)._firestoreTimeout) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 rounded-xl mb-6 text-xs font-semibold animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
            <span>Active State: Mock Database (Local Storage)</span>
            {(window as any)._firestoreTimeout && (
              <span className="font-normal text-amber-600 dark:text-amber-400 sm:border-l sm:border-amber-300 dark:sm:border-amber-850 sm:pl-2">
                (Firestore database query timed out. Fallback active)
              </span>
            )}
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
            Configure live Firebase credentials in .env to connect a database.
          </span>
        </div>
      )}

      {/* ── EOP Portal Hero Section ────────────────── */}
      {!loading && profile && (
        <section className="bg-white dark:bg-slate-800 border border-portfolio-border dark:border-portfolio-dark-border p-6 md:p-8 rounded-2xl shadow-sm mb-10 overflow-hidden transition-colors duration-200 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: Introduction & Overview (Span 7) */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-portfolio-text-primary dark:text-portfolio-dark-text-primary leading-tight mb-3">
                  English for Occupational Purposes (EOP) Assessment
                </h1>
                <p className="text-sm md:text-base text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary leading-relaxed font-medium">
                  This website presents my English for Occupational Purposes (EOP) assessment. The videos showcase my communication, presentation, and workplace English skills developed throughout the course.
                </p>
              </div>

              {/* Assessment Overview */}
              <div className="border-t border-portfolio-border dark:border-portfolio-dark-border pt-5">
                <h3 className="text-xs font-bold text-portfolio-accent dark:text-indigo-400 uppercase tracking-wider mb-3">
                  Assessment Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <BookOpen className="w-5 h-5 text-portfolio-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-portfolio-text-muted dark:text-portfolio-dark-text-muted tracking-wider block">Course</span>
                      <strong className="text-xs font-semibold text-portfolio-text-primary dark:text-portfolio-dark-text-primary">English for Occupational Purposes (EOP)</strong>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Award className="w-5 h-5 text-portfolio-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-portfolio-text-muted dark:text-portfolio-dark-text-muted tracking-wider block">Assessment Type</span>
                      <strong className="text-xs font-semibold text-portfolio-text-primary dark:text-portfolio-dark-text-primary">Video Presentation</strong>
                    </div>
                  </div>
                  <div className="flex gap-3 sm:col-span-2">
                    <Target className="w-5 h-5 text-portfolio-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-portfolio-text-muted dark:text-portfolio-dark-text-muted tracking-wider block">Core Objective</span>
                      <strong className="text-xs font-semibold text-portfolio-text-primary dark:text-portfolio-dark-text-primary leading-tight block">
                        Demonstrate professional communication and presentation skills in English.
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Student Information Card (Span 5) */}
            <div className="lg:col-span-5 bg-portfolio-bg dark:bg-slate-900/60 border border-portfolio-border dark:border-portfolio-dark-border p-6 rounded-xl flex flex-col justify-center gap-5 transition-all hover:shadow-md hover:border-portfolio-accent-border/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-tr from-portfolio-accent to-indigo-400 rounded-full flex items-center justify-center text-white text-lg font-black shadow-inner">
                  {profile.name ? profile.name.split(" ").map(n => n[0]).join("") : "AH"}
                </div>
                <div>
                  <h2 className="text-lg font-black text-portfolio-text-primary dark:text-portfolio-dark-text-primary leading-tight">
                    {profile.name}
                  </h2>
                  <span className="text-[10px] font-bold text-portfolio-accent dark:text-indigo-400 uppercase tracking-widest block mt-0.5">
                    Student Showcase Profile
                  </span>
                </div>
              </div>

              <div className="border-t border-portfolio-border dark:border-portfolio-dark-border pt-4 space-y-3.5">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-portfolio-text-muted shrink-0" />
                  <span className="text-xs font-semibold text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary min-w-[80px]">Student ID:</span>
                  <strong className="text-xs font-mono font-bold text-portfolio-text-primary dark:text-portfolio-dark-text-primary">{profile.studentId}</strong>
                </div>
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-4 h-4 text-portfolio-text-muted shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary min-w-[80px] mt-0.5">Program:</span>
                  <strong className="text-xs font-semibold text-portfolio-text-primary dark:text-portfolio-dark-text-primary leading-normal flex-1">{profile.course}</strong>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-portfolio-text-muted shrink-0" />
                  <span className="text-xs font-semibold text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary min-w-[80px]">Semester:</span>
                  <strong className="text-xs font-semibold text-portfolio-text-primary dark:text-portfolio-dark-text-primary">{profile.semester}</strong>
                </div>
                {profile.lecturer && (
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-portfolio-text-muted shrink-0" />
                    <span className="text-xs font-semibold text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary min-w-[80px]">Lecturer:</span>
                    <strong className="text-xs font-semibold text-portfolio-text-primary dark:text-portfolio-dark-text-primary">{profile.lecturer}</strong>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ── About EOP & Objectives Grid Section ────────────────── */}
      {!loading && (
        <section className="mb-10 animate-fadeIn" aria-label="Course details and objectives">
          <div className="bg-portfolio-bg dark:bg-slate-800/20 border border-portfolio-border dark:border-portfolio-dark-border p-6 md:p-8 rounded-2xl shadow-sm transition-colors duration-200">
            <h2 className="text-base font-extrabold text-portfolio-text-primary dark:text-portfolio-dark-text-primary uppercase tracking-wider mb-3">
              About EOP & Course Objectives
            </h2>
            <p className="text-xs md:text-sm text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary leading-relaxed mb-6">
              English for Occupational Purposes (EOP) focuses on developing communication skills needed in professional and workplace environments. The course helps students improve their ability to communicate effectively through presentations, discussions, teamwork, and professional interactions.
            </p>

            <h3 className="text-xs font-bold text-portfolio-text-muted dark:text-portfolio-dark-text-muted uppercase tracking-wider mb-4">
              Core Assessment Objectives
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { title: "Effective English", desc: "Demonstrate effective English communication skills." },
                { title: "Presentation Confidence", desc: "Develop confidence in professional presentations." },
                { title: "Workplace Strategy", desc: "Apply workplace communication strategies." },
                { title: "Teamwork & Collab", desc: "Improve teamwork and collaboration skills." },
                { title: "Occupational Prep", desc: "Prepare for real-world occupational environments." }
              ].map((obj, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 border border-portfolio-border dark:border-portfolio-dark-border p-4 rounded-xl shadow-xs flex flex-col gap-2 transition-all hover:shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-portfolio-accent-light dark:bg-portfolio-dark-accent-light text-portfolio-accent flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-portfolio-accent" />
                  </div>
                  <strong className="text-xs font-bold text-portfolio-text-primary dark:text-portfolio-dark-text-primary block mt-1">
                    {obj.title}
                  </strong>
                  <p className="text-[11px] font-medium text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary leading-normal">
                    {obj.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Spotlight / Featured Section ────────────────── */}
      {loading ? (
        <SpotlightSkeleton />
      ) : error ? (
        <div className="flex items-center gap-3 p-5 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-xl mb-8">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : spotlightVideo ? (
        <section className="border border-portfolio-border dark:border-portfolio-dark-border bg-white dark:bg-slate-800/40 rounded-2xl p-6 md:p-8 shadow-sm mb-10 overflow-hidden" aria-label="Featured assessment video">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            
            {/* Spotlight Video Image Panel */}
            <div className="lg:col-span-3 relative aspect-video rounded-xl overflow-hidden shadow-md bg-slate-100 dark:bg-slate-700 group">
              <img 
                src={spotlightVideo.thumbnail} 
                alt={spotlightVideo.title} 
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                <button
                  onClick={() => handlePlayVideo(spotlightVideo)}
                  className="w-16 h-16 bg-portfolio-accent hover:bg-portfolio-accent-hover text-white rounded-full flex items-center justify-center shadow-xl transition-transform scale-95 hover:scale-100 cursor-pointer"
                  aria-label="Play spotlight video"
                >
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
              </div>
              <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded shadow">
                Featured Spotlight
              </div>
              <div className="absolute bottom-4 right-4 bg-slate-900/60 text-white text-xs font-semibold py-1 px-3 rounded-full backdrop-blur-sm">
                {spotlightVideo.category}
              </div>
            </div>

            {/* Spotlight Video Text Descriptions */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <span className="text-xs font-bold text-portfolio-accent uppercase tracking-wider">
                Most View Assessment
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-portfolio-text-primary dark:text-portfolio-dark-text-primary leading-tight">
                {spotlightVideo.title}
              </h2>
              <p className="text-sm text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary leading-relaxed">
                {spotlightVideo.description}
              </p>
              
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-portfolio-text-muted dark:text-portfolio-dark-text-muted border-t border-portfolio-border dark:border-portfolio-dark-border pt-4 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(spotlightVideo.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {spotlightVideo.views} views
                </span>
              </div>

              <button
                onClick={() => handlePlayVideo(spotlightVideo)}
                className="mt-2 py-3 px-6 bg-portfolio-accent hover:bg-portfolio-accent-hover text-white rounded-xl text-xs font-bold tracking-wide transition-colors cursor-pointer shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 self-start"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Showcase Video</span>
              </button>
            </div>

          </div>
        </section>
      ) : null}

      {/* ── Search and Category Filters ────────────────── */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8" aria-label="Search and filter controls">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-portfolio-text-muted dark:text-portfolio-dark-text-muted" />
          <input
            type="text"
            placeholder="Search assessments by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control pl-10"
            aria-label="Search assessments"
          />
        </div>

        {/* Category Filter Badges */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center justify-start md:justify-end">
          <span className="text-xs font-bold text-portfolio-text-muted dark:text-portfolio-dark-text-muted uppercase tracking-wider mr-2 hidden lg:inline-block">
            Filter:
          </span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`py-1.5 px-3.5 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                selectedCategory === category
                  ? "bg-portfolio-accent border-portfolio-accent text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 border-portfolio-border dark:border-portfolio-dark-border text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary hover:border-portfolio-accent"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

      </section>

      {/* ── Public Video Show Grid ─────────────────────── */}
      <section aria-label="Assessment videos catalog">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-portfolio-border dark:border-portfolio-dark-border">
          <h2 className="text-base font-extrabold text-portfolio-text-primary dark:text-portfolio-dark-text-primary uppercase tracking-wider flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-portfolio-accent" />
            <span>Assessment Catalog</span>
          </h2>
          <span className="text-xs text-portfolio-text-muted dark:text-portfolio-dark-text-muted font-bold uppercase">
            {filteredVideos.length} {filteredVideos.length === 1 ? "video" : "videos"} found
          </span>
        </div>

        {loading ? (
          <VideoGridSkeleton />
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onPlay={handlePlayVideo} 
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-portfolio-border-dark dark:border-portfolio-dark-border rounded-2xl py-16 px-6 text-center bg-white/50 dark:bg-slate-800/10 flex flex-col items-center gap-3">
            <Search className="w-10 h-10 text-portfolio-text-muted dark:text-portfolio-dark-text-muted animate-pulse" />
            <h3 className="text-lg font-bold text-portfolio-text-primary dark:text-portfolio-dark-text-primary">No videos matched query</h3>
            <p className="text-xs text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary max-w-sm">
              We couldn't find any assessments matching search queries or filters. Try adjusting query tags or keywords.
            </p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="mt-2 py-2 px-4 bg-portfolio-accent text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ── Reflection Section ─────────────────────────── */}
      {!loading && (
        <section className="mt-12 border-t border-portfolio-border dark:border-portfolio-dark-border pt-8 mb-4 animate-fadeIn" aria-label="Student reflection">
          <div className="bg-white dark:bg-slate-800 border border-portfolio-border dark:border-portfolio-dark-border p-6 md:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-5 items-start">
            <div className="p-3 bg-portfolio-accent-light dark:bg-portfolio-dark-accent-light text-portfolio-accent rounded-xl shrink-0">
              <Quote className="w-6 h-6 fill-current text-portfolio-accent" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-portfolio-text-primary dark:text-portfolio-dark-text-primary uppercase tracking-wider">
                Personal Reflection
              </h3>
              <blockquote className="text-sm text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary leading-relaxed italic">
                "Through these assessments, I improved my confidence in public speaking, professional communication, and the use of English in workplace-related situations."
              </blockquote>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
