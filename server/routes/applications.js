const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');

// ── POST /api/applications ─── Freelancer applies to a job ───────────────────
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'freelancer')
      return res.status(403).json({ success: false, message: 'Only freelancers can apply' });

    const { jobId, coverLetter, proposedRate, estimatedDuration } = req.body;

    const job = await Job.findById(jobId);
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.status !== 'open')
      return res.status(400).json({ success: false, message: 'Job is no longer open' });

    const existing = await Application.findOne({ job: jobId, freelancer: req.user._id });
    if (existing)
      return res.status(400).json({ success: false, message: 'You already applied to this job' });

    const application = await Application.create({
      job: jobId,
      freelancer: req.user._id,
      coverLetter,
      proposedRate,
      estimatedDuration,
    });

    // Increment application count on job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /api/applications/my ─── Freelancer: My applications ─────────────────
router.get('/my', protect, async (req, res) => {
  try {
    if (req.user.role !== 'freelancer')
      return res.status(403).json({ success: false, message: 'Access denied' });

    const applications = await Application.find({ freelancer: req.user._id })
      .populate('job', 'title category budgetMin budgetMax status client')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /api/applications/job/:jobId ─── Client: Applicants for a job ─────────
router.get('/job/:jobId', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.client.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const applications = await Application.find({ job: req.params.jobId })
      .populate('freelancer', 'name username title skills hourlyRate rating reviewCount profilePicture location')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── PUT /api/applications/:id/status ─── Client: Update application status ────
router.put('/:id/status', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');
    if (!application)
      return res.status(404).json({ success: false, message: 'Application not found' });

    if (application.job.client.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const { status } = req.body;
    if (!['pending', 'shortlisted', 'accepted', 'rejected'].includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });

    application.status = status;
    await application.save();

    res.json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
