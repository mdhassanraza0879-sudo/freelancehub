import { useEffect, useState } from 'react';
import { getSupportTickets, createSupportTicket, replySupportTicket } from '../utils/api';
import {
  Headphones,
  Plus,
  Send,
  Clock,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Zap,
  User,
  Bot
} from 'lucide-react';
import toast from 'react-hot-toast';

const SupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'Payment & Payouts',
    priority: 'medium',
    message: '',
  });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data } = await getSupportTickets();
      setTickets(data.data || []);
      if (data.data?.length > 0 && !activeTicket) {
        setActiveTicket(data.data[0]);
      }
    } catch {
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.message) {
      return toast.error('Subject and Message are required');
    }

    setCreating(true);
    try {
      const { data } = await createSupportTicket(newTicket);
      toast.success(data.message);
      setTickets((prev) => [data.data, ...prev]);
      setActiveTicket(data.data);
      setShowModal(false);
      setNewTicket({ subject: '', category: 'Payment & Payouts', priority: 'medium', message: '' });
    } catch (err) {
      toast.error('Failed to create support ticket.');
    } finally {
      setCreating(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    try {
      const { data } = await replySupportTicket(activeTicket._id, replyText);
      toast.success('Reply sent to support team!');
      setActiveTicket(data.data);
      setTickets((prev) => prev.map((t) => (t._id === data.data._id ? data.data : t)));
      setReplyText('');
    } catch {
      toast.error('Failed to send reply');
    }
  };

  return (
    <div className="support-page-wrapper">
      <div className="page-container">
        {/* Header */}
        <div className="support-hero-header animate-fade-in-up">
          <div className="hero-header-content">
            <div className="hero-badge">
              <Headphones size={16} className="inline mr-1 text-emerald-400" /> 24/7 Live Dedicated Customer Support
            </div>
            <h1>24/7 Support & Live Ticketing System</h1>
            <p>
              Direct 24/7 communication line with the FreelanceHub Admin & Technical Team for payments, WFH roles, and account security.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary btn-glow"
          >
            <Plus size={18} /> Open New Support Ticket
          </button>
        </div>

        {/* Content Layout */}
        {loading ? (
          <div className="pro-dashboard-loading">
            <Loader2 size={44} className="spin text-indigo-500" />
            <p>Connecting to 24/7 support server...</p>
          </div>
        ) : (
          <div className="support-content-grid animate-fade-in-up">
            {/* Left Column: Tickets List */}
            <div className="support-tickets-list-card">
              <div className="card-header-row">
                <h3>My Support Tickets</h3>
                <span className="badge badge-purple">{tickets.length} Total</span>
              </div>

              {tickets.length === 0 ? (
                <div className="empty-tickets">
                  <Headphones size={36} className="text-slate-500" />
                  <p>No active support tickets.</p>
                  <button onClick={() => setShowModal(true)} className="btn btn-outline btn-sm mt-2">
                    Create First Ticket
                  </button>
                </div>
              ) : (
                <div className="tickets-list">
                  {tickets.map((t) => (
                    <div
                      key={t._id}
                      onClick={() => setActiveTicket(t)}
                      className={`ticket-list-item ${activeTicket?._id === t._id ? 'item-active' : ''}`}
                    >
                      <div className="item-top">
                        <span className="ticket-id-tag">#{t.ticketId}</span>
                        <span className={`status-badge status-${t.status}`}>{t.status}</span>
                      </div>
                      <h4 className="ticket-subject">{t.subject}</h4>
                      <span className="ticket-category">{t.category}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Chat & Discussion Thread */}
            <div className="support-chat-thread-card">
              {activeTicket ? (
                <>
                  <div className="thread-header">
                    <div>
                      <div className="flex-center gap-2">
                        <span className="ticket-id-tag">#{activeTicket.ticketId}</span>
                        <span className={`status-badge status-${activeTicket.status}`}>{activeTicket.status}</span>
                      </div>
                      <h3 className="thread-title">{activeTicket.subject}</h3>
                      <span className="thread-cat">{activeTicket.category} • Priority: {activeTicket.priority}</span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="thread-messages">
                    {activeTicket.messages?.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`msg-bubble ${msg.senderRole === 'admin' ? 'msg-admin' : 'msg-user'}`}
                      >
                        <div className="msg-header">
                          <span className="msg-sender">
                            {msg.senderRole === 'admin' ? '🤖 24/7 Support Team' : msg.sender}
                          </span>
                          <span className="msg-time">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="msg-text">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleSendReply} className="thread-reply-form">
                    <input
                      type="text"
                      placeholder="Type a message to 24/7 support team..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary btn-glow">
                      <Send size={16} /> Send
                    </button>
                  </form>
                </>
              ) : (
                <div className="empty-thread">
                  <MessageSquare size={44} className="text-slate-500" />
                  <h3>Select a ticket to open conversation thread</h3>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showModal && (
        <div className="job-review-modal-overlay">
          <div className="job-review-modal-card animate-fade-in-up">
            <div className="modal-header">
              <h3>🎧 Create 24/7 Support Ticket</h3>
              <button onClick={() => setShowModal(false)} className="modal-close-btn">×</button>
            </div>

            <form onSubmit={handleCreateTicket} className="modal-review-form p-4">
              <div className="form-group">
                <label>Subject / Issue Title</label>
                <input
                  type="text"
                  placeholder="Brief title of your issue..."
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket((p) => ({ ...p, subject: e.target.value }))}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket((p) => ({ ...p, category: e.target.value }))}
                  >
                    <option value="Payment & Payouts">Payment & Payouts</option>
                    <option value="Job Application">Job Application</option>
                    <option value="Account & Privacy">Account & Privacy</option>
                    <option value="General Query">General Query</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority Level</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket((p) => ({ ...p, priority: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent 🔥</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Detailed Message</label>
                <textarea
                  rows={4}
                  placeholder="Explain your problem in detail so our 24/7 team can resolve it quickly..."
                  value={newTicket.message}
                  onChange={(e) => setNewTicket((p) => ({ ...p, message: e.target.value }))}
                  required
                />
              </div>

              <div className="modal-actions-row">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="btn btn-primary btn-glow">
                  {creating ? 'Submitting...' : 'Submit Support Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;
