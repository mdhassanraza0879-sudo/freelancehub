import { Link } from 'react-router-dom';
import { MapPin, Clock, IndianRupee, Star, Bookmark } from 'lucide-react';

const JobCard = ({ job }) => {
  const {
    _id, title, category, budgetMin, budgetMax, budgetType,
    skillsRequired, location, experienceLevel, isFeatured,
    applicationCount, createdAt, client,
  } = job;

  const postedAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const expColor = {
    entry: 'badge-green',
    intermediate: 'badge-blue',
    expert: 'badge-purple',
  };

  return (
    <div className={`job-card ${isFeatured ? 'job-card--featured' : ''}`}>
      {isFeatured && <span className="featured-label">⭐ Featured</span>}

      <div className="job-card-header">
        <div>
          <Link to={`/jobs/${_id}`} className="job-card-title">{title}</Link>
          <p className="job-card-client">
            {client?.companyName || client?.name}
          </p>
        </div>
        <span className={`badge ${expColor[experienceLevel]}`}>
          {experienceLevel}
        </span>
      </div>

      <div className="job-card-meta">
        <span className="meta-item">
          <MapPin size={14} /> {location || 'Remote'}
        </span>
        <span className="meta-item">
          <IndianRupee size={14} />
          {budgetMin.toLocaleString()} – {budgetMax.toLocaleString()}
          {budgetType === 'hourly' ? '/hr' : ' fixed'}
        </span>
        <span className="meta-item">
          <Clock size={14} /> {postedAgo(createdAt)}
        </span>
      </div>

      <div className="job-card-skills">
        {skillsRequired?.slice(0, 4).map((skill) => (
          <span key={skill} className="skill-tag">{skill}</span>
        ))}
        {skillsRequired?.length > 4 && (
          <span className="skill-tag skill-tag--more">+{skillsRequired.length - 4}</span>
        )}
      </div>

      <div className="job-card-footer">
        <span className="applicants-count">{applicationCount} applicants</span>
        <Link to={`/jobs/${_id}`} className="btn btn-sm btn-primary">Apply Now</Link>
      </div>
    </div>
  );
};

export default JobCard;
