import { useState } from 'react';
import {
  Mail,
  Phone,
  CheckCircle2,
  Users,
  Globe,
  Code2,
  Award,
  ExternalLink,
  Briefcase,
  Star,
  Sparkles,
  Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';

const FOUNDER_PROJECTS = [
  {
    title: 'FreelanceHub WFH Ecosystem',
    category: 'Full Stack & Enterprise Cloud',
    description: 'Pan-India Work from Home freelance marketplace connecting 1,000 real companies with verified Indian professionals.',
    tech: ['React 18', 'Node.js', 'Express', 'MongoDB Atlas', 'Vite'],
    liveLink: 'https://freelancehub-india.vercel.app',
    githubLink: 'https://github.com/mdhassanraza0879-sudo/freelancehub',
    rating: '5.0 ★'
  },
  {
    title: 'Escrow Wallet & Payout System',
    category: 'FinTech & Payment Gateway',
    description: '256-bit SSL encrypted digital wallet with Razorpay integration, instant UPI settlements, and 5% platform profit engine.',
    tech: ['Razorpay API', 'Mongoose', 'JWT Auth', 'Crypto HMAC'],
    liveLink: 'https://freelancehub-india.vercel.app/wallet',
    githubLink: 'https://github.com/mdhassanraza0879-sudo/freelancehub',
    rating: '4.9 ★'
  },
  {
    title: '24/7 Live Support & Ticketing Engine',
    category: 'Realtime Communication',
    description: 'Realtime support thread & ticketing UI for high-priority client resolution and instant user assistance.',
    tech: ['WebSockets / REST', 'React Context', 'Tailwind/CSS'],
    liveLink: 'https://freelancehub-india.vercel.app/support',
    githubLink: 'https://github.com/mdhassanraza0879-sudo/freelancehub',
    rating: '5.0 ★'
  }
];

const Team = () => {
  const [founderMobile, setFounderMobile] = useState('+91 7307670879');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('+91 7307670879');

  const handleSavePhone = (e) => {
    e.preventDefault();
    if (!newPhone.trim()) return;
    setFounderMobile(newPhone.trim());
    setIsEditingPhone(false);
    toast.success('Founder mobile number updated successfully!');
  };

  return (
    <div className="team-page-wrapper">
      <div className="page-container">
        {/* Header */}
        <div className="team-hero-header animate-fade-in-up">
          <div className="hero-badge">
            <Award size={16} className="inline mr-1 text-amber-400" /> Founder & Executive Leadership
          </div>
          <h1>Founder Profile & Project Portfolio Showcase</h1>
          <p>
            Meet Founder <strong>Mohammad Hassan Raza</strong>, explore project reviews, social profiles,
            and executive leadership across Pan-India WFH operations.
          </p>
        </div>

        {/* Founder Featured Card */}
        <div className="founder-spotlight-card animate-fade-in-up mb-8">
          <div className="founder-avatar-wrap">
            <img
              src="/hassan_raza_founder.jpg"
              alt="Mohammad Hassan Raza"
              className="founder-dp-img"
            />
            <div className="founder-verified-badge" title="Verified Founder">
              <CheckCircle2 size={18} color="#fff" />
            </div>
          </div>

          <div className="founder-info-content">
            <div className="flex-center gap-2 mb-1">
              <span className="badge badge-purple">👑 Founder & Chief Executive Officer</span>
              <span className="badge badge-green">Verified Architect</span>
            </div>

            <h2 className="founder-name-title">Mohammad Hassan Raza</h2>
            <p className="founder-intro-bio">
              Lead Full-Stack Web Architect and Founder of <strong>FreelanceHub</strong>. Specialized in building scalable,
              high-performance web applications, 256-bit encrypted escrow wallets, and Pan-India Work from Home (WFH)
              ecosystems. Driven by a vision to empower Indian workers with 1,000 real company opportunities and zero middleman friction.
            </p>

            {/* Social & Contact Strip */}
            <div className="founder-contact-links-row">
              <a
                href="mailto:MdHassanRaza0879@gmail.com"
                className="social-btn email-btn"
              >
                <Mail size={15} /> MdHassanRaza0879@gmail.com
              </a>

              <a
                href="https://www.linkedin.com/in/mdhassanraza0879"
                target="_blank"
                rel="noreferrer"
                className="social-btn linkedin-btn"
              >
                <Globe size={15} /> LinkedIn Profile <ExternalLink size={12} />
              </a>

              <a
                href="https://github.com/mdhassanraza0879-sudo"
                target="_blank"
                rel="noreferrer"
                className="social-btn github-btn"
              >
                <Code2 size={15} /> GitHub Profile <ExternalLink size={12} />
              </a>

              {/* Editable Mobile Phone Pill */}
              <div className="phone-edit-pill">
                <Phone size={14} className="text-emerald-400" />
                {isEditingPhone ? (
                  <form onSubmit={handleSavePhone} className="inline-flex gap-1">
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="phone-input-field"
                    />
                    <button type="submit" className="btn btn-sm btn-success">Save</button>
                  </form>
                ) : (
                  <>
                    <span>{founderMobile}</span>
                    <button
                      onClick={() => setIsEditingPhone(true)}
                      className="edit-icon-btn"
                      title="Update Founder Mobile Number"
                    >
                      <Edit3 size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Project Review & Portfolio Showcase */}
        <div className="projects-showcase-section animate-fade-in-up">
          <div className="section-header-flex">
            <div>
              <span className="badge badge-gold">⭐ Founder Projects & Reviews</span>
              <h2>Mohammad Hassan Raza — Flagship Project Portfolio</h2>
            </div>
            <a
              href="https://github.com/mdhassanraza0879-sudo"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-sm"
            >
              <Code2 size={15} /> View All GitHub Repos
            </a>
          </div>

          <div className="founder-projects-grid">
            {FOUNDER_PROJECTS.map((proj) => (
              <div key={proj.title} className="project-review-card">
                <div className="card-top-bar">
                  <span className="proj-cat-tag">{proj.category}</span>
                  <span className="proj-rating">{proj.rating}</span>
                </div>

                <h3 className="proj-title">{proj.title}</h3>
                <p className="proj-desc">{proj.description}</p>

                <div className="proj-tech-row">
                  {proj.tech.map((t) => (
                    <span key={t} className="tech-pill">{t}</span>
                  ))}
                </div>

                <div className="proj-footer-links">
                  <a href={proj.liveLink} target="_blank" rel="noreferrer" className="link-btn">
                    Live Demo <ExternalLink size={13} />
                  </a>
                  <a href={proj.githubLink} target="_blank" rel="noreferrer" className="link-btn github-link-btn">
                    <Code2 size={13} /> Code Repository
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team Members */}
        <div className="other-leaders-section animate-fade-in-up mt-8">
          <h3 className="leaders-heading"><Users size={18} className="inline mr-2 text-indigo-400" /> Executive Operations Team</h3>
          <div className="team-cards-grid">
            <div className="team-card">
              <div className="team-avatar-box">
                <div className="team-avatar bg-gradient-to-br from-emerald-500 to-teal-600">D</div>
                <div className="team-verified-badge"><CheckCircle2 size={16} color="#fff" /></div>
              </div>
              <div className="team-card-content">
                <span className="team-role-tag">Operations & Partnerships Lead</span>
                <h3 className="team-name">Dilshad Ahmad</h3>
                <p className="team-bio">Head of Client Onboarding and Pan-India Enterprise Partnerships across WFH domains.</p>
                <div className="team-contact-box">
                  <a href="tel:8657869608" className="team-contact-link phone-link">
                    <Phone size={16} /> +91 8657869608
                  </a>
                </div>
              </div>
            </div>

            <div className="team-card">
              <div className="team-avatar-box">
                <div className="team-avatar bg-gradient-to-br from-amber-500 to-orange-600">B</div>
                <div className="team-verified-badge"><CheckCircle2 size={16} color="#fff" /></div>
              </div>
              <div className="team-card-content">
                <span className="team-role-tag">Technical Support Lead</span>
                <h3 className="team-name">Barkat Ali</h3>
                <p className="team-bio">Director of 24/7 Customer Support and Wallet Payout Security verification.</p>
                <div className="team-contact-box">
                  <a href="tel:7905360188" className="team-contact-link phone-link">
                    <Phone size={16} /> +91 7905360188
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
