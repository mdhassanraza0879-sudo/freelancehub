import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../utils/api';
import { triggerCelebration } from '../utils/confetti';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Code2, Sparkles, ArrowRight, ShieldCheck, Zap, AlertCircle, CheckCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Strict Validation Logic
  const validateField = (name, value) => {
    let err = '';
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        err = 'Email address is required';
      } else if (!emailRegex.test(value)) {
        err = 'Please enter a valid email address (e.g., name@example.com)';
      }
    }
    if (name === 'password') {
      if (!value) {
        err = 'Password is required';
      } else if (value.length < 6) {
        err = 'Password must be at least 6 characters long';
      }
    }
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields strictly before submit
    const emailErr = validateField('email', form.email);
    const passErr = validateField('password', form.password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      setTouched({ email: true, password: true });
      return toast.error('Please resolve validation errors before submitting.');
    }

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
      toast.error(err.response?.data?.message || 'Login failed. Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email, password) => {
    setForm({ email, password });
    setErrors({});
    toast('Demo credentials filled cleanly!', { icon: '✨' });
  };

  return (
    <div className="auth-page animated-mesh-bg">
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
        <p className="auth-subtitle">Sign in to access 1,000 companies & income portal</p>

        {/* Quick Demo Accounts */}
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

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email Field */}
          <div className="form-group">
            <label>Email Address</label>
            <div className={`input-icon-wrapper animated-input ${errors.email ? 'input-error' : touched.email && !errors.email ? 'input-success' : ''}`}>
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {touched.email && !errors.email && (
                <CheckCircle size={16} className="input-valid-icon" />
              )}
            </div>
            {errors.email && (
              <span className="field-error-msg">
                <AlertCircle size={13} /> {errors.email}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label>Password</label>
            <div className={`input-icon-wrapper animated-input ${errors.password ? 'input-error' : touched.password && !errors.password ? 'input-success' : ''}`}>
              <Lock size={18} className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
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
            {errors.password && (
              <span className="field-error-msg">
                <AlertCircle size={13} /> {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-full btn-glow ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex-center gap-2">
                <span className="spinner-dot"></span> Validating & Signing in...
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
          <span>Strict Security & 256-bit SSL Encrypted</span>
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
