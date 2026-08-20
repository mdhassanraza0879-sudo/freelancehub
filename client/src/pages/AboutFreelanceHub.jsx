import {
  Code2,
  Building2,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  Award,
  Users,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutFreelanceHub = () => {
  return (
    <div className="about-fh-wrapper">
      <div className="page-container">
        {/* Top Hero Banner */}
        <div className="about-hero-header animate-fade-in-up">
          <div className="hero-badge">
            <Code2 size={16} className="inline mr-1 text-indigo-400" /> Platform Overview & Business Architecture
          </div>
          <h1>What is FreelanceHub?</h1>
          <p>
            FreelanceHub is India’s premier Pan-India Work from Home (WFH) ecosystem, connecting 1,000+ real top companies
            with verified Indian freelancers, developers, designers, and professionals.
          </p>
        </div>

        {/* What is FreelanceHub Card */}
        <div className="about-card-box animate-fade-in-up">
          <div className="card-badge">✨ Core Mission</div>
          <h2>Transforming Remote Work & Freelancing Across India</h2>
          <p className="about-lead-text">
            FreelanceHub was founded by <strong>Mohammad Hassan Raza</strong> to eliminate middleman commissions,
            provide 1,000 real company WFH opportunities, and ensure 100% wallet payout security for every Indian worker.
          </p>

          <div className="about-highlights-grid">
            <div className="highlight-item">
              <Building2 size={24} className="text-indigo-400 mb-2" />
              <h4>1,000 Real Companies</h4>
              <p>Direct applications to tech giants like Google, TCS, Infosys, Razorpay, Swiggy, and Flipkart.</p>
            </div>

            <div className="highlight-item">
              <Briefcase size={24} className="text-emerald-400 mb-2" />
              <h4>Pan-India WFH Jobs</h4>
              <p>100% remote Work from Home roles accessible across all 28 Indian states & UTs.</p>
            </div>

            <div className="highlight-item">
              <ShieldCheck size={24} className="text-amber-400 mb-2" />
              <h4>100% Wallet Security</h4>
              <p>Direct bank & UPI payouts with 256-bit encryption and 24/7 dedicated support.</p>
            </div>
          </div>
        </div>

        {/* How Real Work Happens (Step-by-Step) */}
        <div className="about-card-box animate-fade-in-up">
          <div className="card-badge bg-emerald-500/20 text-emerald-400">⚙️ How Real Work Happens</div>
          <h2>Step-by-Step Work Execution & Income Flow</h2>
          <p className="about-lead-text">
            Every contract on FreelanceHub follows a transparent 4-step real-world workflow:
          </p>

          <div className="workflow-steps-container">
            <div className="workflow-step-card">
              <div className="step-num">1</div>
              <div>
                <h3>Client Posts WFH Role</h3>
                <p>Hiring company specifies exact project deliverables, budget (e.g. ₹15,000 - ₹50,000), and deadline.</p>
              </div>
            </div>

            <div className="workflow-step-card">
              <div className="step-num">2</div>
              <div>
                <h3>User Reviews & Submits Application</h3>
                <p>Freelancer reviews complete deliverables in the 2-step review modal and submits a verified bid.</p>
              </div>
            </div>

            <div className="workflow-step-card">
              <div className="step-num">3</div>
              <div>
                <h3>Real Remote Work Execution</h3>
                <p>Freelancer completes code, design, or writing milestones from home with 100% flexible hours.</p>
              </div>
            </div>

            <div className="workflow-step-card">
              <div className="step-num">4</div>
              <div>
                <h3>Instant Payout & Bank Settlement</h3>
                <p>Client approves completed milestones. Funds are credited to user wallet for instant Bank/UPI withdrawal!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Revenue & Founder Profit Architecture */}
        <div className="about-card-box profit-model-card animate-fade-in-up">
          <div className="card-badge bg-amber-500/20 text-amber-300">💰 Monetization Engine</div>
          <h2>How Users Earn Income & Founder (Owner) Makes Profit</h2>
          <p className="about-lead-text">
            FreelanceHub is designed for dual mutual prosperity:
          </p>

          <div className="profit-split-grid">
            {/* User Income */}
            <div className="profit-box user-profit-box">
              <div className="profit-header">
                <Users size={24} className="text-emerald-400" />
                <h3>For Users & Freelancers</h3>
              </div>
              <ul>
                <li><CheckCircle2 size={16} className="text-emerald-400 inline mr-2" /> Keep 100% of earned contract rates.</li>
                <li><CheckCircle2 size={16} className="text-emerald-400 inline mr-2" /> Direct Bank & UPI payouts within 24 hours.</li>
                <li><CheckCircle2 size={16} className="text-emerald-400 inline mr-2" /> Earn referral bonuses via generated mutual links.</li>
              </ul>
            </div>

            {/* Founder Profit */}
            <div className="profit-box founder-profit-box">
              <div className="profit-header">
                <Award size={24} className="text-amber-400" />
                <h3>For Founder & Owner (Mohammad Hassan Raza)</h3>
              </div>
              <ul>
                <li><CheckCircle2 size={16} className="text-amber-400 inline mr-2" /> <strong>5% Platform Service Fee:</strong> Earned automatically on every completed client payout.</li>
                <li><CheckCircle2 size={16} className="text-amber-400 inline mr-2" /> <strong>Premium Subscriptions:</strong> ₹199/mo (Freelancer Premium) & ₹499/mo (Client Pro).</li>
                <li><CheckCircle2 size={16} className="text-amber-400 inline mr-2" /> <strong>Featured Listing Credits:</strong> ₹299 per 30-day company/job highlight.</li>
              </ul>
            </div>
          </div>

          <div className="about-cta-bar">
            <Link to="/register" className="btn btn-primary btn-glow">
              Create Free Account & Start Earning <ArrowRight size={16} />
            </Link>
            <Link to="/team" className="btn btn-secondary">
              Meet Leadership Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutFreelanceHub;
