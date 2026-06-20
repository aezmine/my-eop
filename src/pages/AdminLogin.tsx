import React, { useState, useEffect } from "react";
import { Lock, Mail, Eye, EyeOff, ShieldAlert, AlertCircle } from "lucide-react";
import { signIn, isMockMode } from "../firebase";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  user: any;
  onNavigate: (path: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, user, onNavigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (user) {
      onLoginSuccess();
    }
  }, [user, onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please complete all authentication fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await signIn(email, password);
      onLoginSuccess();
    } catch (err: any) {
      console.error("Login failure:", err);
      setError(err.message || "Invalid credentials. Please verify parameters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-12 flex items-center justify-center min-h-[80vh]">
      <div className="bg-white dark:bg-slate-800 border border-portfolio-border dark:border-portfolio-dark-border rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col gap-6 transition-colors duration-200">
        
        {/* Portal Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="p-3 bg-portfolio-accent-light dark:bg-portfolio-dark-accent-light text-portfolio-accent rounded-xl">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-portfolio-text-primary dark:text-portfolio-dark-text-primary mt-2">
            Administrator Portal
          </h1>
          <p className="text-xs text-portfolio-text-muted dark:text-portfolio-dark-text-muted font-medium">
            Sign in to manage YouTube assessment assets and catalogs.
          </p>
        </div>

        {/* Mock Mode Alert Notice */}
        {isMockMode && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-4 flex gap-3 text-amber-800 dark:text-amber-300">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Running in Local Mock Mode</p>
              <p className="leading-relaxed">Firebase environment keys not set. Access granted using credentials:</p>
              <div className="font-mono bg-amber-100/50 dark:bg-amber-950/50 p-1.5 rounded mt-1 select-all text-center">
                email: <strong className="text-portfolio-accent">admin@example.com</strong><br />
                password: <strong className="text-portfolio-accent">admin123</strong>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-3.5 flex gap-2.5 text-red-800 dark:text-red-300">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-xs font-semibold leading-normal">{error}</p>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Email input */}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-portfolio-text-muted" />
              <input
                id="login-email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control pl-10"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-portfolio-text-muted" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control pl-10 pr-10"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-portfolio-text-muted hover:text-portfolio-text-primary dark:hover:text-portfolio-dark-text-primary p-0.5 rounded cursor-pointer"
                disabled={loading}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-portfolio-accent hover:bg-portfolio-accent-hover disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 cursor-pointer flex items-center justify-center"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In to Console"}
          </button>

          <button
            type="button"
            onClick={() => onNavigate("/")}
            className="w-full py-2.5 px-4 bg-transparent text-portfolio-text-secondary dark:text-portfolio-dark-text-secondary hover:text-portfolio-accent text-xs font-semibold cursor-pointer transition-colors mt-1"
          >
            ← Back to Public Site
          </button>
          
        </form>

      </div>
    </div>
  );
};
