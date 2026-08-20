import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../utils/api';
import { triggerCelebration } from '../utils/confetti';
import toast from 'react-hot-toast';
import {
  Mail,
  Lock,
  User,
  AtSign,
  Code2,
  Eye,
  EyeOff,
  Briefcase,
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

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

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Strict Field Validation Rules
  const validateField = (name, value, role = form.role) => {
    let err = '';
    if (name === 'name') {
      if (!value.trim()) err = 'Full Name is required';
      else if (value.trim().length < 3) err = 'Name must be at least 3 characters';
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) err = 'Email address is required';
      else if (!emailRegex.test(value)) err = 'Invalid email address format';
    }
    if (name === 'username' && role === 'freelancer') {
      const userRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!value.trim()) err = 'Username is required for freelancers';
      else if (!userRegex.test(value)) err = 'Username must be 3-20 letters/numbers (no spaces)';
    }
    if (name === 'password') {
      if (!value) err = 'Password is required';
      else if (value.length < 6) err = 'Password must be at least 6 characters';
    }
    return err;
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score, label: 'Medium', color: 'bg-amber-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
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

    const nameErr = validateField('name', form.name);
    const emailErr = validateField('email', form.email);
    const userErr = validateField('username', form.username);
    const passErr = validateField('password', form.password);

    if (nameErr || emailErr || (form.role === 'freelancer' && userErr) || passErr) {
      setErrors({ name: nameErr, email: emailErr, username: userErr, password: passErr });
      setTouched({ name: true, email: true, username: true, password: true });
      return toast.error('Please fix validation errors before proceeding.');
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
      const serverErrors = err.response?.data?.errors;
      if (serverErrors?.length) {
        serverErrors.forEach((e) => toast.error(e.msg));
      } else {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const passStrength = getPasswordStrength(form.password);

  return (
    <div className="auth-page animated-mesh-bg">
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

        <h2 className="auth-title">Create Free Account 🚀</h2>
        <p className="auth-subtitle">Join 1,000 real companies & income portal</p>

        {/* Animated Role Switcher */}
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
            <p className="role-card-desc">Apply to 1,000 companies & track earnings</p>
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
            <h4 className="role-card-title">I'm Hiring / Client</h4>
            <p className="role-card-desc">Post jobs & recruit top verified talent</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-row">
            {/* Name */}
            <div className="form-group">
              <label>Full Name</label>
              <div className={`input-icon-wrapper animated-input ${errors.name ? 'input-error' : touched.name && !errors.name ? 'input-success' : ''}`}>
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Rahul Sharma"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              {errors.name && (
                <span className="field-error-msg">
                  <AlertCircle size={13} /> {errors.name}
                </span>
              )}
            </div>

            {/* Username (for Freelancers) */}
            {form.role === 'freelancer' && (
              <div className="form-group animate-slide-down">
                <label>
                  Username <span className="label-note">(profile URL)</span>
                </label>
                <div className={`input-icon-wrapper animated-input ${errors.username ? 'input-error' : touched.username && !errors.username ? 'input-success' : ''}`}>
                  <AtSign size={18} className="input-icon" />
                  <input
                    type="text"
                    name="username"
                    placeholder="rahulsharma"
                    value={form.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={form.role === 'freelancer'}
                  />
                </div>
                {errors.username && (
                  <span className="field-error-msg">
                    <AlertCircle size={13} /> {errors.username}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Email */}
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
            </div>
            {errors.email && (
              <span className="field-error-msg">
                <AlertCircle size={13} /> {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div className={`input-icon-wrapper animated-input ${errors.password ? 'input-error' : touched.password && !errors.password ? 'input-success' : ''}`}>
              <Lock size={18} className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="Minimum 6 characters"
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

            {/* Password Strength Indicator */}
            {form.password && (
              <div className="pass-strength-box">
                <div className="pass-strength-bar-bg">
                  <div
                    className={`pass-strength-bar ${passStrength.color}`}
                    style={{ width: `${(passStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
                <span className="pass-strength-text">
                  Strength: <strong>{passStrength.label}</strong>
                </span>
              </div>
            )}

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
                <span className="spinner-dot"></span> Creating Account...
              </span>
            ) : (
              <span className="flex-center gap-2">
                Create Free Account <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        <div className="auth-footer-security">
          <ShieldCheck size={14} color="#10b981" />
          <span>Strict Input Security • 100% Free to Join</span>
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
