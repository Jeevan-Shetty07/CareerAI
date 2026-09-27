const API_BASE = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('careerai_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('careerai_token', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('careerai_token');
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle FormData upload (don't force Content-Type)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

// API Service Functions
export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    apiRequest<{ success: boolean; data: { token: string; user: any; profile: any } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (payload: { email: string; password: string; fullName: string; targetRole?: string }) =>
    apiRequest<{ success: boolean; data: { token: string; user: any; profile: any } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () =>
    apiRequest<{ success: boolean; data: { user: any; profile: any } }>('/auth/me'),

  // Resumes
  getResume: () =>
    apiRequest<{ success: boolean; data: any }>('/resumes/latest'),

  uploadResume: (formData: FormData) =>
    apiRequest<{ success: boolean; message: string; data: any }>('/resumes/upload', {
      method: 'POST',
      body: formData,
    }),

  analyzeResumeText: (text: string) =>
    apiRequest<{ success: boolean; data: any }>('/resumes/analyze-text', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  // Jobs & Skills
  matchJob: (payload: { jobDescription: string; resumeSkills?: any; targetRole?: string }) =>
    apiRequest<{ success: boolean; data: any }>('/jobs/match', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Roadmaps
  generateRoadmap: (payload: { targetRole: string; currentSkills?: string[]; weeks?: number }) =>
    apiRequest<{ success: boolean; data: any }>('/roadmaps/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getLatestRoadmap: () =>
    apiRequest<{ success: boolean; data: any }>('/roadmaps/latest'),

  // Interviews
  startInterview: (payload: { role: string; experience?: string; difficulty?: string; interviewType?: string }) =>
    apiRequest<{ success: boolean; data: any }>('/interviews/start', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitInterviewAnswer: (payload: { interviewId: string; questionId: string; answer: string }) =>
    apiRequest<{ success: boolean; data: any }>('/interviews/submit-answer', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  completeInterview: (interviewId: string) =>
    apiRequest<{ success: boolean; data: any }>(`/interviews/${interviewId}/complete`, {
      method: 'POST',
    }),

  getInterviewHistory: () =>
    apiRequest<{ success: boolean; data: any[] }>('/interviews/history'),

  // Coding Sandbox
  getCodingProblems: () =>
    apiRequest<{ success: boolean; data: any[] }>('/coding/problems'),

  getCodingProblemById: (id: string) =>
    apiRequest<{ success: boolean; data: any }>(`/coding/problems/${id}`),

  executeCode: (payload: { problemId: string; language: string; code: string }) =>
    apiRequest<{ success: boolean; data: any }>('/coding/execute', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // GitHub Analysis
  analyzeGitHub: (username: string) =>
    apiRequest<{ success: boolean; data: any }>('/github/analyze', {
      method: 'POST',
      body: JSON.stringify({ username }),
    }),

  getLatestGitHub: () =>
    apiRequest<{ success: boolean; data: any }>('/github/latest'),

  // Applications Tracker
  getApplications: () =>
    apiRequest<{ success: boolean; data: any[] }>('/applications'),

  createApplication: (payload: any) =>
    apiRequest<{ success: boolean; data: any }>('/applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateApplication: (id: string, payload: any) =>
    apiRequest<{ success: boolean; data: any }>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteApplication: (id: string) =>
    apiRequest<{ success: boolean; message: string }>(`/applications/${id}`, {
      method: 'DELETE',
    }),

  // Career AI Assistant
  askAssistant: (message: string, context?: any) =>
    apiRequest<{ success: boolean; data: { reply: string; suggestedActions?: string[] } }>('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    }),
};
