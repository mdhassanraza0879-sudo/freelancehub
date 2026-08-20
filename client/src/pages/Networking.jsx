import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import {
  Share2,
  Copy,
  CheckCircle,
  MessageSquare,
  Users,
  TrendingUp,
  DollarSign,
  Send,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

const Networking = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const refUserId = searchParams.get('ref');

  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');
  const [messagesList, setMessagesList] = useState([
    {
      id: 1,
      sender: 'Arjun Verma',
      role: 'Full Stack Engineer',
      text: 'Hey! I saw your profile via your generated networking link. Let’s collaborate on a React + Node.js client project!',
      time: '10 mins ago',
      isMe: false
    },
    {
      id: 2,
      sender: 'Priya Sharma',
      role: 'UI/UX Designer',
      text: 'Thanks for sharing your mutual link! I have a client looking for a developer. Let’s split the referral fee 50/50.',
      time: '1 hour ago',
      isMe: false
    }
  ]);

  // Generate unique personal networking link
  const origin = window.location.origin;
  const personalLink = user
    ? `${origin}/connect?ref=${user._id || 'demo_user_123'}`
    : `${origin}/connect?ref=guest_demo`;

  const copyLink = () => {
    navigator.clipboard.writeText(personalLink);
    setCopied(true);
    toast.success('🎉 Custom Mutual Benefit Link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: user?.name || 'You',
      role: user?.role === 'client' ? 'Client' : 'Freelancer',
      text: message,
      time: 'Just now',
      isMe: true
    };

    setMessagesList((prev) => [...prev, newMsg]);
    setMessage('');
    toast.success('Message sent! Connections will be notified via email & dashboard.');
  };

  return (
    <div className="networking-page-wrapper">
      <div className="page-container">
        {/* Top Banner */}
        <div className="networking-hero-header animate-fade-in-up">
          <div className="hero-header-content">
            <div className="hero-badge">
              <Users size={16} className="inline mr-1 text-emerald-400" /> Mutual Benefit Networking Portal
            </div>
            <h1>Share Your Mutual Link & Earn Together</h1>
            <p>
              Generate your unique communication link. Share it with clients & freelancers to collaborate,
              communicate directly, and unlock shared project bonuses!
            </p>
          </div>
        </div>

        {/* Dynamic Ref Alert Banner (If opened via someone's ref link) */}
        {refUserId && (
          <div className="ref-connected-banner animate-slide-down">
            <div className="ref-info-left">
              <div className="ref-avatar">🔗</div>
              <div>
                <h4>You are connected via Mutual Link (Ref ID: {refUserId.slice(0, 8)}...)</h4>
                <p>Collaborate directly with this member to split client contracts and receive mutual referral rewards.</p>
              </div>
            </div>
            <span className="badge badge-green">Connected 🤝</span>
          </div>
        )}

        <div className="networking-grid animate-fade-in-up">
          {/* Left Column: Link Generator & Perks */}
          <div className="networking-left-panel">
            {/* Generated Link Generator Card */}
            <div className="link-generator-card">
              <div className="card-badge">⚡ Your Generated Link</div>
              <h3>Your Unique Communication Link</h3>
              <p className="card-desc">
                Anyone clicking this link can message you directly and start mutual revenue-sharing projects.
              </p>

              <div className="link-box">
                <input type="text" readOnly value={personalLink} />
                <button
                  onClick={copyLink}
                  className={`btn ${copied ? 'btn-success' : 'btn-primary'} btn-glow`}
                >
                  {copied ? (
                    <span className="flex-center gap-1">
                      <CheckCircle size={16} /> Copied!
                    </span>
                  ) : (
                    <span className="flex-center gap-1">
                      <Copy size={16} /> Copy Link
                    </span>
                  )}
                </button>
              </div>

              {/* Share Options */}
              <div className="share-buttons-row">
                <span className="share-label">Quick Share:</span>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Hey! Check out my FreelanceHub profile & let’s collaborate for mutual benefit: ' + personalLink)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="share-btn whatsapp-btn"
                >
                  💬 WhatsApp
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(personalLink)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="share-btn linkedin-btn"
                >
                  💼 LinkedIn
                </a>
              </div>
            </div>

            {/* Mutual Benefits Info Card */}
            <div className="mutual-benefits-card">
              <h3>🤝 How Mutual Networking Works:</h3>
              <div className="benefit-item">
                <div className="benefit-icon bg-indigo-500/20 text-indigo-400">1</div>
                <div>
                  <h4>Share Your Personal Link</h4>
                  <p>Send your generated link to potential clients, co-freelancers, or partners.</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon bg-emerald-500/20 text-emerald-400">2</div>
                <div>
                  <h4>Direct Communication Room</h4>
                  <p>Communicate instantly without third-party fees or middleman delays.</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon bg-amber-500/20 text-amber-400">3</div>
                <div>
                  <h4>Earn Shared Project Income</h4>
                  <p>Split client contracts or earn a 5-10% referral bonus on successfully referred jobs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Communication & Chat Room */}
          <div className="networking-right-panel">
            <div className="chat-room-card">
              <div className="chat-header">
                <div className="flex-center gap-2">
                  <MessageSquare size={20} className="text-indigo-400" />
                  <h3>Direct Collaboration Room</h3>
                </div>
                <span className="status-pill status-accepted">● Active Online</span>
              </div>

              {/* Messages Stream */}
              <div className="chat-messages-container">
                {messagesList.map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-bubble ${msg.isMe ? 'bubble-me' : 'bubble-other'}`}
                  >
                    <div className="bubble-header">
                      <span className="bubble-sender">{msg.sender}</span>
                      <span className="bubble-role">{msg.role}</span>
                      <span className="bubble-time">{msg.time}</span>
                    </div>
                    <p className="bubble-text">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Send Message Form */}
              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                  type="text"
                  placeholder="Type a proposal or collaboration message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-glow">
                  <Send size={16} /> Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Networking;
