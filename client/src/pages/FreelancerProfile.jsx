import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFreelancerProfile } from '../utils/api';
import { MapPin, Globe, Star, Eye, IndianRupee, Loader2, ExternalLink, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FreelancerProfile = () => {
  const { username } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getFreelancerProfile(username);
        setFreelancer(data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          toast.error('Freelancer not found');
        } else {
          toast.error('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="loading-center">
        <Loader2 size={40} className="spin" />
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Freelancer not found</h3>
          <Link to="/freelancers" className="btn btn-primary">Browse Freelancers</Link>
        </div>
      </div>
    );
  }

  const {
    name, title, bio, skills, hourlyRate, rating, reviewCount,
    location, profilePicture, isPremium, profileViews, portfolioItems, socialLinks,
  } = freelancer;

  return (
    <div className="page-container profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-wrap">
          {profilePicture ? (
            <img src={profilePicture} alt={name} className="profile-avatar" />
          ) : (
            <div className="avatar-placeholder avatar-xl">
              {name?.charAt(0).toUpperCase()}
            </div>
          )}
          {isPremium && <span className="premium-dot">💎</span>}
        </div>

        <div className="profile-info">
          <div className="profile-name-row">
            <h1>{name}</h1>
            {rating > 0 && (
              <div className="profile-rating">
                <Star size={18} fill="#f59e0b" color="#f59e0b" />
                <strong>{rating.toFixed(1)}</strong>
                <span className="text-muted">({reviewCount} reviews)</span>
              </div>
            )}
          </div>
          <p className="profile-title">{title || 'Freelancer'}</p>

          <div className="profile-meta">
            {location && <span><MapPin size={15} /> {location}</span>}
            {hourlyRate > 0 && (
              <span><IndianRupee size={15} /> {hourlyRate.toLocaleString()}/hr</span>
            )}
            <span><Eye size={15} /> {profileViews} profile views</span>
          </div>

          <div className="profile-social">
            {socialLinks?.github && (
              <a href={socialLinks.github} target="_blank" rel="noreferrer" className="social-link">
                <Link2 size={18} /> GitHub
              </a>
            )}
            {socialLinks?.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="social-link">
                <Link2 size={18} /> LinkedIn
              </a>
            )}
            {socialLinks?.website && (
              <a href={socialLinks.website} target="_blank" rel="noreferrer" className="social-link">
                <Globe size={18} /> Website
              </a>
            )}
          </div>
        </div>

        <Link to="/jobs" className="btn btn-primary profile-hire-btn">
          Hire {name?.split(' ')[0]}
        </Link>
      </div>

      <div className="profile-body">
        <div className="profile-main">
          {/* About */}
          {bio && (
            <section className="profile-section">
              <h2>About</h2>
              <p className="bio-text">{bio}</p>
            </section>
          )}

          {/* Portfolio */}
          {portfolioItems?.length > 0 && (
            <section className="profile-section">
              <h2>Portfolio</h2>
              <div className="portfolio-grid">
                {portfolioItems.map((item, i) => (
                  <div key={i} className="portfolio-card">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="portfolio-img" />
                    )}
                    <div className="portfolio-info">
                      <h4>{item.title}</h4>
                      {item.description && <p>{item.description}</p>}
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noreferrer" className="portfolio-link">
                          <ExternalLink size={14} /> View Project
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="profile-sidebar">
          {skills?.length > 0 && (
            <div className="sidebar-card">
              <h3>Skills</h3>
              <div className="skills-list">
                {skills.map((skill) => (
                  <span key={skill} className="skill-tag skill-tag--lg">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {hourlyRate > 0 && (
            <div className="sidebar-card sidebar-rate">
              <h3>Hourly Rate</h3>
              <div className="rate-display">
                ₹{hourlyRate.toLocaleString()}<span>/hr</span>
              </div>
              <Link to="/jobs" className="btn btn-primary btn-full">
                View Available Jobs
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default FreelancerProfile;
