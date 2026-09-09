import React from 'react';
import TicketCard from '../components/TicketCard';
import { ArrowLeft, Award } from 'lucide-react';

export default function DealDetail({ 
  deal, 
  onBack, 
  onClaim, 
  isSaved = false, 
  onToggleSaved 
}) {
  if (!deal) return null;

  const stockPercentage = Math.round((deal.stock_remaining / deal.total_stock) * 100);
  const isLowStock = deal.stock_remaining > 0 && deal.stock_remaining <= 5;
  const isSoldOut = deal.stock_remaining === 0;

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Back Button */}
      <button 
        className="btn btn-secondary"
        onClick={onBack}
        style={{ marginBottom: 'var(--space-lg)', padding: '8px 16px', fontSize: '14px' }}
      >
        <ArrowLeft size={16} /> Back to All Deals
      </button>

      {/* Header */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '13px',
            color: 'var(--color-stamp-amber)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            backgroundColor: 'rgba(186, 117, 23, 0.1)',
            padding: '4px 10px',
            borderRadius: '4px',
            border: '1px solid rgba(186, 117, 23, 0.3)'
          }}>
            {deal.brand}
          </span>
          <span style={{ fontSize: '14px', color: 'var(--color-slate-grey)' }}>• {deal.category || 'Flash Sale'}</span>
        </div>

        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{deal.title}</h1>
        <p className="text-muted" style={{ fontSize: '16px' }}>{deal.description}</p>
      </div>

      {/* Stock Progress Indicator Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid var(--color-ink-navy)',
        borderRadius: 'var(--radius)',
        padding: '16px 20px',
        marginBottom: 'var(--space-xl)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-ink-navy)' }}>
            STOCK AVAILABILITY PROGRESS
          </span>
          <span className="mono-number" style={{
            fontSize: '14px',
            fontWeight: '700',
            color: isSoldOut ? 'var(--color-slate-grey)' : isLowStock ? 'var(--color-flame-coral)' : 'var(--color-stock-green)'
          }}>
            {deal.stock_remaining} of {deal.total_stock} Units Remaining ({stockPercentage}%)
          </span>
        </div>

        {/* Progress Bar Container */}
        <div style={{
          width: '100%',
          height: '14px',
          backgroundColor: 'var(--color-ticket-cream)',
          borderRadius: '7px',
          border: '1px solid var(--color-ink-navy)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${stockPercentage}%`,
            height: '100%',
            backgroundColor: isSoldOut 
              ? 'var(--color-slate-grey)' 
              : isLowStock 
                ? 'var(--color-flame-coral)' 
                : 'var(--color-stock-green)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Prominent Ticket Stub Card */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <TicketCard 
          deal={deal}
          isSaved={isSaved}
          onClaim={() => onClaim(deal)}
          onViewDetail={() => {}}
          onToggleInterest={() => onToggleSaved && onToggleSaved(deal.id)}
        />
      </div>

      {/* Terms & Official Guarantee */}
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
              Verified promotional discount stub for official {deal.brand} products.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
