import React, { useState, useEffect, useRef } from 'react';

// Detect card type from number prefix
function detectCardType(number) {
  const n = (number || '').replace(/\s/g, '');
  if (/^4/.test(n)) return { type: 'Visa', color: '#1a1f71', icon: '𝐕' };
  if (/^5[1-5]/.test(n)) return { type: 'Mastercard', color: '#eb001b', icon: '𝐌' };
  if (/^3[47]/.test(n)) return { type: 'Amex', color: '#006fcf', icon: '𝐀' };
  if (/^6(?:011|5)/.test(n)) return { type: 'Discover', color: '#ff6000', icon: '𝐃' };
  if (/^(508[5-9]|6069|6521|6522)/.test(n)) return { type: 'RuPay', color: '#00af75', icon: '𝐑' };
  if (/^35/.test(n)) return { type: 'JCB', color: '#0e4c96', icon: '𝐉' };
  return { type: '', color: '#6b7280', icon: '💳' };
}

// Format card number with spaces
function formatCardNumber(value) {
  const v = value.replace(/\D/g, '').slice(0, 16);
  return v.replace(/(.{4})/g, '$1 ').trim();
}

// Format expiry as MM/YY
function formatExpiry(value) {
  const v = value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) return v.slice(0, 2) + '/' + v.slice(2);
  return v;
}

const STEPS = { FORM: 'form', PROCESSING: 'processing', SUCCESS: 'success' };

export default function PaymentModal({ isOpen, onClose, amount, onPaySuccess }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cvv, setCvv] = useState('');
  const [step, setStep] = useState(STEPS.FORM);
  const [error, setError] = useState('');
  const cardInputRef = useRef(null);

  const cardInfo = detectCardType(cardNumber);
  const rawNumber = cardNumber.replace(/\s/g, '');

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCardNumber('');
      setExpiry('');
      setCardHolder('');
      setCvv('');
      setStep(STEPS.FORM);
      setError('');
      setTimeout(() => cardInputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const validate = () => {
    if (rawNumber.length < 13) return 'Please enter a valid card number';
    if (expiry.length < 5) return 'Please enter a valid expiry date (MM/YY)';
    const [mm] = expiry.split('/');
    if (parseInt(mm) < 1 || parseInt(mm) > 12) return 'Invalid expiry month';
    if (!cardHolder.trim()) return 'Please enter the cardholder name';
    if (cvv.length < 3) return 'Please enter a valid CVV';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');

    setStep(STEPS.PROCESSING);

    // Simulate processing delay
    await new Promise(r => setTimeout(r, 2200));

    setStep(STEPS.SUCCESS);

    // Notify parent after a brief success display
    setTimeout(() => {
      onPaySuccess({
        cardNumber: rawNumber,
        cardExpiry: expiry,
        cardHolder: cardHolder.trim(),
        cardCvv: cvv,
        cardType: cardInfo.type || 'Card',
        cardLast4: rawNumber.slice(-4)
      });
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="payment-modal-overlay" onClick={step === STEPS.FORM ? onClose : undefined} />
      <div className="payment-modal">
        {/* Header */}
        <div className="payment-modal-header">
          <div className="payment-modal-brand">
            <div className="payment-modal-logo">G</div>
            <div>
              <div className="payment-modal-store-name">G Store</div>
              <div className="payment-modal-subtitle">Secure Checkout</div>
            </div>
          </div>
          <div className="payment-modal-amount">₹{(amount || 0).toLocaleString()}</div>
          {step === STEPS.FORM && (
            <button className="payment-modal-close" onClick={onClose}>✕</button>
          )}
        </div>

        {/* Step: Form */}
        {step === STEPS.FORM && (
          <form className="payment-modal-body" onSubmit={handleSubmit}>
            {error && <div className="payment-error">{error}</div>}

            {/* Card Number */}
            <div className="payment-field">
              <label className="payment-label">Card Number</label>
              <div className="payment-input-wrapper">
                <input
                  ref={cardInputRef}
                  type="text"
                  className="payment-input"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  autoComplete="cc-number"
                  id="payment-card-number"
                />
                {rawNumber.length > 0 && (
                  <div className="card-type-badge" style={{ background: cardInfo.color }}>
                    {cardInfo.type || 'Card'}
                  </div>
                )}
              </div>
            </div>

            {/* Expiry + CVV */}
            <div className="payment-row">
              <div className="payment-field">
                <label className="payment-label">Expiry</label>
                <input
                  type="text"
                  className="payment-input"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  autoComplete="cc-exp"
                  id="payment-expiry"
                />
              </div>
              <div className="payment-field">
                <label className="payment-label">CVV</label>
                <input
                  type="password"
                  className="payment-input"
                  placeholder="•••"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  autoComplete="cc-csc"
                  id="payment-cvv"
                />
              </div>
            </div>

            {/* Cardholder Name */}
            <div className="payment-field">
              <label className="payment-label">Name on Card</label>
              <input
                type="text"
                className="payment-input"
                placeholder="GAURANG AGARWAL"
                value={cardHolder}
                onChange={e => setCardHolder(e.target.value.toUpperCase())}
                autoComplete="cc-name"
                id="payment-card-name"
              />
            </div>

            {/* Pay Button */}
            <button type="submit" className="payment-submit-btn" id="payment-pay-btn">
              <span className="payment-lock-icon">🔒</span>
              Pay ₹{(amount || 0).toLocaleString()}
            </button>

            {/* Footer */}
            <div className="payment-footer">
              <div className="payment-secured">
                🛡️ Secured by <strong>G Store</strong> — Test Mode
              </div>
              <div className="payment-test-cards">
                <div className="payment-test-label">Test Cards:</div>
                <div className="payment-test-list">
                  <span><b>4242</b> 4242 4242 4242 — Visa</span>
                  <span><b>5555</b> 5555 5555 4444 — Mastercard</span>
                  <span><b>3782</b> 822463 10005 — Amex</span>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Step: Processing */}
        {step === STEPS.PROCESSING && (
          <div className="payment-modal-body payment-processing">
            <div className="payment-processing-spinner" />
            <div className="payment-processing-text">Processing Payment...</div>
            <div className="payment-processing-sub">
              Please do not close this window
            </div>
            <div className="payment-processing-details">
              <span>{cardInfo.type} •••• {rawNumber.slice(-4)}</span>
              <span>₹{(amount || 0).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === STEPS.SUCCESS && (
          <div className="payment-modal-body payment-success">
            <div className="payment-success-icon">✓</div>
            <div className="payment-success-text">Payment Successful!</div>
            <div className="payment-success-sub">
              {cardInfo.type} •••• {rawNumber.slice(-4)} — ₹{(amount || 0).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
