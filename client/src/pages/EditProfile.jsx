import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboard, updateProfile } from '../utils/api';
import toast from 'react-hot-toast';
import { User, MapPin, IndianRupee, Tag, Globe, Loader2, Plus, Trash2 } from 'lucide-react';

const SKILLS_SUGGESTIONS = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'MongoDB',
  'Figma', 'UI/UX Design', 'Flutter', 'Android', 'iOS', 'PHP',
  'WordPress', 'Shopify', 'SEO', 'Content Writing', 'Data Science',
];

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [form, setForm] = useState({
    name: '', username: '', title: '', bio: '',
    skills: [], hourlyRate: '', location: '',
    socialLinks: { github: '', linkedin: '', website: '' },
    companyName: '', companyWebsite: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getDashboard();
        const p = data.data;
        setForm({
          name: p.name || '',
          username: p.username || '',
          title: p.title || '',
          bio: p.bio || '',
          skills: p.skills || [],
          hourlyRate: p.hourlyRate || '',
          location: p.location || '',
          socialLinks: p.socialLinks || { github: '', linkedin: '', website: '' },
          companyName: p.companyName || '',
          companyWebsite: p.companyWebsite || '',
        });
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSocialChange = (e) =>
    setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, [e.target.name]: e.target.value } }));

  const addSkill = (skill) => {
    const s = skill.trim();
    if (s && !form.skills.includes(s)) {
      setForm((p) => ({ ...p, skills: [...p.skills, s] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill) =>
    setForm((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        ...form,
        hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : 0,
      });
      toast.success('Profile updated successfully! ✅');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="loading-center"><Loader2 size={40} className="spin" /></div>
  );

  return (
    <div className="page-container page-container--narrow">
      <div className="page-header">
        <h1>Edit Profile</h1>
        <p>Keep your profile updated to get hired faster</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Basic Info */}
          <div className="form-section-label"><User size={16} /> Basic Information</div>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name <span className="required">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="Rahul Sharma" />
            </div>
            {user?.role === 'freelancer' && (
              <div className="form-group">
                <label>Username</label>
                <input name="username" value={form.username} onChange={handleChange} placeholder="rahulsharma" />
                <small className="text-muted">freelancehub.com/freelancers/{form.username || 'yourname'}</small>
              </div>
            )}
          </div>

          {user?.role === 'freelancer' ? (
            <>
              <div className="form-group">
                <label>Professional Title</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Full Stack Developer | React Expert" />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea name="bio" rows={4} value={form.bio} onChange={handleChange}
                  placeholder="Tell clients about yourself, your experience, and what makes you unique..."
                  maxLength={1000}
                />
                <span className="char-count">{form.bio.length}/1000</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><MapPin size={13} /> Location</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="Mumbai, India" />
                </div>
                <div className="form-group">
                  <label><IndianRupee size={13} /> Hourly Rate (₹)</label>
                  <input type="number" name="hourlyRate" value={form.hourlyRate} onChange={handleChange} placeholder="500" min={0} />
                </div>
              </div>

              {/* Skills */}
              <div className="form-group">
                <label><Tag size={13} /> Skills</label>
                <div className="skills-input-row">
                  <input
                    type="text"
                    placeholder="Type a skill and press Enter..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); }
                    }}
                  />
                  <button type="button" className="btn btn-outline" onClick={() => addSkill(skillInput)}>
                    <Plus size={16} /> Add
                  </button>
                </div>
                {/* Quick add suggestions */}
                <div className="skill-suggestions">
                  {SKILLS_SUGGESTIONS.filter(s => !form.skills.includes(s)).slice(0, 8).map(s => (
                    <button key={s} type="button" className="suggestion-tag" onClick={() => addSkill(s)}>
                      + {s}
                    </button>
                  ))}
                </div>
                {/* Selected skills */}
                {form.skills.length > 0 && (
                  <div className="selected-skills">
                    {form.skills.map((skill) => (
                      <span key={skill} className="skill-tag skill-selected">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)}>
                          <Trash2 size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="form-section-label"><Globe size={16} /> Social Links</div>
              <div className="form-group">
                <label>GitHub Profile URL</label>
                <input name="github" value={form.socialLinks.github} onChange={handleSocialChange} placeholder="https://github.com/username" />
              </div>
              <div className="form-group">
                <label>LinkedIn Profile URL</label>
                <input name="linkedin" value={form.socialLinks.linkedin} onChange={handleSocialChange} placeholder="https://linkedin.com/in/username" />
              </div>
              <div className="form-group">
                <label>Personal Website</label>
                <input name="website" value={form.socialLinks.website} onChange={handleSocialChange} placeholder="https://yourwebsite.com" />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Company Name</label>
                <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Acme Solutions Pvt Ltd" />
              </div>
              <div className="form-group">
                <label>Company Website</label>
                <input name="companyWebsite" value={form.companyWebsite} onChange={handleChange} placeholder="https://yourcompany.com" />
              </div>
              <div className="form-group">
                <label><MapPin size={13} /> Location</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="Mumbai, India" />
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary btn-full ${saving ? 'btn-loading' : ''}`}
              disabled={saving}
            >
              {saving ? 'Saving...' : '✅ Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
