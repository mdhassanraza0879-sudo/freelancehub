import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Users, Star, Shield, TrendingUp, Code2 } from 'lucide-react';

const CATEGORIES = [
  { icon: '💻', label: 'Web Development' },
  { icon: '📱', label: 'Mobile Development' },
  { icon: '🎨', label: 'Design & Creative' },
  { icon: '✍️', label: 'Writing & Translation' },
  { icon: '📊', label: 'Data Science & AI' },
  { icon: '📣', label: 'Marketing' },
  { icon: '🎬', label: 'Video & Animation' },
  { icon: '⚙️', label: 'Other' },
];

const STATS = [
  { value: '10K+', label: 'Freelancers', icon: <Users size={28} /> },
  { value: '5K+', label: 'Jobs Posted', icon: <Briefcase size={28} /> },
  { value: '4.8★', label: 'Avg Rating', icon: <Star size={28} /> },
  { value: '₹0', label: 'Free to Join', icon: <Shield size={28} /> },
];

const Home = () => {
  return (
    <div className="home">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 India's #1 Freelance Platform</div>
          <h1 className="hero-title">
            Find Top Freelancers
            <span className="gradient-text"> Instantly</span>
          </h1>
          <p className="hero-subtitle">
            Connect with skilled professionals across India. Post jobs, build your
            portfolio, and grow your career — all in one place.
          </p>
          <div className="hero-actions">
            <Link to="/jobs" className="btn btn-primary btn-lg">
              Browse Jobs <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              Post a Project
            </Link>
          </div>
          <p className="hero-note">✓ Free to join &nbsp;·&nbsp; ✓ No hidden fees &nbsp;·&nbsp; ✓ Verified profiles</p>
        </div>
        <div className="hero-illustration">
          <div className="hero-card-float card-1">
            <Code2 size={24} color="#6366f1" />
            <span>React Developer</span>
            <strong>₹2,500/hr</strong>
          </div>
          <div className="hero-card-float card-2">
            <Star size={20} color="#f59e0b" fill="#f59e0b" />
            <span>Project Completed</span>
            <strong>★ 5.0 Rating</strong>
          </div>
          <div className="hero-card-float card-3">
            <TrendingUp size={20} color="#10b981" />
            <span>New Job</span>
            <strong>₹50,000 Fixed</strong>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="stats-bar">
        {STATS.map((stat) => (
          <div key={stat.label} className="stat-item">
            <div className="stat-icon">{stat.icon}</div>
            <div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Categories ──────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="section-header">
          <h2>Browse by Category</h2>
          <p>Find the right talent for every type of project</p>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              to={`/jobs?category=${encodeURIComponent(cat.label)}`}
              className="category-card"
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-label">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start?</h2>
          <p>Join thousands of freelancers and clients already using FreelanceHub</p>
          <div className="cta-buttons">
            <Link to="/register?role=freelancer" className="btn btn-white btn-lg">
              I'm a Freelancer
            </Link>
            <Link to="/register?role=client" className="btn btn-outline-white btn-lg">
              I'm Hiring
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
