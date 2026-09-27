import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  FileText, 
  Briefcase, 
  Code2, 
  MessageSquare, 
  GitFork, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Github,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { loginDemoUser, isAuthenticated } = useAuth();

  const handleDemoClick = async () => {
    await loginDemoUser();
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-brand-500/30 selection:text-brand-200">
      {/* Header */}
      <header className="h-20 border-b border-slate-800/80 px-6 md:px-12 flex items-center justify-between backdrop-blur-md bg-dark-950/70 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center shadow-glow-brand">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
            Career<span className="text-brand-400">AI</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-500 shadow-glow-brand transition-all flex items-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <button
                onClick={handleDemoClick}
                className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-300 font-medium text-sm transition-colors border border-slate-700"
              >
                Instant Demo Access
              </button>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-500 shadow-glow-brand transition-all text-sm"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-8">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Next-Gen AI Career Acceleration Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight max-w-4xl leading-tight">
          Supercharge Your Tech Career with <span className="text-gradient-brand">Adaptive AI Intelligence</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          From ATS resume scoring and job description gap analysis to live mock interviews and sandboxed coding challenges — all in one unified platform.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleDemoClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-base hover:from-brand-500 hover:to-indigo-500 shadow-glow-brand transition-all flex items-center justify-center space-x-3 group"
          >
            <span>Launch Live Demo</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-base hover:bg-slate-800 transition-colors"
          >
            Create Free Account
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800/80 backdrop-blur-md hover:border-brand-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Smart ATS Resume Engine</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Upload PDF or Word documents for instant 0–100 ATS scoring, impact bullet suggestions, and keyword optimization.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800/80 backdrop-blur-md hover:border-cyan-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Job Match & Skill Gaps</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Compare your profile against any job posting. Identify exact matches, partial overlaps, and get a tailored bridge roadmap.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800/80 backdrop-blur-md hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">AI Mock Interviews</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Practice real-time technical & behavioral interviews with instant feedback on accuracy, communication, and sample ideal answers.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-400">
        <p>© 2026 CareerAI Platform. Engineered for high-impact software careers.</p>
      </footer>
    </div>
  );
};
