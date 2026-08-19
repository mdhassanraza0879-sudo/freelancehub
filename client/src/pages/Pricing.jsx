import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Zap, Crown, Star, ArrowRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const FREELANCER_FEATURES = [
  '💎 Premium badge on profile',
  '⬆️ Top position in search results',
  '🔓 Unlimited job applications',
  '📊 Detailed profile analytics',
  '✅ Verified freelancer badge',
  '📧 Priority support',
];

const CLIENT_FEATURES = [
  '📌 Post unlimited jobs',
  '⭐ 1 Featured job listing included',
  '👥 See applicant contact info',
  '🔔 Instant applicant alerts',
  '📊 Job performance analytics',
  '✅ Priority support',
];

const FEATURED_FEATURES = [
  '🔝 Job appears at TOP of listings',
  '⭐ Featured star badge on card',
  '👀 3x more visibility',
  '📣 Promoted in search results',
  '⏰ Active for 30 days',
];

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const handlePayment = async (planId) => {
    if (!user) {
      toast.error('Please login first!');
      return navigate('/login');
    }

    setLoading(planId);
    try {
      // Create Razorpay order
      const { data } = await axios.post(
        'http://localhost:5000/api/payments/create-order',
        { planId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('fh_token')}` } }
      );

      const { order, plan, key } = data;

      // Open Razorpay checkout
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'FreelanceHub',
        description: plan.description,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              'http://localhost:5000/api/payments/verify',
              { ...response, planId },
              { headers: { Authorization: `Bearer ${localStorage.getItem('fh_token')}` } }
            );
            if (verifyRes.data.success) {
              toast.success('🎉 Payment successful! Premium activated!');
              navigate('/dashboard');
            }
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#6366f1' },
        modal: { ondismiss: () => setLoading(null) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="pricing-page">
      {/* Hero */}
      <div className="pricing-hero">
        <div className="hero-badge">💰 Simple, Transparent Pricing</div>
        <h1>Invest in Your Success</h1>
        <p>Join thousands of professionals growing their careers on FreelanceHub</p>
      </div>

      {/* Plans Grid */}
      <div className="pricing-grid">
        {/* Free Plan */}
        <div className="pricing-card">
          <div className="plan-icon">🌱</div>
          <h2 className="plan-name">Free</h2>
          <div className="plan-price">
            <span className="price-amount">₹0</span>
            <span className="price-period">forever</span>
          </div>
          <p className="plan-desc">Perfect to get started</p>
          <ul className="plan-features">
            <li><CheckCircle size={16} color="#10b981" /> Create profile</li>
            <li><CheckCircle size={16} color="#10b981" /> Browse all jobs</li>
            <li><CheckCircle size={16} color="#10b981" /> Apply to 5 jobs/month</li>
            <li><CheckCircle size={16} color="#10b981" /> Basic search</li>
          </ul>
          <button className="btn btn-outline btn-full" onClick={() => navigate('/register')}>
            Get Started Free
          </button>
        </div>

        {/* Freelancer Premium */}
        <div className="pricing-card pricing-card--popular">
          <div className="popular-badge">🔥 Most Popular</div>
          <div className="plan-icon">💎</div>
          <h2 className="plan-name">Freelancer Premium</h2>
          <div className="plan-price">
            <span className="price-amount">₹199</span>
            <span className="price-period">/month</span>
          </div>
          <p className="plan-desc">For serious freelancers</p>
          <ul className="plan-features">
            {FREELANCER_FEATURES.map((f) => (
              <li key={f}><CheckCircle size={16} color="#6366f1" /> {f}</li>
            ))}
          </ul>
          <button
            className={`btn btn-primary btn-full ${loading === 'freelancer_premium' ? 'btn-loading' : ''}`}
            onClick={() => handlePayment('freelancer_premium')}
            disabled={!!loading}
          >
            {loading === 'freelancer_premium' ? 'Processing...' : (
              <><Crown size={16} /> Get Premium — ₹199/mo</>
            )}
          </button>
        </div>

        {/* Client Pro */}
        <div className="pricing-card">
          <div className="plan-icon">🏢</div>
          <h2 className="plan-name">Client Pro</h2>
          <div className="plan-price">
            <span className="price-amount">₹499</span>
            <span className="price-period">/month</span>
          </div>
          <p className="plan-desc">For power hirers</p>
          <ul className="plan-features">
            {CLIENT_FEATURES.map((f) => (
              <li key={f}><CheckCircle size={16} color="#10b981" /> {f}</li>
            ))}
          </ul>
          <button
            className={`btn btn-primary btn-full ${loading === 'client_pro' ? 'btn-loading' : ''}`}
            onClick={() => handlePayment('client_pro')}
            disabled={!!loading}
          >
            {loading === 'client_pro' ? 'Processing...' : (
              <><Zap size={16} /> Get Client Pro — ₹499/mo</>
            )}
          </button>
        </div>
      </div>

      {/* Featured Job Add-on */}
      <div className="featured-addon">
        <div className="addon-content">
          <div className="addon-left">
            <Star size={32} color="#f59e0b" fill="#f59e0b" />
            <div>
              <h3>Featured Job Listing</h3>
              <p>Get 3x more applicants by featuring your job at the top of search results for 30 days</p>
              <ul className="plan-features" style={{ marginTop: '8px' }}>
                {FEATURED_FEATURES.map((f) => (
                  <li key={f} style={{ fontSize: '13px' }}><CheckCircle size={13} color="#f59e0b" /> {f}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="addon-right">
            <div className="addon-price">₹299<span>/listing</span></div>
            <button
              className={`btn btn-warning btn-lg ${loading === 'featured_job' ? 'btn-loading' : ''}`}
              onClick={() => handlePayment('featured_job')}
              disabled={!!loading}
            >
              {loading === 'featured_job' ? 'Processing...' : '⭐ Feature a Job'}
            </button>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="trust-section">
        <div className="trust-item"><Shield size={20} color="#6366f1" /> <span>100% Secure Payments via Razorpay</span></div>
        <div className="trust-item"><CheckCircle size={20} color="#10b981" /> <span>Cancel anytime</span></div>
        <div className="trust-item"><Star size={20} color="#f59e0b" fill="#f59e0b" /> <span>10,000+ happy users</span></div>
        <div className="trust-item"><ArrowRight size={20} color="#6366f1" /> <span>Instant activation</span></div>
      </div>

      {/* FAQ */}
      <div className="pricing-faq">
        <h2>❓ Frequently Asked Questions</h2>
        <div className="faq-grid">
          {[
            { q: 'Kya main cancel kar sakta hun?', a: 'Haan, aap kisi bhi waqt cancel kar sakte hain. 30 din baad automatically expire ho jaayega.' },
            { q: 'Payment safe hai?', a: 'Haan! Razorpay use karte hain jo India ka #1 payment gateway hai. UPI, Card, NetBanking sab accept hota hai.' },
            { q: 'Premium badge kab milega?', a: 'Payment ke immediately baad — same minute mein profile pe dikh jaayega.' },
            { q: 'Refund policy kya hai?', a: '7 din ke andar refund milega agar koi technical issue aaya. Support se contact karo.' },
          ].map((faq) => (
            <div key={faq.q} className="faq-item">
              <h4>{faq.q}</h4>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
