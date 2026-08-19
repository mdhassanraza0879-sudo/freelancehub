import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJob, applyToJob } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, IndianRupee, Clock, Briefcase, Users,
  CheckCircle, Loader2, Calendar, Star, ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    coverLetter: '',
    proposedRate: '',
    estimatedDuration: '',
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await getJob(id);
        setJob(data.data);
      } catch {
        toast.error('Job not found');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to apply');
      return navigate('/login');
    }
    if (user.role !== 'freelancer') {
      return toast.error('Only freelancers can apply to jobs');
    }
    setApplying(true);
    try {
      await applyToJob({
        jobId: id,
        coverLetter: form.coverLetter,
        proposedRate: Number(form.proposedRate),
        estimatedDuration: form.estimatedDuration,
      });
      setApplied(true);
      setShowForm(false);
      toast.success('Application submitted! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="loading-center"><Loader2 size={40} className="spin" /></div>
  );

  if (!job) return null;

  const {
    title, description, category, skillsRequired, budgetType,
    budgetMin, budgetMax, experienceLevel, location, deadline,
    status, applicationCount, isFeatured, createdAt, client,
  } = job;

  const postedAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="page-container job-detail-page">
      {/* Back */}
      <Link to="/jobs" className="back-link">
        <ArrowLeft size={16} /> Back to Jobs
      </Link>

      <div className="job-detail-layout">
        {/* ── Main Content ── */}
        <div className="job-detail-main">
          {/* Header */}
          <div className="job-detail-header">
            {isFeatured && <span className="featured-label">⭐ Featured</span>}
            <div className="job-detail-title-row">
              <h1>{title}</h1>
              <span className={`status-badge status-${status}`}>{status}</span>
            </div>
            <p className="job-detail-category">📁 {category}</p>

            <div className="job-detail-meta">
              <span><MapPin size={15} /> {location || 'Remote'}</span>
              <span><IndianRupee size={15} />
                {budgetMin.toLocaleString()} – {budgetMax.toLocaleString()}
                {budgetType === 'hourly' ? '/hr' : ' (Fixed)'}
              </span>
              <span><Briefcase size={15} /> {experienceLevel} level</span>
              <span><Clock size={15} /> Posted {postedAgo(createdAt)}</span>
              <span><Users size={15} /> {applicationCount} applicants</span>
              {deadline && (
                <span><Calendar size={15} /> Deadline: {new Date(deadline).toLocaleDateString('en-IN')}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="job-detail-section">
            <h2>Project Description</h2>
            <p className="job-description">{description}</p>
          </div>

          {/* Skills */}
          {skillsRequired?.length > 0 && (
            <div className="job-detail-section">
              <h2>Skills Required</h2>
              <div className="skills-list">
                {skillsRequired.map((skill) => (
                  <span key={skill} className="skill-tag skill-tag--lg">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Apply Form */}
          {status === 'open' && (
            <div className="job-detail-section">
              {applied ? (
                <div className="applied-success">
                  <CheckCircle size={24} color="#10b981" />
                  <div>
                    <h3>Application Submitted!</h3>
                    <p>The client will review your application and get back to you.</p>
                  </div>
                </div>
              ) : showForm ? (
                <div className="apply-form-card">
                  <h2>Submit Your Proposal</h2>
                  <form onSubmit={handleApply} className="apply-form">
                    <div className="form-group">
                      <label>Cover Letter <span className="required">*</span></label>
                      <textarea
                        rows={5}
                        placeholder="Tell the client why you're the best fit for this project..."
                        value={form.coverLetter}
                        onChange={(e) => setForm(p => ({ ...p, coverLetter: e.target.value }))}
                        required
                        maxLength={1500}
                      />
                      <span className="char-count">{form.coverLetter.length}/1500</span>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Your Proposed Rate (₹) <span className="required">*</span></label>
                        <input
                          type="number"
                          placeholder={budgetType === 'hourly' ? 'Per hour rate' : 'Total project cost'}
                          value={form.proposedRate}
                          onChange={(e) => setForm(p => ({ ...p, proposedRate: e.target.value }))}
                          required
                          min={0}
                        />
                      </div>
                      <div className="form-group">
                        <label>Estimated Duration</label>
                        <input
                          type="text"
                          placeholder="e.g. 2 weeks, 1 month"
                          value={form.estimatedDuration}
                          onChange={(e) => setForm(p => ({ ...p, estimatedDuration: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="apply-form-actions">
                      <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`btn btn-primary ${applying ? 'btn-loading' : ''}`}
                        disabled={applying}
                      >
                        {applying ? 'Submitting...' : '🚀 Submit Proposal'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="apply-cta">
                  {!user ? (
                    <>
                      <p>Login to apply for this job</p>
                      <Link to="/login" className="btn btn-primary btn-lg">Login to Apply</Link>
                    </>
                  ) : user.role === 'client' ? (
                    <p className="text-muted">You are logged in as a client. Switch to a freelancer account to apply.</p>
                  ) : (
                    <button className="btn btn-primary btn-lg" onClick={() => setShowForm(true)}>
                      Apply Now — It's Free
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="job-detail-sidebar">
          {/* Budget Card */}
          <div className="sidebar-card">
            <h3>💰 Budget</h3>
            <div className="budget-display">
              ₹{budgetMin.toLocaleString()} – ₹{budgetMax.toLocaleString()}
            </div>
            <p className="text-muted">{budgetType === 'hourly' ? 'Hourly Rate' : 'Fixed Price'}</p>
          </div>

          {/* Client Card */}
          {client && (
            <div className="sidebar-card">
              <h3>👤 About the Client</h3>
              <div className="client-info">
                <div className="avatar-placeholder avatar-lg">
                  {client.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong>{client.companyName || client.name}</strong>
                  {client.location && <p className="text-muted"><MapPin size={12} /> {client.location}</p>}
                  {client.rating > 0 && (
                    <p className="client-rating">
                      <Star size={13} fill="#f59e0b" color="#f59e0b" />
                      {client.rating.toFixed(1)} ({client.reviewCount} reviews)
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Job Stats */}
          <div className="sidebar-card">
            <h3>📊 Job Stats</h3>
            <div className="job-stats">
              <div className="job-stat-item">
                <span className="job-stat-label">Applications</span>
                <span className="job-stat-value">{applicationCount}</span>
              </div>
              <div className="job-stat-item">
                <span className="job-stat-label">Experience</span>
                <span className="job-stat-value" style={{ textTransform: 'capitalize' }}>{experienceLevel}</span>
              </div>
              <div className="job-stat-item">
                <span className="job-stat-label">Status</span>
                <span className="job-stat-value" style={{ textTransform: 'capitalize' }}>{status}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default JobDetail;
