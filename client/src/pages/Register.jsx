import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../utils/api';
import { triggerCelebration } from '../utils/confetti';
import toast from 'react-hot-toast';
import { Mail, Lock, User, AtSign, Code2, Eye, EyeOff, Briefcase, Building2, CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: searchParams.get('role') || 'freelancer',
    username: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const payload = { ...form };
      if (form.role === 'client') delete payload.username;

      const { data } = await registerUser(payload);
      login(data.token, data.user);
      triggerCelebration();
      toast.success('Account created! Welcome to FreelanceHub 🎉');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors?.length) {
        errors.forEach((e) => toast.error(e.msg));
      } else {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animated-mesh-bg">
      {/* Floating Ambient Blobs */}
      <div className="ambient-blob ambient-blob-1"></div>
      <div className="ambient-blob ambient-blob-2"></div>
      <div className="ambient-blob ambient-blob-3"></div>

      <div className="auth-card auth-card--wide glass-card animate-fade-in-up">
        <div className="auth-logo-badge">
          <div className="logo-icon-pulse">
            <Code2 size={30} color="#fff" />
          </div>
          <span className="logo-text">FreelanceHub</span>
        </div>

        <h2 className="auth-title">Create Your Free Account 🚀</h2>
        <p className="auth-subtitle">Join India's fastest-growing freelance community</p>

        {/* Animated Visual Role Switcher Cards */}
        <div className="animated-role-container">
          <div
            className={`role-select-card ${form.role === 'freelancer' ? 'role-selected' : ''}`}
            onClick={() => setForm((p) => ({ ...p, role: 'freelancer' }))}
          >
            <div className="role-card-header">
              <div className="role-icon-box freelancer-icon-box">
                <Briefcase size={22} />
              </div>
              {form.role === 'freelancer' && (
                <CheckCircle2 size={18} className="role-check-active" />
              )}
            </div>
            <h4 className="role-card-title">I'm a Freelancer</h4>
            <p className="role-card-desc">Find jobs, send proposals & get paid securely</p>
          </div>

          <div
            className={`role-select-card ${form.role === 'client' ? 'role-selected' : ''}`}
            onClick={() => setForm((p) => ({ ...p, role: 'client' }))}
          >
            <div className="role-card-header">
              <div className="role-icon-box client-icon-box">
                <Building2 size={22} />
              </div>
              {form.role === 'client' && (
                <CheckCircle2 size={18} className="role-check-active" />
              )}
            </div>
            <h4 className="role-card-title">I'm a Client / Hiring</h4>
            <p className="role-card-desc">Post jobs, review applicants & hire top talent</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-icon-wrapper animated-input">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Rahul Sharma"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {form.role === 'freelancer' && (
              <div className="form-group animate-slide-down">
                <label>
                  Username <span className="label-note">(profile URL)</span>
                </label>
                <div className="input-icon-wrapper animated-input">
                  <AtSign size={18} className="input-icon" />
                  <input
                    type="text"
                    name="username"
                    placeholder="rahulsharma"
                    value={form.username}
                    onChange={handleChange}
                    required={form.role === 'freelancer'}
                  />
                </div>
              </div>
            )}
          </div>

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
                placeholder="Minimum 6 characters"
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
                <span className="spinner-dot"></span> Creating Account...
              </span>
            ) : (
              <span className="flex-center gap-2">
                Get Started Free <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        <div className="auth-footer-security">
          <ShieldCheck size={14} color="#10b981" />
          <span>100% Free to Join • No Credit Card Required</span>
        </div>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-highlight-link">
            Sign In <Sparkles size={14} className="inline ml-1" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
