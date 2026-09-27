import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  Bell, 
  LogOut, 
  User,
  Bot
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, profile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-dark-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Link to="/dashboard" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center shadow-glow-brand group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
            Career<span className="text-brand-400">AI</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link
          to="/assistant"
          className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-300 hover:bg-brand-500/20 transition-colors text-sm font-medium"
        >
          <Bot className="w-4 h-4 text-brand-400 animate-pulse" />
          <span>Ask Career AI</span>
        </Link>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-300 font-semibold text-sm">
            {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4 text-slate-400" />}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-none">{profile?.fullName || user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-[10px] text-brand-400 font-medium leading-none mt-1">{profile?.targetRole || 'Software Engineer'}</p>
          </div>

          <button
            onClick={logout}
            title="Sign out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors ml-2"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
