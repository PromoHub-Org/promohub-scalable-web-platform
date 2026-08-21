import React, { useState } from 'react';
import TicketCard from '../components/TicketCard';
import ClaimModal from '../components/ClaimModal';
import { ArrowLeft, ShieldCheck, Ticket, Award, CheckCircle } from 'lucide-react';

export default function DealDetail({ deal, onBack }) {
  const [selectedDealForClaim, setSelectedDealForClaim] = useState(null);
  const [currentDeal, setCurrentDeal] = useState(deal);

  if (!deal) return null;

  const handleClaimSuccess = (dealId) => {
    setCurrentDeal(prev => ({
      ...prev,
      stock_remaining: Math.max(0, prev.stock_remaining - 1)
    }));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button 
        className="btn btn-secondary"
        onClick={onBack}
        style={{ marginBottom: 'var(--space-lg)', padding: '8px 16px', fontSize: '14px' }}
      >
        <ArrowLeft size={16} /> Back to Deals
      </button>

      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <span style={{
          fontFamily: 'var(--font-headline)',
          fontSize: '14px',
          color: 'var(--color-stamp-amber)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          backgroundColor: 'rgba(186, 117, 23, 0.1)',
          padding: '4px 10px',
          borderRadius: '4px',
          border: '1px solid rgba(186, 117, 23, 0.3)',
          display: 'inline-block',
          marginBottom: '8px'
        }}>
          {currentDeal.brand}
        </span>
        <h1 style={{ marginBottom: '8px' }}>{currentDeal.title}</h1>
        <p className="text-muted" style={{ fontSize: '16px' }}>
          Category: <strong>{currentDeal.category || 'Flash Sale'}</strong>
        </p>
      </div>

      {/* Main Ticket Stub Card */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <TicketCard 
          deal={currentDeal}
          onClaim={(d) => setSelectedDealForClaim(d)}
          onViewDetail={() => {}}
        />
      </div>

      {/* Terms & Details Section */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid var(--color-ink-navy)',
        borderRadius: 'var(--radius)',
        padding: 'var(--space-xl)'
      }}>
        <h3 style={{ marginBottom: 'var(--space-md)', fontSize: '20px' }}>Voucher Redemption Terms</h3>
        
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: 'var(--color-ink-navy)', marginBottom: 'var(--space-lg)' }}>
          <li>Every claim generates an exclusive alphanumeric voucher code valid for online checkout.</li>
          <li>Indicate interest anytime before D-Day to save this deal to your personal wishlist.</li>
          <li>Voucher codes are 100% free to claim and redeem with participating merchant partners.</li>
          <li>Instant code generation upon clicking "CLAIM DEAL".</li>
        </ul>

        <div style={{
          backgroundColor: 'var(--color-ticket-cream)',
          border: '1px solid var(--color-stamp-amber)',
          borderRadius: 'var(--radius)',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Award size={28} color="var(--color-stamp-amber)" />
          <div>
            <strong style={{ display: 'block', fontSize: '14px' }}>Authentic Brand Voucher</strong>
            <span style={{ fontSize: '13px', color: 'var(--color-slate-grey)' }}>
              Verified promotional discount stub for official {currentDeal.brand} products.
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Claim Modal */}
      {selectedDealForClaim && (
        <ClaimModal 
          deal={selectedDealForClaim}
          onClose={() => setSelectedDealForClaim(null)}
          onConfirmClaim={handleClaimSuccess}
        />
      )}
    </div>
  );
}
