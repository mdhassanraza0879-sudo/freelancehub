import { Mail, Phone, CheckCircle2, Users } from 'lucide-react';

const LEADERSHIP_MEMBERS = [
  {
    role: 'Founder & Chief Architect',
    name: 'Mohammad Hassan Raza',
    contactType: 'email',
    contactValue: 'MdHassanRaza0879@gmail.com',
    avatar: 'M',
    color: 'from-indigo-500 to-purple-600',
    bio: 'Founder & Lead Architect of FreelanceHub. Overseeing Pan-India scaling, WFH platform expansion, and strict security protocols.'
  },
  {
    role: 'Operations & Enterprise Partnerships Lead',
    name: 'Dilshad Ahmad',
    contactType: 'phone',
    contactValue: '8657869608',
    avatar: 'D',
    color: 'from-emerald-500 to-teal-600',
    bio: 'Head of Client Onboarding and Pan-India Enterprise Partnerships across WFH technology domains.'
  },
  {
    role: 'Technical Support & Verification Lead',
    name: 'Barkat Ali',
    contactType: 'phone',
    contactValue: '7905360188',
    avatar: 'B',
    color: 'from-amber-500 to-orange-600',
    bio: 'Director of 24/7 Customer Support and Wallet Payout Security verification.'
  }
];

const Team = () => {
  return (
    <div className="team-page-wrapper">
      <div className="page-container">
        {/* Header */}
        <div className="team-hero-header animate-fade-in-up">
          <div className="hero-badge">
            <Users size={16} className="inline mr-1 text-indigo-400" /> Pan-India Leadership Team
          </div>
          <h1>FreelanceHub Leadership & Management</h1>
          <p>
            Dedicated to providing Pan-India Work from Home (WFH) opportunities, 100% user privacy,
            wallet payout security, and 24/7 customer support.
          </p>
        </div>

        {/* Leadership Grid */}
        <div className="team-cards-grid animate-fade-in-up">
          {LEADERSHIP_MEMBERS.map((member) => (
            <div key={member.name} className="team-card">
              <div className="team-avatar-box">
                <div className={`team-avatar bg-gradient-to-br ${member.color}`}>
                  {member.avatar}
                </div>
                <div className="team-verified-badge">
                  <CheckCircle2 size={16} color="#fff" />
                </div>
              </div>

              <div className="team-card-content">
                <span className="team-role-tag">{member.role}</span>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-bio">{member.bio}</p>

                <div className="team-contact-box">
                  {member.contactType === 'email' ? (
                    <a href={`mailto:${member.contactValue}`} className="team-contact-link email-link">
                      <Mail size={16} />
                      <span>{member.contactValue}</span>
                    </a>
                  ) : (
                    <a href={`tel:+91${member.contactValue}`} className="team-contact-link phone-link">
                      <Phone size={16} />
                      <span>+91 {member.contactValue}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pan-India WFH Vision Card */}
        <div className="wfh-vision-card animate-fade-in-up">
          <div className="vision-badge">🇮🇳 Pan-India Vision</div>
          <h2>Scaling Work From Home (WFH) Opportunities Across India</h2>
          <p>
            Our core mission is to provide secure, flexible, and high-paying WFH roles for developers, designers,
            writers, AI specialists, and professionals across all 28 states and union territories.
          </p>
          <div className="vision-stats-row">
            <div className="vision-stat">
              <strong>1,000+</strong>
              <span>Verified Companies</span>
            </div>
            <div className="vision-stat">
              <strong>100%</strong>
              <span>WFH Accessibility</span>
            </div>
            <div className="vision-stat">
              <strong>24/7</strong>
              <span>Live Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
