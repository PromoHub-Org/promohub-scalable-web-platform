import React from 'react';
import TicketCard from '../components/TicketCard';
import { Heart, Sparkles, ArrowLeft } from 'lucide-react';

export default function InterestedDeals({ deals, onClaim, onViewDetail, onToggleInterest, onBackToAll }) {
  const interestedDeals = deals.filter(d => d.is_interested);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={28} color="var(--color-flame-coral)" fill="var(--color-flame-coral)" />
            <h1>My Saved / Interested Deals</h1>
          </div>
          <p className="text-muted" style={{ fontSize: '15px', marginTop: '4px' }}>
            Product vouchers you have indicated interest in for the upcoming D-Day Flash Sale event.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={onBackToAll}>
          <ArrowLeft size={16} /> Browse All Deals
        </button>
      </div>

      {interestedDeals.length > 0 ? (
        <div className="deals-grid">
          {interestedDeals.map(deal => (
            <TicketCard 
              key={deal.id}
              deal={deal}
              onClaim={onClaim}
              onViewDetail={onViewDetail}
              onToggleInterest={onToggleInterest}
            />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-2xl)',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius)',
          border: '2px dashed var(--color-ink-navy)'
        }}>
          <Heart size={48} color="var(--color-slate-grey)" style={{ marginBottom: '12px' }} />
          <h3>No Interested Deals Yet</h3>
          <p className="text-muted" style={{ maxWidth: '450px', margin: '8px auto 16px auto' }}>
            Browse the active deals feed and click the heart icon on any voucher to save your interest for D-Day!
          </p>
          <button className="btn btn-primary" onClick={onBackToAll}>
            <Sparkles size={18} /> Explore Flash Deals
          </button>
        </div>
      )}
    </div>
  );
}
