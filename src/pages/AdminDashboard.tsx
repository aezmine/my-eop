import React, { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, ArrowUp, ArrowDown, Layout, Film, Eye, Play,
  BarChart2, FileText, RefreshCw, Sparkles, AlertTriangle, User
} from "lucide-react";
import { 
  getVideos, addVideo, updateVideo, deleteVideo, 
  extractYoutubeId, isMockMode, getStudentProfile, updateStudentProfile 
} from "../firebase";
import type { Video } from "../firebase";
import { ConfirmModal } from "../components/ConfirmModal";

interface AdminDashboardProps {
  onShowToast: (msg: string, type: "success" | "error" | "info") => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onShowToast }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"manage" | "add" | "profile">("manage");
  
  // Student Profile Form State
  const [profileName, setProfileName] = useState("");
  const [profileId, setProfileId] = useState("");
  const [profileCourse, setProfileCourse] = useState("");
  const [profileSemester, setProfileSemester] = useState("");
  const [profileLecturer, setProfileLecturer] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formCategory, setFormCategory] = useState("System Demo");
  const [formDescription, setFormDescription] = useState("");
  const [formOrder, setFormOrder] = useState<number>(0);
  const [formFeatured, setFormFeatured] = useState(false);
  const [youtubePreviewId, setYoutubePreviewId] = useState("");
  
  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Video | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Load Videos
  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await getVideos();
      setVideos(data);
      // Auto-set default order number for new videos
      if (data.length > 0 && !editingId) {
        setFormOrder(Math.max(...data.map(v => v.order)) + 1);
      } else {
        setFormOrder(1);
      }
    } catch (error) {
      console.error("Failed to load catalog:", error);
      onShowToast("Failed to load catalog.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load Student Profile
  const loadProfile = async () => {
    try {
      const data = await getStudentProfile();
      setProfileName(data.name);
      setProfileId(data.studentId);
      setProfileCourse(data.course);
      setProfileSemester(data.semester);
      setProfileLecturer(data.lecturer || "");
    } catch (error) {
      console.error("Failed to load student profile:", error);
    }
  };

  useEffect(() => {
    loadVideos();
    loadProfile();
  }, []);

  // Update live preview ID on URL changes
  useEffect(() => {
    if (formUrl) {
      const parsedId = extractYoutubeId(formUrl);
      setYoutubePreviewId(parsedId);
    } else {
      setYoutubePreviewId("");
    }
  }, [formUrl]);

  // Tab switcher logic
  const handleEditClick = (video: Video) => {
    setEditingId(video.id);
    setFormTitle(video.title);
    setFormUrl(video.youtubeUrl);
    setFormCategory(video.category);
    setFormDescription(video.description);
    setFormOrder(video.order);
    setFormFeatured(video.featured);
    setYoutubePreviewId(video.youtubeId);
    setActiveTab("add");
  };

  const handleResetForm = () => {
    setEditingId(null);
    setFormTitle("");
    setFormUrl("");
    setFormCategory("System Demo");
    setFormDescription("");
    setFormFeatured(false);
    setYoutubePreviewId("");
    // Find next order number
    if (videos.length > 0) {
      setFormOrder(Math.max(...videos.map(v => v.order)) + 1);
    } else {
      setFormOrder(1);
    }
  };

  // Submit Add / Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim() || !formDescription.trim()) {
      onShowToast("Please fill in all required fields.", "error");
      return;
    }

    const parsedId = extractYoutubeId(formUrl);
    if (!parsedId) {
      onShowToast("Invalid YouTube URL. Cannot extract ID.", "error");
      return;
    }

    const payload = {
      title: formTitle,
      description: formDescription,
      youtubeUrl: formUrl,
      category: formCategory,
      order: Number(formOrder),
      featured: formFeatured
    };

    try {
      if (editingId) {
        // Edit record
        await updateVideo(editingId, payload);
        onShowToast("Video information updated successfully.", "success");
      } else {
        // Add record
        await addVideo(payload);
        onShowToast("New showcase video uploaded successfully.", "success");
      }
      handleResetForm();
      setActiveTab("manage");
      loadVideos();
    } catch (error) {
      console.error("Database operation failed:", error);
      onShowToast("Database operation failed. Check console for details.", "error");
    }
  };

  // Submit Profile Changes
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileId.trim() || !profileCourse.trim() || !profileSemester.trim()) {
      onShowToast("Please fill in all required profile fields.", "error");
      return;
    }

    try {
      setProfileSaving(true);
      await updateStudentProfile({
        name: profileName,
        studentId: profileId,
        course: profileCourse,
        semester: profileSemester,
        lecturer: profileLecturer
      });
      onShowToast("Student profile updated successfully.", "success");
    } catch (error) {
      console.error("Failed to update profile:", error);
      onShowToast("Failed to save profile details.", "error");
    } finally {
      setProfileSaving(false);
    }
  };

  // Delete Action
  const handleDeleteClick = (video: Video) => {
    setDeleteTarget(video);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteVideo(deleteTarget.id);
      onShowToast(`"${deleteTarget.title}" deleted from catalog.`, "success");
      loadVideos();
    } catch (err) {
      console.error("Failed to delete record:", err);
      onShowToast("Failed to delete record.", "error");
    }
  };

  // Reorder trigger swap
  const handleReorder = async (video: Video, direction: "up" | "down") => {
    const sorted = [...videos].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(v => v.id === video.id);
    if (index === -1) return;

    let swapWithIndex = direction === "up" ? index - 1 : index + 1;
    if (swapWithIndex < 0 || swapWithIndex >= sorted.length) return; // boundary lock

    const otherVideo = sorted[swapWithIndex];
    
    // Swap order values
    const originalOrder = video.order;
    const targetOrder = otherVideo.order === originalOrder 
      ? (direction === "up" ? originalOrder - 1 : originalOrder + 1)
      : otherVideo.order;

    try {
      setLoading(true);
      await updateVideo(video.id, { order: targetOrder });
      await updateVideo(otherVideo.id, { order: originalOrder });
      onShowToast("Sort order updated.", "success");
      loadVideos();
    } catch (err) {
      console.error("Failed to reorder catalog:", err);
      onShowToast("Failed to reorder catalog.", "error");
    }
  };

  // ── Analytics math ───────────────────────────────────────────
  const totalVideos = videos.length;
  const totalViews = videos.reduce((acc, v) => acc + v.views, 0);
  const featuredCount = videos.filter(v => v.featured).length;
  const sortedByViews = [...videos].sort((a, b) => b.views - a.views);
  const topViewedVideo = sortedByViews[0] || null;

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-8 flex flex-col min-h-screen">
      
      {/* Dashboard Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-portfolio-text-primary dark:text-portfolio-dark-text-primary flex items-center gap-2">
            <Layout className="w-6 h-6 text-portfolio-accent" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-xs text-portfolio-text-muted dark:text-portfolio-dark-text-muted font-medium mt-1">
            Create, update, delete and re-sequence video showcases.
          </p>
        </div>
        
        {/* Mock Mode Dashboard Alert */}
        {(isMockMode || (window as any)._firestoreTimeout) && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 py-2 px-3 border border-amber-200 dark:border-amber-900 rounded-lg text-xs font-semibold">
            <span className="flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>Active State: Mock Database (Local Storage)</span>
            </span>
            {(window as any)._firestoreTimeout && (
              <span className="text-amber-600 dark:text-amber-400 font-normal sm:border-l sm:border-amber-300 dark:sm:border-amber-850 sm:pl-2">
                (Firestore database query timed out. Please verify Firestore setup in Firebase Console)
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Analytics dashboard widgets ────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" aria-label="Database analytics">
        
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-800 border border-portfolio-border dark:border-portfolio-dark-border p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-portfolio-accent-light dark:bg-portfolio-dark-accent-light text-portfolio-accent rounded-lg">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-portfolio-text-muted dark:text-portfolio-dark-text-muted tracking-wider block">Total Videos</span>
            <strong className="text-xl font-black text-portfolio-text-primary dark:text-portfolio-dark-text-primary mt-0.5 block">{totalVideos}</strong>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-800 border border-portfolio-border dark:border-portfolio-dark-border p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-lg">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-portfolio-text-muted dark:text-portfolio-dark-text-muted tracking-wider block">Total Views</span>
            <strong className="text-xl font-black text-portfolio-text-primary dark:text-portfolio-dark-text-primary mt-0.5 block">{totalViews}</strong>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-800 border border-portfolio-border dark:border-portfolio-dark-border p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-portfolio-text-muted dark:text-portfolio-dark-text-muted tracking-wider block">Featured</span>
            <strong className="text-xl font-black text-portfolio-text-primary dark:text-portfolio-dark-text-primary mt-0.5 block">{featuredCount} videos</strong>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-800 border border-portfolio-border dark:border-portfolio-dark-border p-5 rounded-xl shadow-sm flex items-center gap-4 col-span-1">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-lg">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-portfolio-text-muted dark:text-portfolio-dark-text-muted tracking-wider block">Most Popular</span>
            <strong className="text-sm font-bold text-portfolio-text-primary dark:text-portfolio-dark-text-primary mt-0.5 block truncate leading-tight">
              {topViewedVideo ? topViewedVideo.title : "No videos loaded"}
            </strong>
          </div>
        </div>

      </section>

      {/* ── Tab Controls ────────────────────────────────── */}
      <div className="flex border-b border-portfolio-border dark:border-portfolio-dark-border mb-6">
        <button
          onClick={() => { setActiveTab("manage"); handleResetForm(); }}
          className={`py-3 px-5 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "manage"
              ? "border-portfolio-accent text-portfolio-accent"
              : "border-transparent text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary hover:text-portfolio-accent"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Manage Catalog</span>
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`py-3 px-5 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "add"
              ? "border-portfolio-accent text-portfolio-accent"
              : "border-transparent text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary hover:text-portfolio-accent"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{editingId ? "Edit Showcase Video" : "Add Assessment Video"}</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`py-3 px-5 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "profile"
              ? "border-portfolio-accent text-portfolio-accent"
              : "border-transparent text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary hover:text-portfolio-accent"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Student Profile</span>
        </button>
      </div>

      {/* ── Tab Views ──────────────────────────────────── */}
      {activeTab === "manage" && (
        
        /* ── MANAGE CATALOG TAB ── */
        <section aria-label="Videos list editor">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <RefreshCw className="w-8 h-8 text-portfolio-accent animate-spin" />
              <p className="text-xs text-portfolio-text-muted">Syncing catalog files...</p>
            </div>
          ) : videos.length > 0 ? (
            <div className="overflow-x-auto border border-portfolio-border dark:border-portfolio-dark-border rounded-xl bg-white dark:bg-slate-800 shadow-sm transition-colors duration-200">
              <table className="w-full border-collapse text-left text-sm" role="grid">
                <thead>
                  <tr className="border-b border-portfolio-border dark:border-portfolio-dark-border bg-portfolio-surface-alt dark:bg-slate-900/50 text-[10px] uppercase font-bold text-portfolio-text-muted dark:text-portfolio-dark-text-muted tracking-wider">
                    <th className="py-3.5 px-4" scope="col">Thumbnail &amp; Title</th>
                    <th className="py-3.5 px-4" scope="col">Category</th>
                    <th className="py-3.5 px-4" scope="col">Order</th>
                    <th className="py-3.5 px-4 text-center" scope="col">Views</th>
                    <th className="py-3.5 px-4 text-center" scope="col">Sort</th>
                    <th className="py-3.5 px-4 text-right" scope="col">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-portfolio-border dark:divide-portfolio-dark-border">
                  {videos.map((video, idx) => (
                    <tr key={video.id} className="hover:bg-portfolio-surface-alt/50 dark:hover:bg-slate-700/25 transition-colors">
                      
                      {/* Image & Title details */}
                      <td className="py-4 px-4 flex gap-4 min-w-[280px]">
                        <img 
                          src={video.thumbnail} 
                          alt="" 
                          className="w-16 h-10 object-cover rounded bg-slate-100 dark:bg-slate-700 shrink-0 shadow-sm"
                        />
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <strong className="font-bold text-portfolio-text-primary dark:text-portfolio-dark-text-primary truncate block leading-snug">
                            {video.title}
                          </strong>
                          <span className="text-[10px] text-portfolio-text-muted dark:text-portfolio-dark-text-muted font-mono leading-none">
                            id: {video.youtubeId}
                          </span>
                        </div>
                      </td>

                      {/* Category tag */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-xs font-semibold py-1 px-2.5 bg-portfolio-accent-light dark:bg-portfolio-dark-accent-light text-portfolio-accent dark:text-indigo-300 rounded-full border border-portfolio-accent-border/50 dark:border-portfolio-dark-accent-border/50">
                          {video.category}
                        </span>
                      </td>

                      {/* Order */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-xs font-bold text-portfolio-text-primary dark:text-portfolio-dark-text-primary">
                        {video.order}
                      </td>

                      {/* Views */}
                      <td className="py-4 px-4 whitespace-nowrap text-center font-mono text-xs font-semibold text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary">
                        {video.views}
                      </td>

                      {/* Sort ordering triggers */}
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <div className="inline-flex gap-1.5 justify-center">
                          <button
                            onClick={() => handleReorder(video, "up")}
                            className="p-1 hover:bg-portfolio-accent-light dark:hover:bg-slate-700 text-portfolio-text-secondary hover:text-portfolio-accent rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                            disabled={idx === 0}
                            title="Move Up"
                            aria-label={`Move ${video.title} up`}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReorder(video, "down")}
                            className="p-1 hover:bg-portfolio-accent-light dark:hover:bg-slate-700 text-portfolio-text-secondary hover:text-portfolio-accent rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                            disabled={idx === videos.length - 1}
                            title="Move Down"
                            aria-label={`Move ${video.title} down`}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 whitespace-nowrap text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => handleEditClick(video)}
                            className="p-1.5 border border-portfolio-border dark:border-portfolio-dark-border hover:border-portfolio-accent dark:hover:border-portfolio-accent bg-white dark:bg-slate-800 text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary hover:text-portfolio-accent rounded-lg cursor-pointer transition-colors"
                            title="Edit details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(video)}
                            className="p-1.5 border border-portfolio-border dark:border-portfolio-dark-border hover:border-red-500 dark:hover:border-red-800 bg-white dark:bg-slate-800 text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary hover:text-red-500 dark:hover:text-red-400 rounded-lg cursor-pointer transition-colors"
                            title="Delete video"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border border-dashed border-portfolio-border-dark dark:border-portfolio-dark-border rounded-xl py-12 px-4 text-center bg-white dark:bg-slate-800">
              <Film className="w-8 h-8 text-portfolio-text-muted mx-auto mb-3" />
              <h3 className="font-bold text-portfolio-text-primary dark:text-portfolio-dark-text-primary">No videos in catalog</h3>
              <p className="text-xs text-portfolio-text-muted mt-1 max-w-xs mx-auto">
                Begin loading your assessment records by clicking the "Add Assessment Video" tab.
              </p>
            </div>
          )}
        </section>
      )}

      {activeTab === "add" && (

        /* ── ADD / EDIT VIDEO TAB ── */
        <section aria-label="Upload form panel">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 bg-white dark:bg-slate-800 border border-portfolio-border dark:border-portfolio-dark-border p-6 md:p-8 rounded-2xl shadow-sm transition-colors duration-200">
            
            {/* Form Fields: Column spans 3 */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 flex flex-col gap-4">
              <h3 className="text-base font-bold text-portfolio-text-primary dark:text-portfolio-dark-text-primary uppercase tracking-wider mb-2">
                {editingId ? "Video Editor Console" : "Add Video Records"}
              </h3>

              {/* Title input */}
              <div className="form-group">
                <label htmlFor="form-video-title" className="form-label">Video Title *</label>
                <input
                  id="form-video-title"
                  type="text"
                  placeholder="e.g. UMT Maritime Informatics Presentation"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              {/* YouTube Link input */}
              <div className="form-group">
                <label htmlFor="form-video-url" className="form-label">YouTube URL / Share Link *</label>
                <input
                  id="form-video-url"
                  type="url"
                  placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="form-control"
                  required
                />
                <span className="form-help">Supports standard desktop URLs or mobile share links (youtu.be).</span>
              </div>

              {/* Row: Category & Order */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="form-video-category" className="form-label">Category Group</label>
                  <select
                    id="form-video-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="form-control"
                  >
                    <option value="System Demo">System Demo</option>
                    <option value="IoT / Hardware">IoT / Hardware</option>
                    <option value="Database">Database</option>
                    <option value="Academic">Academic</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="form-video-order" className="form-label">Display Order Index *</label>
                  <input
                    id="form-video-order"
                    type="number"
                    min="0"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="form-control"
                    required
                  />
                  <span className="form-help">Lower values display first on public landing page.</span>
                </div>
              </div>

              {/* Description input */}
              <div className="form-group">
                <label htmlFor="form-video-desc" className="form-label">Assessment Description *</label>
                <textarea
                  id="form-video-desc"
                  placeholder="Summarize the core objectives and findings of the assessment..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="form-control"
                  required
                ></textarea>
              </div>

              {/* Option checkboxes */}
              <div className="form-group mt-1">
                <label className="form-check">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="form-check-input"
                  />
                  <span className="font-semibold text-portfolio-text-primary dark:text-portfolio-dark-text-primary">
                    Highlight in Featured Spotlight Section at top of home screen
                  </span>
                </label>
              </div>

              {/* Actions row */}
              <div className="flex gap-3 mt-4 border-t border-portfolio-border dark:border-portfolio-dark-border pt-6">
                <button
                  type="submit"
                  className="py-3 px-6 bg-portfolio-accent hover:bg-portfolio-accent-hover text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/15 cursor-pointer"
                >
                  {editingId ? "Save Modifications" : "Upload Assessment"}
                </button>
                <button
                  type="button"
                  onClick={() => { handleResetForm(); if (editingId) setActiveTab("manage"); }}
                  className="py-3 px-6 bg-white dark:bg-slate-800 hover:bg-portfolio-surface-alt dark:hover:bg-slate-700 border border-portfolio-border-dark dark:border-portfolio-dark-border text-portfolio-text-primary dark:text-portfolio-dark-text-primary rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {editingId ? "Cancel Edit" : "Reset Fields"}
                </button>
              </div>

            </form>

            {/* Preview Column: Spans 2 */}
            <div className="lg:col-span-2 flex flex-col gap-5 justify-start">
              <h3 className="text-sm font-bold text-portfolio-text-muted dark:text-portfolio-dark-text-muted uppercase tracking-wider">
                Video Preview
              </h3>

              {youtubePreviewId ? (
                <div className="flex flex-col gap-4 border border-portfolio-border dark:border-portfolio-dark-border rounded-xl p-4 bg-portfolio-surface-alt dark:bg-slate-900/50">
                  
                  {/* Thumbnail Image Render */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-inner">
                    <img 
                      src={`https://img.youtube.com/vi/${youtubePreviewId}/hqdefault.jpg`} 
                      alt="YouTube thumbnail preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback image source if YouTube default fails
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=640&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="p-3 bg-portfolio-accent text-white rounded-full shadow-lg">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </span>
                    </div>
                  </div>

                  {/* Stats snippet */}
                  <div className="text-xs text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary space-y-1">
                    <p className="font-semibold truncate">
                      Extracted ID: <span className="font-mono text-portfolio-accent dark:text-indigo-300 font-bold">{youtubePreviewId}</span>
                    </p>
                    <p>
                      Generated Thumbnail: <span className="font-mono break-all font-semibold text-[10px] text-portfolio-text-muted">.../vi/{youtubePreviewId}/hqdefault.jpg</span>
                    </p>
                  </div>
                  
                </div>
              ) : (
                <div className="border border-dashed border-portfolio-border-dark dark:border-portfolio-dark-border rounded-xl p-8 text-center flex flex-col items-center justify-center bg-portfolio-surface-alt dark:bg-slate-900/10 min-h-[220px]">
                  <Film className="w-8 h-8 text-portfolio-text-muted mb-2 animate-pulse" />
                  <p className="text-xs font-semibold text-portfolio-text-primary dark:text-portfolio-dark-text-primary">URL Preview Awaiting Input</p>
                  <p className="text-[10px] text-portfolio-text-muted mt-1 max-w-xs">
                    Once you insert a valid YouTube URL share link, we will dynamically map and present the thumbnail and video metadata preview here.
                  </p>
                </div>
              )}

              {/* Instructions Panel */}
              <div className="p-5 border border-portfolio-accent-border/50 dark:border-portfolio-dark-accent-border/50 bg-portfolio-accent-light dark:bg-portfolio-dark-accent-light/20 rounded-xl flex gap-3 text-portfolio-accent dark:text-indigo-300">
                <AlertTriangle className="w-5 h-5 shrink-0 text-portfolio-accent" />
                <div className="text-xs space-y-1">
                  <p className="font-bold">Content Management Guard</p>
                  <p className="leading-relaxed">All changes submitted in this editor are stored directly. If utilizing mock local database files, changes persist in your browser's local cache.</p>
                </div>
              </div>

            </div>

          </div>
        </section>
      )}

      {activeTab === "profile" && (
        <section aria-label="Student profile settings panel" className="animate-fadeIn">
          <div className="max-w-2xl bg-white dark:bg-slate-800 border border-portfolio-border dark:border-portfolio-dark-border p-6 md:p-8 rounded-2xl shadow-sm transition-colors duration-200">
            <h3 className="text-base font-bold text-portfolio-text-primary dark:text-portfolio-dark-text-primary uppercase tracking-wider mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-portfolio-accent" />
              <span>Student Profile Settings</span>
            </h3>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
              
              {/* Name */}
              <div className="form-group">
                <label htmlFor="profile-name" className="form-label">Full Name *</label>
                <input
                  id="profile-name"
                  type="text"
                  placeholder="e.g. Azmin Hassan"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              {/* Matric ID */}
              <div className="form-group">
                <label htmlFor="profile-id" className="form-label">Student ID / Matric Number *</label>
                <input
                  id="profile-id"
                  type="text"
                  placeholder="e.g. S64721"
                  value={profileId}
                  onChange={(e) => setProfileId(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              {/* Course */}
              <div className="form-group">
                <label htmlFor="profile-course" className="form-label">Course / Program *</label>
                <input
                  id="profile-course"
                  type="text"
                  placeholder="e.g. Bachelor of Computer Science (Software Engineering)"
                  value={profileCourse}
                  onChange={(e) => setProfileCourse(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              {/* Semester */}
              <div className="form-group">
                <label htmlFor="profile-semester" className="form-label">Semester *</label>
                <input
                  id="profile-semester"
                  type="text"
                  placeholder="e.g. Semester 5 (Academic Year 2026/2027)"
                  value={profileSemester}
                  onChange={(e) => setProfileSemester(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              {/* Lecturer */}
              <div className="form-group">
                <label htmlFor="profile-lecturer" className="form-label">Lecturer Name (Optional)</label>
                <input
                  id="profile-lecturer"
                  type="text"
                  placeholder="e.g. Dr. Wan Mohd Amir Fazamin"
                  value={profileLecturer}
                  onChange={(e) => setProfileLecturer(e.target.value)}
                  className="form-control"
                />
              </div>

              {/* Actions row */}
              <div className="flex gap-3 mt-4 border-t border-portfolio-border dark:border-portfolio-dark-border pt-6">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="py-3 px-6 bg-portfolio-accent hover:bg-portfolio-accent-hover disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/15 cursor-pointer"
                >
                  {profileSaving ? "Saving details..." : "Save Profile Details"}
                </button>
                <button
                  type="button"
                  onClick={loadProfile}
                  className="py-3 px-6 bg-white dark:bg-slate-800 hover:bg-portfolio-surface-alt dark:hover:bg-slate-700 border border-portfolio-border-dark dark:border-portfolio-dark-border text-portfolio-text-primary dark:text-portfolio-dark-text-primary rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Reset Fields
                </button>
              </div>

            </form>
          </div>
        </section>
      )}

      {/* Delete Confirmation Overlay Modal */}
      <ConfirmModal
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${deleteTarget?.title}" from catalog? This action is permanent.`}
        isOpen={deleteConfirmOpen}
        onClose={() => { setDeleteConfirmOpen(false); setDeleteTarget(null); }}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
};
