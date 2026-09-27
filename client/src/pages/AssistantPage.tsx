import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  HelpCircle, 
  DollarSign, 
  FileText, 
  Briefcase,
  RefreshCw
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedActions?: string[];
}

const suggestedPrompts = [
  'How do I negotiate a $140k tech salary offer with competing bids?',
  'What are the most common system design questions for senior full stack roles?',
  'How do I reword my resume bullets to highlight quantifiable impact?',
  'What key questions should I ask an engineering hiring manager at the end of an interview?'
];

export const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Hello! I am your CareerAI Copilot. How can I assist with your resume strategy, salary negotiations, technical interview preparation, or career roadmap today?',
      suggestedActions: ['Salary Negotiation', 'Resume Bullet Review', 'System Design Tips']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askAssistant(query);
      if (res.success) {
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: res.data.reply,
          suggestedActions: res.data.suggestedActions,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error('Failed to get assistant reply', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Bot className="w-6 h-6 text-brand-400" />
          <span>AI Career Copilot & Advisory Assistant</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Specialized career intelligence for compensation strategies, cover letter formulation, and architectural interview drills.
        </p>
      </div>

      {/* Suggested Prompts Pill Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-dark-900 border border-slate-800 hover:border-brand-500/40 text-slate-300 hover:text-brand-300 text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-brand-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Conversation Box */}
      <div className="flex-1 glass-card p-6 rounded-3xl border border-slate-800 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-3 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                m.sender === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-dark-900 border border-slate-800 text-slate-200'
              }`}
            >
              <p className="whitespace-pre-line font-sans">{m.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3 text-xs text-brand-400 font-medium p-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Career Copilot is analyzing response...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="glass-card p-3 rounded-2xl border border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about salary negotiation, interview strategy, technical transitions..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500 font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-glow-brand transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
