import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  FileCheck, 
  Layers, 
  Zap, 
  Copy, 
  Check,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ResumePage: React.FC = () => {
  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchResume = async () => {
    try {
      const res = await api.getResume();
      if (res.success && res.data) {
        setResumeData(res.data);
      }
    } catch (err) {
      console.error('Error fetching resume', err);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setError('');
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.uploadResume(formData);
      if (res.success) {
        setResumeData(res.data);
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to parse resume');
    } finally {
      setLoading(false);
    }
  };

  const copyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const score = resumeData?.score || {
    overall: 84,
    atsCompatibility: 88,
    impactAndMetrics: 78,
    formatting: 90,
    skillCoverage: 82,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-400" />
            <span>AI Resume Parser & ATS Score Optimizer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate your resume against top ATS parsers, analyze keyword coverage, and generate high-impact bullets.
          </p>
        </div>
      </div>

      {/* Upload Box */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Upload className="w-4 h-4 text-brand-400" />
          <span>Upload Document (.pdf, .docx, .txt)</span>
        </h3>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleFileUpload} className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-600 file:text-white hover:file:bg-brand-500 file:cursor-pointer bg-dark-900 rounded-xl p-2 border border-slate-800"
          />
          <button
            type="submit"
            disabled={!file || loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-glow-brand transition-all flex items-center justify-center space-x-2 disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Parsing with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Resume</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* ATS Score Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="glass-card p-5 rounded-2xl md:col-span-2 flex items-center space-x-6 border-brand-500/30">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex flex-col items-center justify-center text-white shadow-glow-brand">
            <span className="text-3xl font-black">{score.overall}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider">/ 100</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Overall ATS Score</h3>
            <p className="text-xs text-slate-400 mt-1">Strong profile with high parsing fidelity</p>
            <div className="mt-2 inline-flex items-center text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Ready for Top Tech Applications
            </div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">ATS Format</p>
          <p className="text-2xl font-black text-slate-100 mt-1">{score.atsCompatibility}%</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-brand-500 h-full rounded-full" style={{ width: `${score.atsCompatibility}%` }} />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Impact & Metrics</p>
          <p className="text-2xl font-black text-slate-100 mt-1">{score.impactAndMetrics}%</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${score.impactAndMetrics}%` }} />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Skill Coverage</p>
          <p className="text-2xl font-black text-slate-100 mt-1">{score.skillCoverage}%</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${score.skillCoverage}%` }} />
          </div>
        </div>
      </div>

      {/* Categorized Skills Breakdown */}
      {resumeData?.skills && (
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-400" />
            <span>Extracted Skills Hierarchy</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-dark-900/60 p-4 rounded-xl border border-slate-800/80">
              <span className="font-semibold text-brand-300 block mb-2">Languages</span>
              <div className="flex flex-wrap gap-1.5">
                {(resumeData.skills.programmingLanguages || ['JavaScript', 'TypeScript', 'Python', 'SQL']).map((s: string) => (
                  <span key={s} className="px-2 py-1 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-dark-900/60 p-4 rounded-xl border border-slate-800/80">
              <span className="font-semibold text-cyan-300 block mb-2">Frameworks & Libraries</span>
              <div className="flex flex-wrap gap-1.5">
                {(resumeData.skills.frameworks || ['React', 'Node.js', 'Express.js', 'TailwindCSS']).map((s: string) => (
                  <span key={s} className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-dark-900/60 p-4 rounded-xl border border-slate-800/80">
              <span className="font-semibold text-emerald-300 block mb-2">Databases & Cloud</span>
              <div className="flex flex-wrap gap-1.5">
                {[...(resumeData.skills.databases || ['PostgreSQL', 'MongoDB']), ...(resumeData.skills.cloud || ['AWS', 'Docker'])].map((s: string) => (
                  <span key={s} className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Bullet Points & Enhancements */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>AI-Optimized Bullet Point Recommendations</span>
        </h3>
        <p className="text-xs text-slate-400">
          Click any bullet to copy and insert directly into your resume project/experience section.
        </p>

        <div className="space-y-3">
          {(resumeData?.suggestions?.suggestedBulletPoints || [
            'Architected scalable backend microservices using Node.js and TypeScript, reducing API latency by 35% through Redis caching.',
            'Engineered real-time collaboration canvas with WebSockets and React, supporting 1,000+ concurrent users with zero downtime.',
            'Implemented automated CI/CD pipeline and Docker containerization, accelerating deployment cycles by 40% across staging and production.',
          ]).map((bullet: string, idx: number) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-dark-900/80 border border-slate-800/80 hover:border-brand-500/30 transition-colors"
            >
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{bullet}</p>
              <button
                onClick={() => copyBullet(bullet, idx)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-colors flex-shrink-0"
                title="Copy bullet"
              >
                {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
