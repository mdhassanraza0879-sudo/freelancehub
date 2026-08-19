import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboard, getMyApplications, getMyJobPostings } from '../utils/api';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Eye,
  Star,
  Plus,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Zap,
  DollarSign,
  ArrowUpRight,
  UserCheck,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const statusIcon = {
  pending: <Clock size={14} className="text-amber-500" />,
  shortlisted: <Star size={14} className="text-indigo-400" />,
  accepted: <CheckCircle size={14} className="text-emerald-500" />,
  rejected: <XCircle size={14} className="text-rose-500" />,
};

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes] = await Promise.all([getDashboard()]);
        setProfile(profileRes.data.data);

        if (user?.role === 'freelancer') {
          const appRes = await getMyApplications();
          setApplications(appRes.data.data || []);
        } else if (user?.role === 'client') {
          const jobsRes = await getMyJobPostings();
          setMyJobs(jobsRes.data.data || []);
        }
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="pro-dashboard-loading">
        <div className="pro-spinner">
          <Loader2 size={44} className="spin text-indigo-500" />
        </div>
        <p className="loading-text">Loading your command center...</p>
      </div>
    );
  }

  const filteredApps =
    activeFilter === 'all'
      ? applications
      : applications.filter((a) => a.status === activeFilter);

  const acceptedCount = applications.filter((a) => a.status === 'accepted').length;
  const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length;
  const activeJobsCount = myJobs.filter((j) => j.status === 'open').length;
  const totalApplicants = myJobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0);

  return (
    <div className="pro-dashboard-wrapper">
      <div className="page-container">
        {/* Top Executive Header Banner */}
        <div className="pro-hero-banner animate-fade-in-up">
          <div className="pro-banner-glow"></div>

          <div className="pro-banner-left">
            <div className="pro-avatar-ring">
              {profile?.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={profile.name}
                  className="pro-avatar-img"
                />
              ) : (
                <div className="pro-avatar-fallback">
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              {profile?.isVerified && (
                <div className="pro-verified-badge" title="Verified Account">
                  <ShieldCheck size={14} color="#fff" />
                </div>
              )}
            </div>

            <div className="pro-user-meta">
              <div className="pro-name-row">
                <h1 className="pro-user-name">{profile?.name}</h1>
                <span className="pro-role-tag">
                  {user?.role === 'freelancer' ? '💼 Freelancer Pro' : '🏢 Enterprise Client'}
                </span>
                {profile?.isPremium && (
                  <span className="pro-premium-tag">
                    <Sparkles size={12} className="inline mr-1" /> Premium 💎
                  </span>
                )}
              </div>
              <p className="pro-user-subtitle">
                {user?.role === 'freelancer'
                  ? profile?.title || 'Senior Full Stack & Design Specialist'
                  : profile?.companyName || 'Verified Project Hirer'}
              </p>
              {user?.role === 'freelancer' && profile?.hourlyRate && (
                <div className="pro-rate-badge">
                  <span>₹{profile.hourlyRate.toLocaleString()} / hour</span>
                </div>
              )}
            </div>
          </div>

          <div className="pro-banner-actions">
            <Link to="/edit-profile" className="pro-btn-secondary">
              ✏️ Edit Profile
            </Link>
            {user?.role === 'freelancer' ? (
              <Link
                to={`/freelancers/${profile?.username}`}
                className="pro-btn-primary"
              >
                👁 Public Portfolio <ArrowUpRight size={16} />
              </Link>
            ) : (
              <Link to="/post-job" className="pro-btn-primary">
                <Plus size={16} /> Post a New Job
              </Link>
            )}
          </div>
        </div>

        {/* Quick Launchpad Action Bar */}
        <div className="pro-launchpad-bar animate-fade-in-up">
          <div className="launchpad-item">
            <Zap size={18} className="text-indigo-400" />
            <span>Quick Actions:</span>
          </div>
          <Link to="/jobs" className="launchpad-link">
            🔍 Browse 200+ Jobs
          </Link>
          <Link to="/freelancers" className="launchpad-link">
            👥 Top Freelancers
          </Link>
          <Link to="/pricing" className="launchpad-link launchpad-link--gold">
            💎 Go Premium (From ₹199)
          </Link>
        </div>

        {/* High-Performance KPI Metric Cards */}
        <div className="pro-kpi-grid animate-fade-in-up">
          {user?.role === 'freelancer' ? (
            <>
              <div className="pro-kpi-card">
                <div className="kpi-header">
                  <span className="kpi-title">Applications Sent</span>
                  <div className="kpi-icon-box bg-indigo-500/10 text-indigo-400">
                    <FileText size={20} />
                  </div>
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-main-val">{applications.length}</span>
                  <span className="kpi-trend positive">
                    <TrendingUp size={12} className="inline mr-1" /> Active
                  </span>
                </div>
                <span className="kpi-subtext">Total job proposals submitted</span>
              </div>

              <div className="pro-kpi-card">
                <div className="kpi-header">
                  <span className="kpi-title">Hired / Accepted</span>
                  <div className="kpi-icon-box bg-emerald-500/10 text-emerald-400">
                    <CheckCircle size={20} />
                  </div>
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-main-val text-emerald-400">{acceptedCount}</span>
                  <span className="kpi-badge emerald-badge">
                    {shortlistedCount} Shortlisted
                  </span>
                </div>
                <span className="kpi-subtext">Verified contracts won</span>
              </div>

              <div className="pro-kpi-card">
                <div className="kpi-header">
                  <span className="kpi-title">Profile Views</span>
                  <div className="kpi-icon-box bg-blue-500/10 text-blue-400">
                    <Eye size={20} />
                  </div>
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-main-val">{profile?.profileViews || 0}</span>
                  <span className="kpi-trend positive">+24% this week</span>
                </div>
                <span className="kpi-subtext">Client discovery impressions</span>
              </div>

              <div className="pro-kpi-card">
                <div className="kpi-header">
                  <span className="kpi-title">Client Rating</span>
                  <div className="kpi-icon-box bg-amber-500/10 text-amber-400">
                    <Star size={20} />
                  </div>
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-main-val text-amber-400">
                    {profile?.rating > 0 ? `${profile.rating.toFixed(1)} ★` : '5.0 ★'}
                  </span>
                  <span className="kpi-badge gold-badge">Top Rated</span>
                </div>
                <span className="kpi-subtext">Based on client feedback</span>
              </div>
            </>
          ) : (
            <>
              <div className="pro-kpi-card">
                <div className="kpi-header">
                  <span className="kpi-title">Total Jobs Posted</span>
                  <div className="kpi-icon-box bg-indigo-500/10 text-indigo-400">
                    <Briefcase size={20} />
                  </div>
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-main-val">{myJobs.length}</span>
                  <span className="kpi-trend positive">Active</span>
                </div>
                <span className="kpi-subtext">Listings published on hub</span>
              </div>

              <div className="pro-kpi-card">
                <div className="kpi-header">
                  <span className="kpi-title">Open & Hiring</span>
                  <div className="kpi-icon-box bg-emerald-500/10 text-emerald-400">
                    <CheckCircle size={20} />
                  </div>
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-main-val text-emerald-400">{activeJobsCount}</span>
                  <span className="kpi-badge emerald-badge">Accepting Proposals</span>
                </div>
                <span className="kpi-subtext">Actively reviewing talent</span>
              </div>

              <div className="pro-kpi-card">
                <div className="kpi-header">
                  <span className="kpi-title">Total Applicants</span>
                  <div className="kpi-icon-box bg-purple-500/10 text-purple-400">
                    <UserCheck size={20} />
                  </div>
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-main-val">{totalApplicants}</span>
                  <span className="kpi-trend positive">High Response</span>
                </div>
                <span className="kpi-subtext">Talent proposals received</span>
              </div>
            </>
          )}
        </div>

        {/* Main Section: Dynamic Content Table */}
        {user?.role === 'freelancer' ? (
          <div className="pro-content-panel animate-fade-in-up">
            <div className="pro-panel-header">
              <div className="panel-title-group">
                <h2 className="panel-title">My Submitted Proposals</h2>
                <span className="panel-count-badge">{applications.length} Total</span>
              </div>

              {/* Filter Pills */}
              <div className="pro-filter-pills">
                {['all', 'pending', 'shortlisted', 'accepted', 'rejected'].map((st) => (
                  <button
                    key={st}
                    className={`pro-filter-btn ${activeFilter === st ? 'active' : ''}`}
                    onClick={() => setActiveFilter(st)}
                  >
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {filteredApps.length === 0 ? (
              <div className="pro-empty-card">
                <div className="empty-icon-wrap">
                  <Layers size={36} className="text-slate-500" />
                </div>
                <h3 className="empty-title">No proposals in this view</h3>
                <p className="empty-desc">
                  Browse over 200+ active freelance jobs and apply today!
                </p>
                <Link to="/jobs" className="pro-btn-primary mt-4">
                  Browse 200+ Jobs <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="pro-table-list">
                {filteredApps.map((app) => (
                  <div key={app._id} className="pro-table-row">
                    <div className="row-main-info">
                      <Link to={`/jobs/${app.job?._id}`} className="row-job-title">
                        {app.job?.title}
                      </Link>
                      <div className="row-tags">
                        <span className="row-category-pill">{app.job?.category}</span>
                        <span className="row-location-pill">📍 {app.job?.location || 'Remote'}</span>
                      </div>
                    </div>

                    <div className="row-rate-box">
                      <span className="rate-label">Your Bid</span>
                      <span className="rate-amount">
                        ₹{app.proposedRate?.toLocaleString()}
                      </span>
                    </div>

                    <div className="row-status-box">
                      <span className={`pro-status-chip chip-${app.status}`}>
                        {statusIcon[app.status]} {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="pro-content-panel animate-fade-in-up">
            <div className="pro-panel-header">
              <div className="panel-title-group">
                <h2 className="panel-title">My Job Postings</h2>
                <span className="panel-count-badge">{myJobs.length} Listings</span>
              </div>
              <Link to="/post-job" className="pro-btn-primary">
                <Plus size={16} /> Post New Job
              </Link>
            </div>

            {myJobs.length === 0 ? (
              <div className="pro-empty-card">
                <div className="empty-icon-wrap">
                  <Briefcase size={36} className="text-slate-500" />
                </div>
                <h3 className="empty-title">No jobs posted yet</h3>
                <p className="empty-desc">
                  Create your first listing to start receiving proposals from top talent.
                </p>
                <Link to="/post-job" className="pro-btn-primary mt-4">
                  + Post a Job
                </Link>
              </div>
            ) : (
              <div className="pro-table-list">
                {myJobs.map((job) => (
                  <div key={job._id} className="pro-table-row">
                    <div className="row-main-info">
                      <Link to={`/jobs/${job._id}`} className="row-job-title">
                        {job.title}
                      </Link>
                      <div className="row-tags">
                        <span className="row-category-pill">{job.category}</span>
                        <span className="row-location-pill">📍 {job.location || 'Remote'}</span>
                        <span className="row-budget-pill">
                          ₹{job.budgetMin?.toLocaleString()} - ₹{job.budgetMax?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="row-applicants-box">
                      <span className="applicant-number">
                        👥 {job.applicationCount || 0}
                      </span>
                      <span className="applicant-label">Proposals</span>
                    </div>

                    <div className="row-actions-box">
                      <Link
                        to={`/jobs/${job._id}/applicants`}
                        className="pro-btn-secondary btn-sm"
                      >
                        Review Applicants
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
