import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../utils/api';
import { triggerCelebration } from '../utils/confetti';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Code2, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.token, data.user);
      triggerCelebration();
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! 🚀`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email, password) => {
    setForm({ email, password });
    toast('Demo credentials loaded! Click Sign In below.', { icon: '✨' });
  };

  return (
    <div className="auth-page animated-mesh-bg">
      {/* Floating Ambient Glowing Blobs */}
      <div className="ambient-blob ambient-blob-1"></div>
      <div className="ambient-blob ambient-blob-2"></div>
      <div className="ambient-blob ambient-blob-3"></div>

      <div className="auth-card glass-card animate-fade-in-up">
        <div className="auth-logo-badge">
          <div className="logo-icon-pulse">
            <Code2 size={30} color="#fff" />
          </div>
          <span className="logo-text">FreelanceHub</span>
        </div>

        <h2 className="auth-title">Welcome Back 👋</h2>
        <p className="auth-subtitle">Sign in to manage jobs, proposals & earnings</p>

        {/* Quick 1-Click Demo Logins */}
        <div className="demo-credentials-box">
          <div className="demo-header">
            <Zap size={14} className="text-amber-500" />
            <span>Quick 1-Click Demo Login:</span>
          </div>
          <div className="demo-btn-group">
            <button
              type="button"
              className="demo-pill-btn"
              onClick={() => fillDemo('demo.client@freelancehub.in', 'Demo@12345')}
            >
              🏢 Demo Client
            </button>
            <button
              type="button"
              className="demo-pill-btn"
              onClick={() => fillDemo('demo.freelancer@freelancehub.in', 'Demo@12345')}
            >
              💼 Demo Freelancer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-icon-wrapper animated-input">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-icon-wrapper animated-input">
              <Lock size={18} className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPass(!showPass)}
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-full btn-glow ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex-center gap-2">
                <span className="spinner-dot"></span> Authenticating...
              </span>
            ) : (
              <span className="flex-center gap-2">
                Sign In to Dashboard <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        <div className="auth-footer-security">
          <ShieldCheck size={14} color="#10b981" />
          <span>256-bit SSL Encrypted & Secure</span>
        </div>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register" className="auth-highlight-link">
            Create one free <Sparkles size={14} className="inline ml-1" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
