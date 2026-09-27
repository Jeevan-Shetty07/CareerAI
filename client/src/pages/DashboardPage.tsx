import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  FileText, 
  Briefcase, 
  Code2, 
  MessageSquare, 
  GitFork, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Github,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const [resumeData, setResumeData] = useState<any>(null);
  const [githubData, setGithubData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [resResume, resGh] = await Promise.allSettled([
          api.getResume(),
          api.getLatestGitHub(),
        ]);

        if (resResume.status === 'fulfilled' && resResume.value.success) {
          setResumeData(resResume.value.data);
        }
        if (resGh.status === 'fulfilled' && resGh.value.success) {
          setGithubData(resGh.value.data);
        }
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const overallScore = resumeData?.score?.overall || 84;
  const atsCompatibility = resumeData?.score?.atsCompatibility || 88;
  const devScore = githubData?.score?.overall || 85;

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900/60 via-dark-850 to-dark-900 border border-brand-500/20 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>AI Career Readiness Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Welcome, {profile?.fullName || 'Candidate'} 👋
            </h1>
            <p className="mt-1 text-slate-400 text-sm max-w-xl">
              Targeting: <span className="text-brand-300 font-semibold">{profile?.targetRole || 'Full Stack Software Engineer'}</span>. Your resume, interview simulator, and technical skills metrics are synchronized.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-dark-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-500 flex items-center justify-center font-black text-2xl text-white shadow-glow-brand">
              {overallScore}%
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Career Readiness</p>
              <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> Top 15% Candidate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">ATS Resume Score</span>
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-100 mt-2">{atsCompatibility}/100</p>
          <p className="text-[11px] text-brand-400 font-medium mt-1">High ATS compatibility</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Interview Readiness</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-100 mt-2">82%</p>
          <p className="text-[11px] text-emerald-400 font-medium mt-1">System Design & Tech</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Code Sandbox Status</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-100 mt-2">Accepted</p>
          <p className="text-[11px] text-cyan-400 font-medium mt-1">Algorithms verified</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">GitHub Portfolio Score</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Github className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-100 mt-2">{devScore}/100</p>
          <p className="text-[11px] text-purple-400 font-medium mt-1">Active contributor</p>
        </div>
      </div>

      {/* Feature Action Grid */}
      <h2 className="text-lg font-bold text-slate-100">Recommended Next Steps</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/resume"
          className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 flex items-center justify-between">
              <span>Resume ATS Scoring</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Upload PDF or DOCX resumes to inspect keyword coverage, impact verbs, and AI bullet rewrites.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-xs font-semibold text-brand-400">
            <span>Analyze Resume &rarr;</span>
          </div>
        </Link>

        <Link
          to="/jobs"
          className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 flex items-center justify-between">
              <span>Job Match & Skill Gaps</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Paste target job descriptions to analyze match %, missing requirements, and an actionable bridge plan.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-xs font-semibold text-cyan-400">
            <span>Compare Job Description &rarr;</span>
          </div>
        </Link>

        <Link
          to="/interviews"
          className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 flex items-center justify-between">
              <span>AI Mock Interviews</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Experience simulated technical and behavioral interviews with real-time feedback and scorecards.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-xs font-semibold text-emerald-400">
            <span>Start Simulation &rarr;</span>
          </div>
        </Link>

        <Link
          to="/coding"
          className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 flex items-center justify-between">
              <span>Coding Sandbox</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Solve algorithmic challenges in a sandboxed Monaco editor with Big-O AI complexity analysis.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-xs font-semibold text-amber-400">
            <span>Open Code Editor &rarr;</span>
          </div>
        </Link>

        <Link
          to="/roadmaps"
          className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GitFork className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 flex items-center justify-between">
              <span>Dynamic Roadmap</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Step-by-step curriculum with hands-on projects, weekly hours, and checkpoints to master required skills.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-xs font-semibold text-purple-400">
            <span>View Roadmap &rarr;</span>
          </div>
        </Link>

        <Link
          to="/assistant"
          className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between group border-brand-500/30"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100 flex items-center justify-between">
              <span>Career AI Copilot</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-300 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Ask questions on salary negotiation, interview strategy, technical transitions, and cover letters.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-xs font-semibold text-brand-300">
            <span>Chat with Assistant &rarr;</span>
          </div>
        </Link>
      </div>
    </div>
  );
};
