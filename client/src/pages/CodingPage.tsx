import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Code2, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  Cpu, 
  RefreshCw,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

const sampleProblems = [
  {
    id: 'prob-two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input would have exactly one solution.',
    starterCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    sampleTestCases: [
      { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]' }
    ]
  },
  {
    id: 'prob-valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    starterCode: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
    sampleTestCases: [
      { input: 's = "()"', expectedOutput: 'true' },
      { input: 's = "()[]{}"', expectedOutput: 'true' }
    ]
  }
];

export const CodingPage: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState(sampleProblems[0]);
  const [code, setCode] = useState(sampleProblems[0].starterCode);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSelectProblem = (prob: any) => {
    setSelectedProblem(prob);
    setCode(prob.starterCode);
    setResult(null);
  };

  const handleExecute = async () => {
    setRunning(true);
    setResult(null);
    try {
      const res = await api.executeCode({
        problemId: selectedProblem.id,
        language: 'javascript',
        code,
      });

      if (res.success) {
        setResult(res.data);
        if (res.data.status === 'Accepted') {
          confetti({ particleCount: 50, spread: 60 });
        }
      }
    } catch (err) {
      console.error('Code execution failed', err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-amber-400" />
            <span>Interactive Code Sandbox & AI Complexity Reviewer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Execute algorithmic challenges in an isolated VM sandbox with automated Big-O complexity feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {sampleProblems.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectProblem(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                selectedProblem.id === p.id
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-dark-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Problem Description & Test Cases */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-100">{selectedProblem.title}</h2>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {selectedProblem.difficulty}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedProblem.description}</p>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sample Test Cases</h4>
              <div className="space-y-2">
                {selectedProblem.sampleTestCases.map((tc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-dark-900 border border-slate-800 text-xs font-mono space-y-1">
                    <p className="text-slate-400">Input: <span className="text-slate-200">{tc.input}</span></p>
                    <p className="text-slate-400">Expected: <span className="text-amber-300">{tc.expectedOutput}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Execution Result & AI Complexity Analysis */}
          {result && (
            <div className="glass-card p-6 rounded-2xl border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {result.status === 'Accepted' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                  <h3 className={`text-base font-bold ${result.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {result.status}
                  </h3>
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {result.executionTimeMs || 4} ms
                  </span>
                  <span className="font-semibold text-slate-200">
                    Passed: {result.totalPassed}/{result.totalTests}
                  </span>
                </div>
              </div>

              {result.aiReview && (
                <div className="p-4 rounded-xl bg-dark-900 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Cpu className="w-4 h-4" />
                    <span>AI Complexity & Quality Analysis</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <p className="text-slate-400">Time: <span className="text-slate-200 font-bold">{result.aiReview.timeComplexity || 'O(n)'}</span></p>
                    <p className="text-slate-400">Space: <span className="text-slate-200 font-bold">{result.aiReview.spaceComplexity || 'O(n)'}</span></p>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2">
                    {result.aiReview.critique || 'Optimal solution utilizing hash map for single-pass lookup.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Code Editor */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-400">JavaScript / TypeScript Sandbox</span>
            <button
              onClick={handleExecute}
              disabled={running}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-brand-600 hover:from-amber-400 hover:to-brand-500 text-dark-950 font-bold text-xs shadow-glow-brand transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {running ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-dark-950" />
                  <span>Run Sandbox Tests</span>
                </>
              )}
            </button>
          </div>

          <textarea
            rows={18}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full flex-1 p-4 rounded-xl bg-dark-950 border border-slate-800 text-xs text-amber-200 font-mono focus:outline-none focus:border-amber-500 leading-relaxed resize-none selection:bg-amber-500/30"
          />
        </div>
      </div>
    </div>
  );
};
