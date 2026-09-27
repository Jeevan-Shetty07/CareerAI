import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  GitFork,
  MessageSquare,
  Code2,
  Github,
  CheckSquare,
  Bot
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/resume', label: 'Resume & ATS Score', icon: FileText },
  { to: '/jobs', label: 'Job Skill Matcher', icon: Briefcase },
  { to: '/roadmaps', label: 'Learning Roadmaps', icon: GitFork },
  { to: '/interviews', label: 'AI Mock Interview', icon: MessageSquare },
  { to: '/coding', label: 'Code Sandbox & Review', icon: Code2 },
  { to: '/github', label: 'GitHub Intelligence', icon: Github },
  { to: '/applications', label: 'Job Tracker', icon: CheckSquare },
  { to: '/assistant', label: 'Career AI Copilot', icon: Bot, badge: 'AI' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-dark-900/90 border-r border-slate-800/80 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
          Career Intelligence
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-brand-600/15 text-brand-300 border border-brand-500/30 shadow-glow-brand/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                )
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 transition-colors group-hover:text-brand-400" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-brand-950/50 to-dark-850 border border-brand-500/20 text-center">
        <div className="inline-flex p-2 rounded-lg bg-brand-500/20 text-brand-300 mb-2">
          <Bot className="w-5 h-5 text-brand-400" />
        </div>
        <h4 className="text-xs font-semibold text-slate-200">AI Career Readiness</h4>
        <p className="text-[11px] text-slate-400 mt-1">Boost match rating and interview confidence</p>
      </div>
    </aside>
  );
};
