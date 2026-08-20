import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  Users,
  Star,
  Shield,
  TrendingUp,
  Code2,
  Mail,
  Phone,
  Building2,
  UserCheck,
  Award,
  Sparkles,
  CheckCircle2,
  Bell
} from 'lucide-react';

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
  { value: '1,000+', label: 'Real Companies', icon: <Building2 size={28} /> },
  { value: '10K+', label: 'Active Talent', icon: <Users size={28} /> },
  { value: '4.9★', label: 'Client Rating', icon: <Star size={28} /> },
  { value: '₹0', label: 'Free Platform', icon: <Shield size={28} /> },
];

const Home = () => {
  return (
    <div className="home">
      {/* ── Founder & Contact Intro Bar ───────────────────────────────── */}
      <div className="founder-intro-bar">
        <div className="founder-info-left">
          <div className="founder-badge">
            <Award size={16} className="text-amber-400" />
            <span>Platform Created & Founded by <strong>MD Hassan Raza</strong></span>
          </div>
          <p className="founder-tagline">
            Empowering freelancers & clients with 1,000+ real companies, direct networking, and zero commission.
          </p>
        </div>

        <div className="founder-contact-box">
          <a href="mailto:mdhassanraza0879@gmail.com" className="contact-pill mail-pill">
            <Mail size={15} />
            <span>mdhassanraza0879@gmail.com</span>
          </a>
          <a href="tel:+919876543210" className="contact-pill phone-pill">
            <Phone size={15} />
            <span>+91 98765 43210</span>
          </a>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="inline mr-1" /> 1,000 Real Companies Hiring Now
          </div>
          <h1 className="hero-title">
            Connect with 1,000+ Real Companies
            <span className="gradient-text"> & Top Talent</span>
          </h1>
          <p className="hero-subtitle">
            Search 1,000 verified global and Indian enterprises (Google, Microsoft, TCS, Razorpay, Swiggy, etc.),
            receive instant Job Alerts, and generate your custom mutual-benefit networking link!
          </p>

          <div className="hero-actions">
            <Link to="/companies" className="btn btn-primary btn-lg btn-glow">
              <Building2 size={20} /> Explore 1,000 Companies
            </Link>
            <Link to="/jobs" className="btn btn-outline btn-lg">
              Browse 200+ Jobs <ArrowRight size={18} />
            </Link>
          </div>

          <div className="hero-contact-strip">
            <span>📞 Direct Owner Contact: <strong>+91 98765 43210</strong></span>
            <span>✉️ Support Email: <strong>mdhassanraza0879@gmail.com</strong></span>
          </div>
        </div>

        <div className="hero-illustration">
          <div className="hero-card-float card-1">
            <Building2 size={24} color="#6366f1" />
            <span>1,000 Real Companies</span>
            <strong>Direct Applications</strong>
          </div>
          <div className="hero-card-float card-2">
            <Bell size={20} color="#10b981" />
            <span>Instant Job Alerts</span>
            <strong>Active Notifications</strong>
          </div>
          <div className="hero-card-float card-3">
            <TrendingUp size={20} color="#f59e0b" />
            <span>Income Tracking</span>
            <strong>Networking Link Ready</strong>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────────────── */}
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

      {/* ── 1,000 Companies Feature Banner ─────────────────────────────── */}
      <section className="companies-feature-banner">
        <div className="banner-badge">🏢 Corporate Hiring Portal</div>
        <h2>Access Database of 1,000 Real Companies</h2>
        <p>
          Apply to tech leaders including Google, Microsoft, Amazon, TCS, Infosys, Wipro, Razorpay, Flipkart, Swiggy & 990+ top enterprises.
        </p>
        <div className="companies-feature-actions">
          <Link to="/companies" className="btn btn-primary btn-lg">
            View 1,000 Companies Directory <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────────────── */}
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

      {/* ── Owner / Creator Spotlight Section ───────────────────────────── */}
      <section className="owner-spotlight-section">
        <div className="spotlight-card">
          <div className="spotlight-avatar-box">
            <div className="spotlight-avatar">M</div>
            <div className="spotlight-verified"><CheckCircle2 size={16} color="#fff" /></div>
          </div>

          <div className="spotlight-content">
            <span className="spotlight-badge font-semibold">Founder & Architect</span>
            <h3>Platform Created by MD Hassan Raza</h3>
            <p>
              FreelanceHub was built to empower freelancers and employers across India and worldwide.
              With 1,000 real companies, strict auth security, real-time income tracking, and mutual benefit networking links.
            </p>

            <div className="spotlight-contact-row">
              <a href="mailto:mdhassanraza0879@gmail.com" className="spotlight-link">
                <Mail size={16} /> mdhassanraza0879@gmail.com
              </a>
              <a href="tel:+919876543210" className="spotlight-link">
                <Phone size={16} /> +91 98765 43210
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Grow Your Income & Network?</h2>
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
