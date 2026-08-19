const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required'],
      maxlength: [1500, 'Cover letter cannot exceed 1500 characters'],
    },
    proposedRate: {
      type: Number,
      required: [true, 'Proposed rate is required'],
      min: 0,
    },
    estimatedDuration: {
      type: String,  // e.g. "2 weeks", "1 month"
    },
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// A freelancer can only apply once per job
applicationSchema.index({ job: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
