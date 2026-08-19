const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['freelancer', 'client'],
      required: [true, 'Role is required'],
    },

    // ── Freelancer-specific Fields ──────────────────────────────────────────
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    title: { type: String, maxlength: 100 },        // e.g. "Full Stack Developer"
    bio: { type: String, maxlength: 1000 },
    skills: [{ type: String }],
    hourlyRate: { type: Number, min: 0 },
    location: { type: String },
    profilePicture: { type: String },
    portfolioItems: [
      {
        title: String,
        description: String,
        link: String,
        image: String,
      },
    ],
    socialLinks: {
      github: String,
      linkedin: String,
      website: String,
    },

    // ── Client-specific Fields ──────────────────────────────────────────────
    companyName: { type: String },
    companyWebsite: { type: String },

    // ── Common ──────────────────────────────────────────────────────────────
    isPremium: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
