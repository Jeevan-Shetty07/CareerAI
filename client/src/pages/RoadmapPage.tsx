import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  GitFork, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Code, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);

  const fetchLatestRoadmap = async () => {
    try {
      const res = await api.getLatestRoadmap();
      if (res.success && res.data) {
        setRoadmap(res.data);
      }
    } catch (err) {
      console.error('Error fetching roadmap', err);
    }
  };

  useEffect(() => {
    fetchLatestRoadmap();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole.trim()) return;

    setLoading(true);
    try {
      const res = await api.generateRoadmap({
        targetRole,
        currentSkills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
        weeks: 10,
      });
      if (res.success) {
        setRoadmap(res.data);
        setExpandedPhase(1);
      }
    } catch (err) {
      console.error('Failed to generate roadmap', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <GitFork className="w-6 h-6 text-purple-400" />
          <span>Dynamic AI Career Learning Roadmap</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Structured, milestone-driven curriculum tailored to bridge your exact skill gaps for top engineering roles.
        </p>
      </div>

      {/* Generator Form */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Engineering Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Staff Full Stack Engineer, DevOps Engineer, AI Architect"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
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
                  <span>Synthesizing Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Roadmap</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Roadmap Presentation */}
      {roadmap && (
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-purple-500/30">
            <div>
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Target Role Blueprint</span>
              <h2 className="text-xl font-bold text-slate-100 mt-1">{roadmap.title || targetRole}</h2>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-900 border border-slate-800 text-slate-300">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>{roadmap.estimatedDurationWeeks || 10} Weeks</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-900 border border-slate-800 text-slate-300">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>{roadmap.totalHours || 80} Total Hours</span>
              </div>
            </div>
          </div>

          {/* Phases Timeline */}
          <div className="space-y-4">
            {(roadmap.phases || []).map((phase: any) => {
              const isExpanded = expandedPhase === phase.phaseNumber;
              return (
                <div
                  key={phase.phaseNumber}
                  className="glass-card rounded-2xl border border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedPhase(isExpanded ? null : phase.phaseNumber)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                        0{phase.phaseNumber}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-100">{phase.title}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Duration: {phase.durationWeeks} weeks • {phase.topics?.length || 0} Key Milestones
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-800/80 space-y-5">
                      {/* Topics */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                          <span>Core Topics & Concepts</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.topics?.map((topic: string, i: number) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-dark-900 border border-slate-800 text-xs text-slate-300 font-medium"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Capstone Project */}
                      {phase.projects && phase.projects.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Code className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Hands-on Project Milestone</span>
                          </h4>
                          {phase.projects.map((proj: any, idx: number) => (
                            <div key={idx} className="p-4 rounded-xl bg-dark-900/80 border border-slate-800 space-y-2">
                              <h5 className="text-xs font-bold text-cyan-300">{proj.title}</h5>
                              <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {proj.technologies?.map((tech: string) => (
                                  <span key={tech} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] font-mono">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
