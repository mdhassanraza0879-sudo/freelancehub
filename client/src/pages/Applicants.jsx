import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobApplicants, updateApplicationStatus } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Star, MapPin, IndianRupee, Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const statusOptions = ['pending', 'shortlisted', 'accepted', 'rejected'];

const statusColors = {
  pending: 'status-pending',
  shortlisted: 'status-shortlisted',
  accepted: 'status-accepted',
  rejected: 'status-rejected',
};

const Applicants = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getJobApplicants(id);
        setApplicants(data.data);
      } catch {
        toast.error('Failed to load applicants');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleStatusChange = async (appId, status) => {
    setUpdating(appId);
    try {
      await updateApplicationStatus(appId, status);
      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status } : a))
      );
      toast.success(`Status updated to ${status} ✅`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return (
    <div className="loading-center"><Loader2 size={40} className="spin" /></div>
  );

  return (
    <div className="page-container">
      <Link to="/dashboard" className="back-link">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="page-header">
        <h1>Job Applicants</h1>
        <p>{applicants.length} application{applicants.length !== 1 ? 's' : ''} received</p>
      </div>

      {applicants.length === 0 ? (
        <div className="empty-state">
          <Users size={48} />
          <h3>No applications yet</h3>
          <p>Share your job posting to attract more freelancers!</p>
        </div>
      ) : (
        <div className="applicants-grid">
          {applicants.map((app) => {
            const f = app.freelancer;
            return (
              <div key={app._id} className="applicant-card">
                {/* Freelancer Info */}
                <div className="applicant-header">
                  <div className="freelancer-card-top">
                    <div className="avatar-placeholder avatar-lg">
                      {f?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <Link to={`/freelancers/${f?.username}`} className="applicant-name">
                        {f?.name}
                      </Link>
                      <p className="freelancer-title">{f?.title || 'Freelancer'}</p>
                      <div className="freelancer-rating">
                        <Star size={13} fill="#f59e0b" color="#f59e0b" />
                        <span>{f?.rating > 0 ? f.rating.toFixed(1) : 'New'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="applicant-meta">
                    {f?.location && <span className="meta-item"><MapPin size={13} /> {f.location}</span>}
                    {f?.hourlyRate > 0 && (
                      <span className="meta-item"><IndianRupee size={13} /> {f.hourlyRate.toLocaleString()}/hr</span>
                    )}
                  </div>

                  {f?.skills?.length > 0 && (
                    <div className="freelancer-skills" style={{ marginTop: '8px' }}>
                      {f.skills.slice(0, 3).map((s) => (
                        <span key={s} className="skill-tag">{s}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Proposal */}
                <div className="proposal-section">
                  <div className="proposal-meta">
                    <span className="proposal-rate">
                      💰 Proposed: <strong>₹{app.proposedRate?.toLocaleString()}</strong>
                    </span>
                    {app.estimatedDuration && (
                      <span className="proposal-duration">⏱ {app.estimatedDuration}</span>
                    )}
                  </div>
                  <p className="cover-letter">"{app.coverLetter}"</p>
                </div>

                {/* Status Control */}
                <div className="applicant-footer">
                  <span className={`status-badge ${statusColors[app.status]}`}>
                    {app.status}
                  </span>
                  <select
                    value={app.status}
                    disabled={updating === app._id}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className="status-select"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  {f?.username && (
                    <Link to={`/freelancers/${f.username}`} className="btn btn-outline btn-sm">
                      View Profile
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applicants;
