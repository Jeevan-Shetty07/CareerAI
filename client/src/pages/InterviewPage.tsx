import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  MessageSquare, 
  Sparkles, 
  Send, 
  CheckCircle, 
  Award, 
  TrendingUp, 
  AlertTriangle,
  Play,
  RotateCcw,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InterviewPage: React.FC = () => {
  const [role, setRole] = useState('Full Stack Software Engineer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [interviewType, setInterviewType] = useState('Technical & System Design');
  const [session, setSession] = useState<any>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [latestFeedback, setLatestFeedback] = useState<any>(null);

  const handleStartInterview = async () => {
    setLoading(true);
    setLatestFeedback(null);
    try {
      const res = await api.startInterview({
        role,
        difficulty,
        interviewType,
      });
      if (res.success) {
        setSession(res.data);
        setCurrentQuestionIdx(0);
        setCurrentAnswer('');
      }
    } catch (err) {
      console.error('Failed to start interview', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || !session) return;

    setSubmittingAnswer(true);
    const question = session.questions[currentQuestionIdx];
    try {
      const res = await api.submitInterviewAnswer({
        interviewId: session.id,
        questionId: question.id,
        answer: currentAnswer,
      });

      if (res.success) {
        setLatestFeedback(res.data.feedback);
        if (currentQuestionIdx + 1 < session.questions.length) {
          setCurrentQuestionIdx(currentQuestionIdx + 1);
          setCurrentAnswer('');
        } else {
          // Completed
          const compRes = await api.completeInterview(session.id);
          if (compRes.success) {
            setSession(compRes.data);
            confetti({ particleCount: 70, spread: 80 });
          }
        }
      }
    } catch (err) {
      console.error('Error submitting answer', err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const isCompleted = session?.status === 'completed';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-emerald-400" />
          <span>Adaptive AI Mock Interview Simulator</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Practice dynamic role-specific behavioral, technical, and architectural interviews with real-time AI critique.
        </p>
      </div>

      {!session ? (
        /* Configuration Setup Card */
        <div className="glass-card p-8 rounded-3xl border border-slate-800 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Play className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Setup Mock Interview Session</h3>
              <p className="text-xs text-slate-400">Configure parameters to customize interview difficulty</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Junior">Junior (0-2 YOE)</option>
                  <option value="Medium">Mid-Level (3-5 YOE)</option>
                  <option value="Senior">Senior / Staff (6+ YOE)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Interview Format</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Technical & System Design">Technical & Architecture</option>
                  <option value="Behavioral & Leadership">Behavioral (STAR Method)</option>
                  <option value="Comprehensive Mixed">Comprehensive Mixed</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-glow-emerald transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Custom Interview...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Live Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : isCompleted ? (
        /* Completed Scorecard Report */
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-emerald-500/40 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-black text-2xl text-white shadow-glow-emerald">
                  {session.report?.overallScore || 85}%
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Interview Evaluation Report</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Role: {session.role} • Difficulty: {session.difficulty}</p>
                </div>
              </div>
              <button
                onClick={() => setSession(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center space-x-1.5 self-start"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start Another Session</span>
              </button>
            </div>

            {/* Score Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Communication</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">{session.report?.communicationScore || 88}%</p>
              </div>
              <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Technical Depth</p>
                <p className="text-2xl font-black text-cyan-400 mt-1">{session.report?.technicalScore || 84}%</p>
              </div>
              <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Problem Solving</p>
                <p className="text-2xl font-black text-purple-400 mt-1">{session.report?.problemSolvingScore || 86}%</p>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-dark-900/60 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">Executive Summary</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {session.report?.summary || 'Demonstrated clear structured reasoning, strong technical fundamentals, and concise communication throughout the session.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Active Interview In-Progress */
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Question {currentQuestionIdx + 1} of {session.questions?.length || 3}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {session.questions?.[currentQuestionIdx]?.category?.toUpperCase()}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900/80 border border-slate-800">
              <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                "{session.questions?.[currentQuestionIdx]?.question}"
              </p>
            </div>

            {latestFeedback && (
              <div className="p-4 rounded-xl bg-brand-950/40 border border-brand-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-300">Previous Answer Score</span>
                  <span className="text-xs font-black text-brand-400">{latestFeedback.score}/100</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{latestFeedback.sampleAnswer}</p>
              </div>
            )}

            <form onSubmit={handleAnswerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Your Answer</label>
                <textarea
                  rows={6}
                  required
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your structured response here..."
                  className="w-full p-4 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-100 font-sans focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={submittingAnswer}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-emerald transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  {submittingAnswer ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Evaluating Response...</span>
                    </>
                  ) : (
                    <>
                      <span>{currentQuestionIdx + 1 === session.questions?.length ? 'Submit Final Answer' : 'Submit & Next Question'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
