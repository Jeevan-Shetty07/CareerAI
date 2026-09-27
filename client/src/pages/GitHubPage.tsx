import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Github, 
  Sparkles, 
  GitBranch, 
  Star, 
  Code, 
  CheckCircle2, 
  TrendingUp, 
  RefreshCw, 
  Award,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GitHubPage: React.FC = () => {
  const [username, setUsername] = useState('jeevankumar-dev');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchDefaultAnalysis = async () => {
    try {
      const res = await api.getLatestGitHub();
      if (res.success && res.data) {
        setAnalysis(res.data);
      }
    } catch (err) {
      console.error('Error loading GitHub analysis', err);
    }
  };

  useEffect(() => {
    fetchDefaultAnalysis();
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    try {
      const res = await api.analyzeGitHub(username);
      if (res.success) {
        setAnalysis(res.data);
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err) {
      console.error('Failed to analyze GitHub profile', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Github className="w-6 h-6 text-purple-400" />
          <span>GitHub Developer Intelligence & Portfolio Score</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Evaluate public repositories, commit patterns, code cleanliness, and documentation to maximize technical recruiter conversions.
        </p>
      </div>

      {/* Input */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full">
            <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Username or Profile Link</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Jeevan-Shetty07"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="w-full sm:w-auto self-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-white font-semibold text-xs shadow-glow-brand transition-all flex items-center justify-center space-x-2 disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning Repositories...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Portfolio</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Presentation */}
      {analysis && (
        <div className="space-y-6">
          {/* Profile Header Card */}
          <div className="glass-card p-6 rounded-3xl border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-purple-400 font-bold text-xl overflow-hidden">
                {analysis.profileInfo?.avatarUrl ? (
                  <img src={analysis.profileInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Github className="w-8 h-8" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100">{analysis.profileInfo?.name || analysis.username}</h2>
                <p className="text-xs text-slate-400 mt-0.5">@{analysis.username}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                    {analysis.profileInfo?.publicRepos || 18} Repositories
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    {analysis.profileInfo?.followers || 42} Followers
                  </span>
                </div>
              </div>
            </div>

            {/* Developer Score Badge */}
            <div className="flex items-center space-x-4 bg-dark-900/80 p-4 rounded-2xl border border-slate-800">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-purple-600 to-brand-600 flex items-center justify-center font-black text-2xl text-white shadow-glow-brand">
                {analysis.score?.overall || 88}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Developer Score</p>
                <p className="text-xs font-bold text-purple-400">High Technical Visibility</p>
              </div>
            </div>
          </div>

          {/* Sub-metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-2xl">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Repo Health & Quality</p>
              <p className="text-2xl font-black text-slate-100 mt-1">{analysis.score?.repositoryHealth || 90}%</p>
            </div>
            <div className="glass-card p-4 rounded-2xl">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">README & Documentation</p>
              <p className="text-2xl font-black text-slate-100 mt-1">{analysis.score?.documentation || 85}%</p>
            </div>
            <div className="glass-card p-4 rounded-2xl">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Commit Consistency</p>
              <p className="text-2xl font-black text-slate-100 mt-1">{analysis.score?.consistency || 88}%</p>
            </div>
          </div>

          {/* Highlights & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Portfolio Strengths</span>
              </h3>
              <ul className="space-y-2">
                {(analysis.highlights || [
                  'Consistent commit cadence in high-demand languages (TypeScript, Python).',
                  'Comprehensive root README files with live demo badges and architectures.',
                  'Clear modular project directory setups with production scripts.'
                ]).map((h: string, idx: number) => (
                  <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-brand-300 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Optimization Opportunities</span>
              </h3>
              <ul className="space-y-2">
                {(analysis.recommendations || [
                  'Add automated GitHub Actions CI/CD workflows to pinned repositories.',
                  'Include architecture diagrams in README files to impress engineering managers.',
                  'Pin full-stack end-to-end applications showcasing database integrations.'
                ]).map((r: string, idx: number) => (
                  <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                    <span className="text-brand-400 mt-0.5">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
