import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getJobs } from '../utils/api';
import JobCard from '../components/JobCard';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'All',
  // Tech
  'Web Development','Mobile Development','Frontend Development','Backend Development',
  'Full Stack Development','Data Science & AI','Machine Learning','DevOps & Cloud',
  'Cybersecurity','Blockchain & Web3','Game Development','QA & Testing','WordPress & CMS',
  // Design
  'UI/UX Design','Graphic Design','Logo & Branding','Motion Graphics','Video & Animation',
  '3D Modeling','Illustration','Presentation Design',
  // Writing
  'Content Writing','Copywriting','Technical Writing','Blog Writing','Translation','SEO Writing',
  // Business
  'Virtual Assistant','Project Management','Business Analysis','Accounting & Finance',
  'HR & Recruitment','Legal Services','Data Entry',
  // Marketing
  'Digital Marketing','Social Media Marketing','SEO','Email Marketing','PPC & Ads','Brand Strategy',
  // Media
  'Video Editing','Photography','Voice Over','Music Production','Podcast Production',
  // Education
  'Online Tutoring','Course Creation',
  // Engineering
  'Architecture','Civil Engineering','Mechanical Engineering','CAD Design',
  // Other
  'E-commerce','Shopify','Customer Support','Fitness & Nutrition','Other',
];

const JobBoard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    experienceLevel: '',
    budgetMin: '',
    budgetMax: '',
    page: 1,
  });

  useEffect(() => {
    fetchJobs();
  }, [filters.page, filters.category]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;
      if (filters.budgetMin) params.budgetMin = filters.budgetMin;
      if (filters.budgetMax) params.budgetMax = filters.budgetMax;
      params.page = filters.page;

      const { data } = await getJobs(params);
      setJobs(data.data);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((p) => ({ ...p, page: 1 }));
    fetchJobs();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Find Your Next Project</h1>
        <p>{pagination.total || 0} jobs available right now</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-bar">
        <div className="input-icon-wrapper search-input">
          <Search size={18} className="input-icon" />
          <input
            type="text"
            placeholder="Search jobs, skills, keywords..."
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
          />
        </div>
        <select
          value={filters.experienceLevel}
          onChange={(e) => setFilters((p) => ({ ...p, experienceLevel: e.target.value, page: 1 }))}
          className="filter-select"
        >
          <option value="">All Levels</option>
          <option value="entry">Entry</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
        <button type="submit" className="btn btn-primary">
          <Search size={16} /> Search
        </button>
      </form>

      {/* Category Tabs */}
      <div className="category-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${(filters.category || 'All') === cat ? 'active' : ''}`}
            onClick={() =>
              setFilters((p) => ({ ...p, category: cat === 'All' ? '' : cat, page: 1 }))
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="loading-center">
          <Loader2 size={40} className="spin" />
          <p>Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <SlidersHorizontal size={48} />
          <h3>No jobs found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`page-btn ${filters.page === p ? 'active' : ''}`}
                  onClick={() => setFilters((prev) => ({ ...prev, page: p }))}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobBoard;
