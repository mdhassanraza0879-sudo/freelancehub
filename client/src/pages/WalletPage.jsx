import { useEffect, useState } from 'react';
import { getWallet, saveBankDetails, withdrawFunds } from '../utils/api';
import {
  Wallet,
  Building2,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Send,
  Loader2,
  CreditCard,
  History,
  Lock,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

const WalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [savingBank, setSavingBank] = useState(false);

  const [bankForm, setBankForm] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    upiId: '',
  });

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const { data } = await getWallet();
      setWallet(data.data);
      if (data.data?.bankDetails) {
        setBankForm({
          accountHolderName: data.data.bankDetails.accountHolderName || '',
          accountNumber: data.data.bankDetails.accountNumber || '',
          ifscCode: data.data.bankDetails.ifscCode || '',
          bankName: data.data.bankDetails.bankName || '',
          upiId: data.data.bankDetails.upiId || '',
        });
      }
    } catch {
      toast.error('Failed to load wallet information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleSaveBank = async (e) => {
    e.preventDefault();
    setSavingBank(true);
    try {
      const { data } = await saveBankDetails(bankForm);
      toast.success(data.message || 'Bank & UPI details linked securely!');
      setWallet(data.data);
    } catch {
      toast.error('Failed to save bank details.');
    } finally {
      setSavingBank(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      return toast.error('Please enter a valid withdrawal amount.');
    }

    setWithdrawing(true);
    try {
      const { data } = await withdrawFunds({ amount: withdrawAmount });
      toast.success(data.message);
      setWallet(data.data);
      setWithdrawAmount('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Withdrawal failed.');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="pro-dashboard-loading">
        <Loader2 size={44} className="spin text-indigo-500" />
        <p>Loading secure wallet & payout portal...</p>
      </div>
    );
  }

  return (
    <div className="wallet-page-wrapper">
      <div className="page-container">
        {/* Header */}
        <div className="wallet-hero-header animate-fade-in-up">
          <div className="hero-header-content">
            <div className="hero-badge">
              <ShieldCheck size={16} className="inline mr-1 text-emerald-400" /> 256-Bit Encrypted Wallet
            </div>
            <h1>Earnings Wallet & Direct Bank Payouts</h1>
            <p>
              Track your earnings, manage linked bank accounts / UPI IDs, and request instant direct-to-bank settlements.
            </p>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="wallet-cards-grid animate-fade-in-up">
          <div className="balance-card balance-card--primary">
            <span className="card-label">Available Balance</span>
            <div className="card-val">₹{wallet?.balance?.toLocaleString() || '0'}</div>
            <span className="card-sub text-emerald-400">● Ready for withdrawal</span>
          </div>

          <div className="balance-card">
            <span className="card-label">Pending Payouts</span>
            <div className="card-val text-amber-400">₹{wallet?.pendingPayouts?.toLocaleString() || '0'}</div>
            <span className="card-sub text-slate-400">Milestones in verification</span>
          </div>

          <div className="balance-card">
            <span className="card-label">Total Withdrawn</span>
            <div className="card-val text-indigo-400">₹{wallet?.totalWithdrawn?.toLocaleString() || '0'}</div>
            <span className="card-sub text-slate-400">Settled to your bank</span>
          </div>
        </div>

        <div className="wallet-content-grid animate-fade-in-up">
          {/* Left Column: Bank Account & Withdrawal Forms */}
          <div className="wallet-left-col">
            {/* Withdrawal Form Card */}
            <div className="wallet-action-card">
              <div className="card-header-row">
                <h3>💸 Request Bank Withdrawal</h3>
                <Lock size={16} className="text-emerald-400" />
              </div>

              <form onSubmit={handleWithdraw} className="wallet-form">
                <div className="form-group">
                  <label>Amount to Withdraw (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter amount (e.g. 5000)"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={withdrawing || wallet?.balance <= 0}
                  className="btn btn-primary btn-glow btn-full"
                >
                  {withdrawing ? (
                    <span className="flex-center gap-1">
                      <Loader2 size={16} className="spin" /> Processing Payout...
                    </span>
                  ) : (
                    <span className="flex-center gap-1">
                      Transfer Funds to Bank <ArrowUpRight size={16} />
                    </span>
                  )}
                </button>
              </form>
            </div>

            {/* Bank / UPI Account Linking Card */}
            <div className="wallet-action-card">
              <div className="card-header-row">
                <h3>🏦 Bank & UPI Payout Details</h3>
                <ShieldCheck size={16} className="text-indigo-400" />
              </div>

              <form onSubmit={handleSaveBank} className="wallet-form">
                <div className="form-group">
                  <label>Account Holder Name</label>
                  <input
                    type="text"
                    placeholder="As printed on bank account"
                    value={bankForm.accountHolderName}
                    onChange={(e) => setBankForm((p) => ({ ...p, accountHolderName: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Bank Account Number</label>
                    <input
                      type="text"
                      placeholder="9-18 digit account number"
                      value={bankForm.accountNumber}
                      onChange={(e) => setBankForm((p) => ({ ...p, accountNumber: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>IFSC Code</label>
                    <input
                      type="text"
                      placeholder="e.g. SBIN0001234"
                      value={bankForm.ifscCode}
                      onChange={(e) => setBankForm((p) => ({ ...p, ifscCode: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>UPI ID (For Instant Payouts)</label>
                  <input
                    type="text"
                    placeholder="username@upi / mobile@paytm"
                    value={bankForm.upiId}
                    onChange={(e) => setBankForm((p) => ({ ...p, upiId: e.target.value }))}
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingBank}
                  className="btn btn-secondary btn-full"
                >
                  {savingBank ? 'Saving Account Details...' : '🔒 Save Payout Details'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Transaction History */}
          <div className="wallet-right-col">
            <div className="transactions-card">
              <div className="card-header-row">
                <h3><History size={18} className="inline mr-1 text-indigo-400" /> Transaction History</h3>
                <span className="badge badge-purple">{wallet?.transactions?.length || 0} Records</span>
              </div>

              <div className="transactions-list">
                {wallet?.transactions?.length === 0 ? (
                  <div className="empty-txns">
                    <CreditCard size={32} className="text-slate-500" />
                    <p>No transaction history yet.</p>
                  </div>
                ) : (
                  wallet?.transactions?.map((txn) => (
                    <div key={txn.transactionId} className="transaction-item">
                      <div className="txn-left">
                        <div className={`txn-icon ${txn.type === 'credit' ? 'icon-credit' : 'icon-withdraw'}`}>
                          {txn.type === 'credit' ? '↓' : '↑'}
                        </div>
                        <div>
                          <span className="txn-desc">{txn.description}</span>
                          <span className="txn-id">{txn.transactionId}</span>
                        </div>
                      </div>

                      <div className="txn-right">
                        <span className={`txn-amount ${txn.type === 'credit' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                        </span>
                        <span className={`txn-status status-${txn.status}`}>{txn.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
