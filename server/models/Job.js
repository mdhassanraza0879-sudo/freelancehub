const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skillsRequired: [{ type: String }],
    category: {
      type: String,
      enum: [
        // Tech
        'Web Development', 'Mobile Development', 'Frontend Development',
        'Backend Development', 'Full Stack Development', 'Data Science & AI',
        'Machine Learning', 'DevOps & Cloud', 'Cybersecurity', 'Blockchain & Web3',
        'Game Development', 'AR/VR Development', 'Embedded Systems', 'QA & Testing',
        'Database Administration', 'API Development', 'WordPress & CMS',
        // Design
        'UI/UX Design', 'Graphic Design', 'Logo & Branding', 'Motion Graphics',
        'Video & Animation', '3D Modeling', 'Product Design', 'Illustration',
        'Print Design', 'Presentation Design', 'NFT Art',
        // Writing & Language
        'Content Writing', 'Copywriting', 'Technical Writing', 'Ghostwriting',
        'Blog Writing', 'SEO Writing', 'Translation', 'Proofreading & Editing',
        'Scriptwriting', 'Resume Writing', 'Academic Writing',
        // Business
        'Virtual Assistant', 'Project Management', 'Business Analysis',
        'Market Research', 'Business Plan Writing', 'Legal Services',
        'HR & Recruitment', 'Accounting & Finance', 'Data Entry',
        // Marketing
        'Digital Marketing', 'Social Media Marketing', 'SEO', 'Email Marketing',
        'PPC & Ads', 'Influencer Marketing', 'Affiliate Marketing',
        'Content Marketing', 'Brand Strategy',
        // Media & Entertainment
        'Video Editing', 'Photography', 'Podcast Production', 'Voice Over',
        'Music Production', 'Subtitles & Captions',
        // Education
        'Online Tutoring', 'Course Creation', 'Curriculum Design',
        // Engineering
        'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering',
        'Architecture', 'CAD Design',
        // Lifestyle
        'Fitness & Nutrition', 'Life Coaching', 'Astrology & Wellness',
        // Other
        'E-commerce', 'Shopify', 'Customer Support', 'Other',
      ],
      required: [true, 'Category is required'],
    },
    budgetType: {
      type: String,
      enum: ['fixed', 'hourly'],
      default: 'fixed',
    },
    budgetMin: { type: Number, required: true, min: 0 },
    budgetMax: { type: Number, required: true, min: 0 },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed', 'closed'],
      default: 'open',
    },
    isFeatured: { type: Boolean, default: false },    // Paid feature
    applicationCount: { type: Number, default: 0 },
    location: { type: String, default: 'Remote' },
    experienceLevel: {
      type: String,
      enum: ['entry', 'intermediate', 'expert'],
      default: 'intermediate',
    },
  },
  { timestamps: true }
);

// Index for fast searching
jobSchema.index({ title: 'text', description: 'text', skillsRequired: 'text' });

module.exports = mongoose.model('Job', jobSchema);
