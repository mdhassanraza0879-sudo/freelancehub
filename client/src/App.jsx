import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobBoard from './pages/JobBoard';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import FreelancerProfile from './pages/FreelancerProfile';
import Dashboard from './pages/Dashboard';
import Applicants from './pages/Applicants';
import EditProfile from './pages/EditProfile';
import Pricing from './pages/Pricing';
import './index.css';

// Protected Route wrapper - Enforces strict Login/Signup
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Freelancers browse page (reuses logic)
import { useEffect, useState } from 'react';
import { getFreelancers } from './utils/api';
import FreelancerCard from './components/FreelancerCard';
import { Search, Loader2, Users } from 'lucide-react';

const FreelancersPage = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchFreelancers = async (searchTerm = '') => {
    setLoading(true);
    try {
      const params = searchTerm ? { search: searchTerm } : {};
      const { data } = await getFreelancers(params);
      setFreelancers(data.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFreelancers(search);
  };

  return (
    <div className="freelancers-page page-container">
      <div className="page-header">
        <div className="hero-badge">👥 Top Verified Professionals</div>
        <h1>Browse Verified Freelancers</h1>
        <p>Find top developers, designers, and remote experts across India</p>
      </div>

      <form onSubmit={handleSearch} className="search-bar search-bar--lg mb-8">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search by skill, name, title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {loading ? (
        <div className="loading-center">
          <Loader2 size={32} className="spinner" />
        </div>
      ) : freelancers.length === 0 ? (
        <div className="empty-state">
          <Users size={48} color="#94a3b8" />
          <h3>No freelancers found</h3>
          <p>Try searching for a different skill or title</p>
        </div>
      ) : (
        <div className="freelancers-grid">
          {freelancers.map((f) => <FreelancerCard key={f._id} freelancer={f} />)}
        </div>
      )}
    </div>
  );
};

import CompanyDirectory from './pages/CompanyDirectory';
import Networking from './pages/Networking';
import Team from './pages/Team';
import WalletPage from './pages/WalletPage';
import SupportPage from './pages/SupportPage';
import AboutFreelanceHub from './pages/AboutFreelanceHub';

const AppRoutes = () => (
  <>
    <Navbar />
    <main className="main-content">
      <Routes>
        {/* Public Visitor Informational Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutFreelanceHub />} />
        <Route path="/team" element={<Team />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Strictly Protected Authenticated Features (Require Login/Signup) */}
        <Route path="/jobs" element={<ProtectedRoute><JobBoard /></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
        <Route path="/companies" element={<ProtectedRoute><CompanyDirectory /></ProtectedRoute>} />
        <Route path="/connect" element={<ProtectedRoute><Networking /></ProtectedRoute>} />
        <Route path="/freelancers" element={<ProtectedRoute><FreelancersPage /></ProtectedRoute>} />
        <Route path="/freelancers/:username" element={<ProtectedRoute><FreelancerProfile /></ProtectedRoute>} />
        <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/jobs/:id/applicants" element={<ProtectedRoute><Applicants /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
