import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createJob } from '../utils/api';
import toast from 'react-hot-toast';
import { Briefcase, IndianRupee, Tag, MapPin, Calendar } from 'lucide-react';

const CATEGORIES = [
  // Tech
  'Web Development','Mobile Development','Frontend Development','Backend Development',
  'Full Stack Development','Data Science & AI','Machine Learning','DevOps & Cloud',
  'Cybersecurity','Blockchain & Web3','Game Development','AR/VR Development',
  'Embedded Systems','QA & Testing','Database Administration','API Development','WordPress & CMS',
  // Design
  'UI/UX Design','Graphic Design','Logo & Branding','Motion Graphics','Video & Animation',
  '3D Modeling','Product Design','Illustration','Print Design','Presentation Design','NFT Art',
  // Writing
  'Content Writing','Copywriting','Technical Writing','Ghostwriting','Blog Writing',
  'SEO Writing','Translation','Proofreading & Editing','Scriptwriting','Resume Writing','Academic Writing',
  // Business
  'Virtual Assistant','Project Management','Business Analysis','Market Research',
  'Business Plan Writing','Legal Services','HR & Recruitment','Accounting & Finance','Data Entry',
  // Marketing
  'Digital Marketing','Social Media Marketing','SEO','Email Marketing','PPC & Ads',
  'Influencer Marketing','Affiliate Marketing','Content Marketing','Brand Strategy',
  // Media
  'Video Editing','Photography','Podcast Production','Voice Over','Music Production','Subtitles & Captions',
  // Education
  'Online Tutoring','Course Creation','Curriculum Design',
  // Engineering
  'Civil Engineering','Mechanical Engineering','Electrical Engineering','Architecture','CAD Design',
  // Lifestyle
  'Fitness & Nutrition','Life Coaching','Astrology & Wellness',
  // Other
  'E-commerce','Shopify','Customer Support','Other',
];

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    skillsRequired: '',
    budgetType: 'fixed',
    budgetMin: '',
    budgetMax: '',
    experienceLevel: 'intermediate',
    location: 'Remote',
    deadline: '',
  });
  const [loading, setLoading] = useState(false);

  if (user?.role !== 'client') {
    return (
      <div className="page-container">
        <div className="empty-state">
          <Briefcase size={48} />
          <h3>Clients Only</h3>
          <p>Only client accounts can post jobs.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.budgetMin) > Number(form.budgetMax)) {
      return toast.error('Minimum budget cannot exceed maximum budget');
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        skillsRequired: form.skillsRequired
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
      };
      const { data } = await createJob(payload);
      toast.success('Job posted successfully! 🎉');
      navigate(`/jobs/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container page-container--narrow">
      <div className="page-header">
        <h1>Post a New Job</h1>
        <p>Reach thousands of skilled freelancers across India</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="post-job-form">
          {/* Title */}
          <div className="form-group">
            <label>Job Title <span className="required">*</span></label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Build a React E-commerce Website"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>

          {/* Category */}
          <div className="form-row">
            <div className="form-group">
              <label>Category <span className="required">*</span></label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Experience Level</label>
              <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange}>
                <option value="entry">Entry Level</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Project Description <span className="required">*</span></label>
            <textarea
              name="description"
              rows={6}
              placeholder="Describe your project in detail — requirements, goals, what you expect..."
              value={form.description}
              onChange={handleChange}
              required
              maxLength={3000}
            />
            <span className="char-count">{form.description.length}/3000</span>
          </div>

          {/* Skills */}
          <div className="form-group">
            <label>
              <Tag size={14} /> Skills Required{' '}
              <span className="label-note">(comma-separated)</span>
            </label>
            <input
              type="text"
              name="skillsRequired"
              placeholder="React, Node.js, MongoDB, Tailwind CSS"
              value={form.skillsRequired}
              onChange={handleChange}
            />
          </div>

          {/* Budget */}
          <div className="form-section-label">
            <IndianRupee size={16} /> Budget
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Budget Type</label>
              <select name="budgetType" value={form.budgetType} onChange={handleChange}>
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>
            <div className="form-group">
              <label>Min Budget (₹) <span className="required">*</span></label>
              <input
                type="number"
                name="budgetMin"
                placeholder="5000"
                value={form.budgetMin}
                onChange={handleChange}
                min={0}
                required
              />
            </div>
            <div className="form-group">
              <label>Max Budget (₹) <span className="required">*</span></label>
              <input
                type="number"
                name="budgetMax"
                placeholder="25000"
                value={form.budgetMax}
                onChange={handleChange}
                min={0}
                required
              />
            </div>
          </div>

          {/* Location & Deadline */}
          <div className="form-row">
            <div className="form-group">
              <label><MapPin size={14} /> Location</label>
              <input
                type="text"
                name="location"
                placeholder="Remote / Mumbai / Delhi"
                value={form.location}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label><Calendar size={14} /> Deadline</label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-full btn-lg ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Posting...' : '🚀 Post Job — Free'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
