import React, { useState } from 'react';
import { X, Ticket, CheckCircle2, Copy, AlertCircle, Heart } from 'lucide-react';

export default function ClaimModal({ deal, onClose, onConfirmClaim }) {
  const [copied, setCopied] = useState(false);
  const [claimResult, setClaimResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClaim = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Simulate backend reservation & unique claim voucher code generation
      const randomCode = 'CLAIM-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      const result = {
        success: true,
        claimCode: randomCode,
        claimedAt: new Date().toLocaleTimeString(),
        dealTitle: deal.title,
        brand: deal.brand,
        price: deal.price
      };
      setClaimResult(result);
      setIsSubmitting(false);
      if (onConfirmClaim) {
        onConfirmClaim(deal.id);
      }
    }, 600);
  };

  const handleCopyCode = () => {
    if (claimResult?.claimCode) {
      navigator.clipboard.writeText(claimResult.claimCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!deal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(28, 37, 65, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'var(--space-md)'
    }}>
      <div style={{
        backgroundColor: 'var(--color-ticket-cream)',
        border: '3px solid var(--color-ink-navy)',
        borderRadius: 'var(--radius)',
        maxWidth: '520px',
        width: '100%',
        padding: 'var(--space-xl)',
        boxShadow: 'var(--shadow-md)',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-ink-navy)'
          }}
        >
          <X size={24} />
        </button>

        {!claimResult ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Ticket size={24} color="var(--color-flame-coral)" />
              <h2 style={{ fontSize: '22px' }}>Confirm Voucher Claim</h2>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              border: '2px dashed var(--color-ink-navy)',
              borderRadius: 'var(--radius)',
              padding: '16px',
              margin: '16px 0'
            }}>
              <span style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '12px',
                color: 'var(--color-stamp-amber)',
                textTransform: 'uppercase'
              }}>
                {deal.brand}
              </span>
              <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>{deal.title}</h3>
              <p style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--color-slate-grey)' }}>{deal.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono-number" style={{ fontSize: '22px', fontWeight: '700' }}>
                  ${deal.price.toFixed(2)}
                </span>
                <span className="mono-number text-green" style={{ fontSize: '14px' }}>
                  {deal.stock_remaining} vouchers remaining
                </span>
              </div>
            </div>

            <p style={{ fontSize: '14px', marginBottom: '20px', color: 'var(--color-slate-grey)' }}>
              Click below to claim your discount ticket stub. You will receive an instant unique voucher code to redeem at checkout.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleClaim}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Reserving...' : 'Confirm & Claim Code'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle2 size={48} color="var(--color-stock-green)" style={{ margin: '0 auto 12px auto' }} />
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Voucher Claimed!</h2>
            <p style={{ fontSize: '15px', color: 'var(--color-slate-grey)', marginBottom: '20px' }}>
              You have successfully reserved your code for <strong>{claimResult.brand} — {claimResult.dealTitle}</strong>.
            </p>

            {/* Ticket Voucher Visual Stub */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '2px solid var(--color-ink-navy)',
              borderRadius: 'var(--radius)',
              padding: '20px',
              margin: '16px 0'
            }}>
              <span style={{ fontSize: '12px', color: 'var(--color-slate-grey)', textTransform: 'uppercase', fontWeight: '700' }}>
                YOUR EXCLUSIVE CLAIM VOUCHER CODE
              </span>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '8px',
                marginBottom: '12px'
              }}>
                <span className="mono-number" style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: 'var(--color-flame-coral)',
                  letterSpacing: '1px',
                  backgroundColor: 'var(--color-ticket-cream)',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-ink-navy)'
                }}>
                  {claimResult.claimCode}
                </span>
                
                <button 
                  onClick={handleCopyCode}
                  title="Copy Voucher Code"
                  style={{
                    backgroundColor: 'var(--color-ink-navy)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px',
                    cursor: 'pointer'
                  }}
                >
                  <Copy size={18} />
                </button>
              </div>

              {copied && (
                <span style={{ fontSize: '12px', color: 'var(--color-stock-green)', fontWeight: '700' }}>
                  Code copied to clipboard!
                </span>
              )}
            </div>

            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', marginTop: '12px' }}>
              Done & Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
