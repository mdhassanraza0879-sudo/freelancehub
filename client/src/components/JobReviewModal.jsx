import { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  IndianRupee,
  Briefcase,
  FileText,
  ShieldCheck,
  ArrowRight,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const JobReviewModal = ({ isOpen, onClose, job, onSubmitApplication }) => {
  const [reviewed, setReviewed] = useState(false);
  const [proposedRate, setProposedRate] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewed) {
      return toast.error('Please confirm that you have reviewed the job requirements.');
    }

    setSubmitting(true);
    try {
      await onSubmitApplication({
        jobId: job._id,
        proposedRate: proposedRate ? Number(proposedRate) : job.budgetMin || 10000,
        coverLetter: coverLetter || 'Reviewed full job specifications and deliverables.',
      });
      onClose();
    } catch (err) {
      toast.error('Failed to submit application. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="job-review-modal-overlay">
      <div className="job-review-modal-card animate-fade-in-up">
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="modal-category-tag">📋 Required Job Review</span>
            <h2 className="modal-job-title">{job.title}</h2>
            <div className="modal-company-meta">
              <span><Building2 size={14} className="inline mr-1 text-indigo-400" /> {job.company || job.client?.companyName || job.client?.name || 'Verified Hiring Enterprise'}</span>
              <span><MapPin size={14} className="inline mr-1 text-emerald-400" /> {job.location || 'Pan-India Work from Home (WFH)'}</span>
              <span><IndianRupee size={14} className="inline mr-1 text-amber-400" /> ₹{job.budgetMin?.toLocaleString() || '15,000'} - ₹{job.budgetMax?.toLocaleString() || '45,000'}</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Deliverables & Requirements Checklist */}
          <div className="modal-section-box">
            <h4>📌 Exact Job Requirements & Scope:</h4>
            <p className="modal-desc-text">
              {job.description || 'Deliver clean, modular code/assets according to client specs with high performance and zero security flaws.'}
            </p>

            <div className="deliverables-checklist">
              <h5>✅ What You Need To Deliver:</h5>
              <ul>
                <li>Complete all required project deliverables specified by the hiring client.</li>
                <li>Ensure Pan-India WFH accessibility and adhere to agreed deadlines.</li>
                <li>Submit daily sprint updates and code/asset revisions.</li>
                <li>Maintain 100% strict user data privacy and non-disclosure standards.</li>
              </ul>
            </div>
          </div>

          {/* Required Skills */}
          {job.skillsRequired?.length > 0 && (
            <div className="modal-section-box">
              <h4>🛠 Required Tech & Professional Skills:</h4>
              <div className="modal-skills-flex">
                {job.skillsRequired.map((skill) => (
                  <span key={skill} className="modal-skill-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Review Confirmation Form */}
          <form onSubmit={handleSubmit} className="modal-review-form">
            <div className="form-group">
              <label>Your Proposed Bid Rate (₹)</label>
              <input
                type="number"
                placeholder={`Default: ₹${(job.budgetMin || 15000).toLocaleString()}`}
                value={proposedRate}
                onChange={(e) => setProposedRate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Cover Note / Relevant Experience (Optional)</label>
              <textarea
                rows={3}
                placeholder="Briefly explain why you are the best fit for this WFH role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            {/* Mandatory Review Checkbox */}
            <div className="mandatory-review-checkbox" onClick={() => setReviewed(!reviewed)}>
              <input
                type="checkbox"
                checked={reviewed}
                onChange={() => {}}
              />
              <span className="checkbox-text">
                I have read and reviewed the complete job requirements, deliverables, and Pan-India WFH terms.
              </span>
            </div>

            {/* Actions */}
            <div className="modal-actions-row">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>

              <button
                type="submit"
                disabled={!reviewed || submitting}
                className={`btn btn-primary btn-glow ${!reviewed ? 'btn-disabled' : ''}`}
              >
                {submitting ? (
                  <span className="flex-center gap-1">
                    <Loader2 size={16} className="spin" /> Submitting...
                  </span>
                ) : (
                  <span className="flex-center gap-1">
                    Submit Reviewed Application <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobReviewModal;
