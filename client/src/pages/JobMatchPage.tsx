import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ArrowRight, 
  TrendingUp, 
  ListChecks,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

const sampleJobDescriptions = [
  {
    title: 'Senior Full Stack Engineer at Stripe',
    description: `We are looking for a Senior Full Stack Engineer with strong experience in React, TypeScript, Node.js, and PostgreSQL. Familiarity with Docker, Kubernetes, AWS, Redis, and high-scale distributed systems is strongly preferred. You will build user-facing financial infrastructure and scale mission-critical APIs.`
  },
  {
    title: 'AI Platform Engineer at OpenAI',
    description: `Seeking an AI Platform Engineer proficient in Python, PyTorch, FastAPI, TypeScript, React, and vector databases (Pinecone/pgvector). Experience deploying LLM microservices, prompt orchestration pipelines, and Kubernetes clusters is required.`
  }
];

export const JobMatchPage: React.FC = () => {
  const [jobDescription, setJobDescription] = useState(sampleJobDescriptions[0].description);
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [matchResult, setMatchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;

    setError('');
    setLoading(true);
    try {
      const res = await api.matchJob({
        jobDescription,
        targetRole,
      });
      if (res.success) {
        setMatchResult(res.data);
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze job match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-cyan-400" />
          <span>Job Description Skill Gap & Match Engine</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Paste any job description to instantly uncover missing keywords, skill overlaps, and your probability of passing recruiter filters.
        </p>
      </div>

      {/* Input Section */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-200">Paste Job Description</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Quick load sample:</span>
            {sampleJobDescriptions.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setJobDescription(sample.description)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-cyan-300 transition-colors border border-slate-700"
              >
                {sample.title.split(' at ')[0]}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAnalyze} className="space-y-4">
          <textarea
            rows={5}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste raw JD or requirement list..."
            className="w-full p-4 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-brand-600 hover:from-cyan-500 hover:to-brand-500 text-white font-semibold text-xs shadow-glow-cyan transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Comparing Skills...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Job Fit</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Analysis Results */}
      {matchResult && (
        <div className="space-y-6">
          {/* Top Match Card */}
          <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-cyan-500/30">
            <div className="flex items-center space-x-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-brand-600 flex flex-col items-center justify-center text-white shadow-glow-cyan">
                <span className="text-3xl font-black">{matchResult.overallMatch}%</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">Match</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Overall Match Rating</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">{matchResult.matchSummary}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center p-3 rounded-xl bg-dark-900 border border-slate-800 min-w-[80px]">
                <p className="text-emerald-400 font-bold text-base">{matchResult.matchedSkills?.length || 0}</p>
                <p className="text-[10px] text-slate-400 uppercase">Matched</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-dark-900 border border-slate-800 min-w-[80px]">
                <p className="text-rose-400 font-bold text-base">{matchResult.missingSkills?.length || 0}</p>
                <p className="text-[10px] text-slate-400 uppercase">Missing</p>
              </div>
            </div>
          </div>

          {/* Skill Tag Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Matched Skills ({matchResult.matchedSkills?.length || 0})</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.matchedSkills?.map((skill: string) => (
                  <span key={skill} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Partial / Transferable ({matchResult.partialSkills?.length || 0})</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(matchResult.partialSkills?.length ? matchResult.partialSkills : ['Express $\\to$ NestJS', 'PostgreSQL $\\to$ Redis']).map((skill: string) => (
                  <span key={skill} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                <span>Missing Skills ({matchResult.missingSkills?.length || 0})</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.missingSkills?.map((skill: string) => (
                  <span key={skill} className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Plan */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-cyan-400" />
              <span>Recommended Action Plan to Bridge Skill Gaps</span>
            </h3>

            <div className="space-y-2.5">
              {(matchResult.actionPlan || [
                'Complete a hands-on project deploying Dockerized containers to AWS ECS.',
                'Integrate Redis caching to showcase high-throughput API design.',
                'Refactor existing React components with TypeScript strict mode.'
              ]).map((step: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-dark-900/60 border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
