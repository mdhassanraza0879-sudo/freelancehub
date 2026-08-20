import { useEffect, useState } from 'react';
import { getCompanies, applyToCompany } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Search,
  MapPin,
  Users,
  Briefcase,
  Star,
  CheckCircle2,
  Bell,
  BellRing,
  ExternalLink,
  Loader2,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import JobReviewModal from '../components/JobReviewModal';

const INDUSTRIES = [
  'All',
  'Information Technology & Software',
  'FinTech & Digital Payments',
  'E-Commerce & Retail Tech',
  'Artificial Intelligence & ML',
  'Cloud Computing & DevOps',
  'Cybersecurity & Defense',
  'EdTech & Learning',
  'HealthTech & Pharmaceuticals',
  'Media, Gaming & Entertainment',
  'Logistics & Supply Chain',
  'Consulting & Financial Services'
];

const CompanyDirectory = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(1000);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [selectedJobForReview, setSelectedJobForReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCompaniesData = async () => {
    setLoading(true);
    try {
      const params = {
        search: search.trim() || undefined,
        industry: industry !== 'All' ? industry : undefined,
        page,
        limit: 18
      };
      const { data } = await getCompanies(params);
      setCompanies(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotalCount(data.pagination?.total || 1000);
    } catch {
      toast.error('Failed to load companies database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompaniesData();
  }, [search, industry, page]);

  const handleOpenReviewModal = (company) => {
    if (!user) {
      return toast.error('Please sign in to review & apply to companies');
    }
    setSelectedJobForReview({
      _id: company._id,
      title: `Senior Pan-India WFH Role at ${company.name}`,
      company: company.name,
      location: company.location || 'Pan-India Work from Home (WFH)',
      budgetMin: 18000,
      budgetMax: 50000,
      description: company.description || `${company.name} is hiring skilled professionals for Pan-India remote WFH roles. Deliver clean, modular work adhering to client specs.`,
      skillsRequired: ['React / Full Stack', 'Pan-India WFH', 'UI/UX Design', 'Communication']
    });
    setIsModalOpen(true);
  };

  const handleConfirmApplication = async (payload) => {
    try {
      const { data } = await applyToCompany(payload.jobId);
      toast.success(data.message || `Application submitted after requirements review! 🎉`);
    } catch (err) {
      toast.error('Failed to submit application');
    }
  };

  const toggleAlerts = () => {
    const nextState = !alertsEnabled;
    setAlertsEnabled(nextState);
    if (nextState) {
      toast.success('🔔 Job Alerts Enabled! You will receive daily matching role alerts.', {
        duration: 4000
      });
    } else {
      toast('Job Alerts paused', { icon: '🔕' });
    }
  };

  return (
    <div className="companies-page-wrapper">
      <div className="page-container">
        {/* Top Header Banner */}
        <div className="companies-hero-header animate-fade-in-up">
          <div className="hero-header-content">
            <div className="hero-badge">
              <Building2 size={16} className="inline mr-1 text-indigo-400" /> Database of 1,000 Real Companies
            </div>
            <h1>Search & Apply to 1,000 Top Companies</h1>
            <p>
              Direct applications to verified Indian & global tech giants (Google, Microsoft, TCS, Razorpay, Swiggy, Zomato, Flipkart, etc.).
            </p>
          </div>

          {/* Job Alerts Toggle Control */}
          <div className="job-alerts-toggle-box">
            <div className="alerts-info">
              <div className="alerts-icon-ring">
                {alertsEnabled ? (
                  <BellRing size={22} className="text-emerald-400 animate-bounce" />
                ) : (
                  <Bell size={22} className="text-amber-400" />
                )}
              </div>
              <div>
                <h4 className="alerts-title">Instant Job Alerts</h4>
                <p className="alerts-desc">
                  {alertsEnabled ? '🟢 Active — Getting 1,000 company alerts' : '🔴 Paused — Click to enable daily notifications'}
                </p>
              </div>
            </div>

            <button
              onClick={toggleAlerts}
              className={`btn ${alertsEnabled ? 'btn-success' : 'btn-primary'} btn-sm btn-glow`}
            >
              {alertsEnabled ? '✓ Alerts Active' : '🔔 Enable Job Alerts'}
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="companies-filter-bar animate-fade-in-up">
          <div className="search-input-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search 1,000 companies by name, skill, or keyword..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="industry-select-box">
            <Filter size={16} className="select-icon" />
            <select
              value={industry}
              onChange={(e) => {
                setIndustry(e.target.value);
                setPage(1);
              }}
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind === 'All' ? '🏢 All 1,000 Companies' : ind}
                </option>
              ))}
            </select>
          </div>

          <div className="results-counter">
            Showing <strong>{companies.length}</strong> of <strong>{totalCount}</strong> Companies
          </div>
        </div>

        {/* Companies Cards Grid */}
        {loading ? (
          <div className="companies-loading-box">
            <Loader2 size={44} className="spin text-indigo-500" />
            <p>Searching 1,000 company database...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="companies-empty-card">
            <Building2 size={48} className="text-slate-500" />
            <h3>No companies matching "{search}"</h3>
            <p>Try searching for Google, TCS, Infosys, Razorpay, or select All Industries.</p>
            <button
              onClick={() => {
                setSearch('');
                setIndustry('All');
              }}
              className="btn btn-outline btn-sm mt-3"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="companies-grid animate-fade-in-up">
            {companies.map((company) => (
              <div
                key={company._id}
                className={`company-card ${company.isFeatured ? 'company-card--featured' : ''}`}
              >
                {company.isFeatured && (
                  <span className="featured-company-tag">⭐ Top Employer</span>
                )}

                <div className="company-card-header">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="company-logo-img"
                  />
                  <div>
                    <h3 className="company-name">{company.name}</h3>
                    <span className="company-industry-tag">{company.industry}</span>
                  </div>
                </div>

                <p className="company-desc">{company.description}</p>

                <div className="company-meta-strip">
                  <span className="meta-pill">
                    <MapPin size={13} /> {company.location}
                  </span>
                  <span className="meta-pill">
                    <Users size={13} /> {company.employeeCount}
                  </span>
                  <span className="meta-pill rating-pill">
                    <Star size={13} className="text-amber-400 fill-amber-400" /> {company.rating} ({company.reviewsCount})
                  </span>
                </div>

                {/* Open Positions Listing */}
                {company.openPositions?.length > 0 && (
                  <div className="open-positions-box">
                    <div className="positions-header">
                      <Briefcase size={13} className="text-indigo-400" />
                      <span>{company.openPositions.length} Open Roles:</span>
                    </div>
                    <ul className="positions-list">
                      {company.openPositions.slice(0, 2).map((pos, idx) => (
                        <li key={idx} className="position-item">
                          <span className="pos-title">{pos.title}</span>
                          <span className="pos-salary">{pos.salary}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="company-card-footer">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="company-website-link"
                  >
                    Website <ExternalLink size={13} />
                  </a>

                  <button
                    onClick={() => handleOpenReviewModal(company)}
                    className="btn btn-primary btn-sm btn-glow"
                  >
                    <span>Review & Apply <ArrowRight size={14} className="inline ml-1" /></span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="companies-pagination-bar">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="btn btn-outline btn-sm"
            >
              Previous Page
            </button>

            <span className="page-number-display">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> (1,000 Total Companies)
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="btn btn-outline btn-sm"
            >
              Next Page
            </button>
          </div>
        )}
      </div>

      {/* Mandatory Job Requirements Review Modal */}
      <JobReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={selectedJobForReview}
        onSubmitApplication={handleConfirmApplication}
      />
    </div>
  );
};

export default CompanyDirectory;
