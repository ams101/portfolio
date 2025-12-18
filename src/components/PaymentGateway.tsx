import { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, QrCode } from 'lucide-react';

interface PaymentGatewayProps {
  paymentId: string;
  amount: number;
  onClose: () => void;
  onComplete: (status: 'SUCCESS' | 'FAIL') => void;
}

const PaymentGateway = ({ paymentId, amount, onClose, onComplete }: PaymentGatewayProps) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [bank, setBank] = useState('');

  const handlePayment = (status: 'SUCCESS' | 'FAIL') => {
    onComplete(status);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl border border-slate-800">
        <div className="bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">Payment Gateway</h3>
              <p className="text-xs text-slate-400">Ref: {paymentId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/50">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-1">Amount to Pay</p>
              <p className="text-3xl font-bold text-white">₹{amount.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6 border-b border-slate-700">
            {[
              { id: 'upi', label: 'UPI', icon: Smartphone },
              { id: 'card', label: 'Card', icon: CreditCard },
              { id: 'netbanking', label: 'Net Banking', icon: Building2 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'text-teal-400 border-b-2 border-teal-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mb-6">
            {activeTab === 'upi' && (
              <div className="space-y-4">
                <div className="bg-slate-800 rounded-xl p-6 flex flex-col items-center">
                  <div className="w-48 h-48 bg-white rounded-xl mb-4 flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-slate-800" />
                  </div>
                  <p className="text-slate-300 text-sm text-center">Scan QR code with any UPI app</p>
                  <p className="text-slate-500 text-xs mt-2">PhonePe • Google Pay • Paytm</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Or enter UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
                  />
                </div>
              </div>
            )}

            {activeTab === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Expiry</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">CVV</label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      maxLength={3}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'netbanking' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Select Bank</label>
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50"
                  >
                    <option value="">Choose your bank</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                  </select>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You will be redirected to your bank's secure login page to complete the payment.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-6">
            <p className="text-xs text-amber-300 text-center font-semibold">
              Demo Mode: Click success or fail to simulate payment
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handlePayment('SUCCESS')}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              Pay (Success)
            </button>
            <button
              onClick={() => handlePayment('FAIL')}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-3 rounded-xl transition-all border border-red-500/30"
            >
              Pay (Fail)
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-3 text-slate-400 hover:text-slate-300 font-semibold py-2 text-sm transition-colors"
          >
            Cancel Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
