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

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
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

  useEffect(() => { fetchFreelancers(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFreelancers(search);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Find Skilled Freelancers</h1>
        <p>Browse {freelancers.length}+ professionals ready to work</p>
      </div>
      <form onSubmit={handleSearch} className="search-bar">
        <div className="input-icon-wrapper search-input">
          <Search size={18} className="input-icon" />
          <input
            type="text"
            placeholder="Search by name, skill, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      {loading ? (
        <div className="loading-center"><Loader2 size={40} className="spin" /></div>
      ) : freelancers.length === 0 ? (
        <div className="empty-state"><Users size={48} /><h3>No freelancers found</h3></div>
      ) : (
        <div className="freelancers-grid">
          {freelancers.map((f) => <FreelancerCard key={f._id} freelancer={f} />)}
        </div>
      )}
    </div>
  );
};

const AppRoutes = () => (
  <>
    <Navbar />
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<JobBoard />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/freelancers" element={<FreelancersPage />} />
        <Route path="/freelancers/:username" element={<FreelancerProfile />} />
        <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/pricing" element={<Pricing />} />
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
            style: { borderRadius: '10px', fontSize: '14px' },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
