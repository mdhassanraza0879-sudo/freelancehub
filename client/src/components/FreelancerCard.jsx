import { Link } from 'react-router-dom';
import { Star, MapPin, IndianRupee, Eye } from 'lucide-react';

const FreelancerCard = ({ freelancer }) => {
  const {
    username, name, title, skills, hourlyRate,
    rating, reviewCount, location, profilePicture, isPremium, profileViews,
  } = freelancer;

  return (
    <div className={`freelancer-card ${isPremium ? 'freelancer-card--premium' : ''}`}>
      {isPremium && <span className="premium-badge">💎 Premium</span>}

      <div className="freelancer-card-top">
        <div className="freelancer-avatar">
          {profilePicture ? (
            <img src={profilePicture} alt={name} />
          ) : (
            <div className="avatar-placeholder">
              {name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="freelancer-info">
          <Link to={`/freelancers/${username}`} className="freelancer-name">
            {name}
          </Link>
          <p className="freelancer-title">{title || 'Freelancer'}</p>
          <div className="freelancer-rating">
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span>{rating > 0 ? rating.toFixed(1) : 'New'}</span>
            {reviewCount > 0 && <span className="review-count">({reviewCount})</span>}
          </div>
        </div>
      </div>

      <div className="freelancer-meta">
        {location && (
          <span className="meta-item"><MapPin size={13} /> {location}</span>
        )}
        {hourlyRate > 0 && (
          <span className="meta-item">
            <IndianRupee size={13} /> {hourlyRate.toLocaleString()}/hr
          </span>
        )}
        <span className="meta-item"><Eye size={13} /> {profileViews || 0} views</span>
      </div>

      <div className="freelancer-skills">
        {skills?.slice(0, 4).map((skill) => (
          <span key={skill} className="skill-tag">{skill}</span>
        ))}
        {skills?.length > 4 && (
          <span className="skill-tag skill-tag--more">+{skills.length - 4}</span>
        )}
      </div>

      <Link
        to={`/freelancers/${username}`}
        className="btn btn-outline btn-sm freelancer-card-btn"
      >
        View Profile
      </Link>
    </div>
  );
};

export default FreelancerCard;
