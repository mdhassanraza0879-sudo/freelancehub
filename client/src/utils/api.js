import axios from 'axios';

// Dynamically resolve API baseURL based on environment and hostname
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api'; // Relative endpoint for Vercel production and mobile browsers
  }
  return 'http://localhost:5000/api'; // Local development fallback
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 12000,
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('fh_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// ── Users ─────────────────────────────────────────────────────────────────────
export const getFreelancers = (params) => API.get('/users/freelancers', { params });
export const getFreelancerProfile = (username) => API.get(`/users/profile/${username}`);
export const updateProfile = (data) => API.put('/users/profile', data);
export const getDashboard = () => API.get('/users/dashboard');

// ── Jobs ──────────────────────────────────────────────────────────────────────
export const getJobs = (params) => API.get('/jobs', { params });
export const getJob = (id) => API.get(`/jobs/${id}`);
export const createJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const getMyJobPostings = () => API.get('/jobs/my/postings');

// ── Applications ──────────────────────────────────────────────────────────────
export const applyToJob = (data) => API.post('/applications', data);
export const getMyApplications = () => API.get('/applications/my');
export const getJobApplicants = (jobId) => API.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (id, status) =>
  API.put(`/applications/${id}/status`, { status });

// ── Companies ────────────────────────────────────────────────────────────────
export const getCompanies = (params) => API.get('/companies', { params });
export const getCompany = (id) => API.get(`/companies/${id}`);
export const applyToCompany = (id) => API.post(`/companies/${id}/apply`);

// ── Wallet & Bank Payouts ────────────────────────────────────────────────────
export const getWallet = () => API.get('/wallet');
export const saveBankDetails = (data) => API.post('/wallet/bank-details', data);
export const withdrawFunds = (data) => API.post('/wallet/withdraw', data);

// ── Payments ─────────────────────────────────────────────────────────────────
export const createPaymentOrder = (planId) => API.post('/payments/create-order', { planId });
export const verifyPaymentSignature = (data) => API.post('/payments/verify', data);

// ── 24/7 Customer Support ───────────────────────────────────────────────────
export const getSupportTickets = () => API.get('/support');
export const createSupportTicket = (data) => API.post('/support', data);
export const replySupportTicket = (id, text) => API.post(`/support/${id}/reply`, { text });

export default API;
