const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    employeeCount: {
      type: String,
      default: '50-200',
    },
    website: {
      type: String,
    },
    logo: {
      type: String,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    reviewsCount: {
      type: Number,
      default: 120,
    },
    openRolesCount: {
      type: Number,
      default: 5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
    openPositions: [
      {
        title: String,
        category: String,
        salary: String,
        type: { type: String, default: 'Full-time' },
        location: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
