import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar,
  X
} from 'lucide-react';

const statuses = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'] as const;

export const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: 'Remote',
    salary: '$120,000 - $140,000',
    status: 'Applied',
    notes: 'Applied through company portal with tailored ATS resume.',
  });

  const fetchApplications = async () => {
    try {
      const res = await api.getApplications();
      if (res.success && res.data) {
        setApplications(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createApplication(formData);
      if (res.success) {
        setApplications([...applications, res.data]);
        setShowModal(false);
        setFormData({
          company: '',
          role: '',
          location: 'Remote',
          salary: '$120,000 - $140,000',
          status: 'Applied',
          notes: '',
        });
      }
    } catch (err) {
      console.error('Failed to create application', err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await api.updateApplication(id, { status: newStatus });
      if (res.success) {
        setApplications(applications.map(app => app.id === id ? { ...app, status: newStatus } : app));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.deleteApplication(id);
      if (res.success) {
        setApplications(applications.filter(app => app.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete application', err);
    }
  };

  const getStatusColor = (st: string) => {
    switch (st) {
      case 'Offer': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Interviewing': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Applied': return 'bg-brand-500/10 text-brand-400 border-brand-500/30';
      case 'Rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-brand-400" />
            <span>Job Application & Pipeline Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize active opportunities, interviews, compensation offers, and recruiter timelines.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-glow-brand transition-all flex items-center space-x-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {applications.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl">
            <p className="text-sm text-slate-400">No applications recorded yet. Click above to track your first role!</p>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-500/30 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-slate-100">{app.role}</h3>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {app.company}
                  </span>
                  {app.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {app.location}
                    </span>
                  )}
                  {app.salary && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      {app.salary}
                    </span>
                  )}
                </div>

                {app.notes && (
                  <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">{app.notes}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>

                <button
                  onClick={() => handleDelete(app.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">Add New Job Application</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Netflix"
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white shadow-glow-brand"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
