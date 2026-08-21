import React, { useState } from 'react';
import { Ticket, Copy, CheckCircle2, Clock, Sparkles, ExternalLink, Tag } from 'lucide-react';

export default function MyClaims({ userClaims = [], onExploreDeals }) {
  const [copiedCode, setCopiedCode] = useState(null);

  // Sample mock claims if user is logged in
  const displayClaims = userClaims.length > 0 ? userClaims : [
    {
      id: 'c1',
      claim_code: 'CLAIM-A9F2-K4B7',
      deal_title: 'Sony WH-1000XM5 Wireless Headphones',
      brand: 'Sony',
      price: 149.99,
      original_price: 399.99,
      claimed_at: '2026-08-20 18:42:10',
      status: 'ACTIVE'
    },
    {
      id: 'c2',
      claim_code: 'CLAIM-7X2P-M9L1',
      deal_title: 'Keychron Q1 Pro Wireless Mechanical Keyboard',
      brand: 'Keychron',
      price: 69.50,
      original_price: 199.00,
      claimed_at: '2026-08-19 14:15:33',
      status: 'ACTIVE'
    }
  ];

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const totalSaved = displayClaims.reduce((acc, c) => acc + (c.original_price - c.price), 0);

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Ticket size={32} color="var(--color-flame-coral)" />
            <h1>My Claimed Vouchers</h1>
          </div>
          <p className="text-muted" style={{ fontSize: '15px', marginTop: '4px' }}>
            Your personal ticket stub wallet and active voucher claim codes.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onExploreDeals}>
          <Sparkles size={18} /> Claim More Deals
        </button>
      </div>

      {/* KPI Stats Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          padding: '20px'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--color-slate-grey)', textTransform: 'uppercase', fontWeight: '700' }}>
            TOTAL VOUCHERS CLAIMED
          </span>
          <div className="mono-number" style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-ink-navy)', marginTop: '4px' }}>
            {displayClaims.length}
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          padding: '20px'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--color-slate-grey)', textTransform: 'uppercase', fontWeight: '700' }}>
            ACTIVE UNREDEEMED CODES
          </span>
          <div className="mono-number text-green" style={{ fontSize: '32px', fontWeight: '700', marginTop: '4px' }}>
            {displayClaims.filter(c => c.status === 'ACTIVE').length}
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          padding: '20px'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--color-slate-grey)', textTransform: 'uppercase', fontWeight: '700' }}>
            TOTAL ESTIMATED SAVINGS
          </span>
          <div className="mono-number text-coral" style={{ fontSize: '32px', fontWeight: '700', marginTop: '4px' }}>
            ${totalSaved.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Claimed Vouchers List */}
      {displayClaims.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {displayClaims.map(claim => (
            <div 
              key={claim.id}
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid var(--color-ink-navy)',
                borderRadius: 'var(--radius)',
                padding: 'var(--space-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-md)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '12px',
                    color: 'var(--color-stamp-amber)',
                    textTransform: 'uppercase',
                    backgroundColor: 'rgba(186, 117, 23, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {claim.brand}
                  </span>
                  <span className="badge badge-in-stock">ACTIVE VOUCHER</span>
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{claim.deal_title}</h3>
                <span style={{ fontSize: '13px', color: 'var(--color-slate-grey)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> Claimed on: {claim.claimed_at}
                </span>
              </div>

              {/* Ticket Voucher Code & Copy Action */}
              <div style={{
                backgroundColor: 'var(--color-ticket-cream)',
                border: '2px dashed var(--color-ink-navy)',
                borderRadius: 'var(--radius)',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--color-slate-grey)', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>
                    CLAIM TICKET CODE
                  </span>
                  <span className="mono-number" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-flame-coral)' }}>
                    {claim.claim_code}
                  </span>
                </div>

                <button 
                  className="btn btn-secondary"
                  onClick={() => handleCopyCode(claim.claim_code)}
                  style={{ padding: '8px 12px', fontSize: '12px' }}
                  title="Copy Voucher Code"
                >
                  <Copy size={14} />
                  {copiedCode === claim.claim_code ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>
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
          <Ticket size={48} color="var(--color-slate-grey)" style={{ marginBottom: '12px' }} />
          <h3>No Claimed Vouchers Yet</h3>
          <p className="text-muted" style={{ maxWidth: '400px', margin: '8px auto 16px auto' }}>
            Browse live flash deals and claim exclusive discount codes!
          </p>
          <button className="btn btn-primary" onClick={onExploreDeals}>
            Browse Active Deals
          </button>
        </div>
      )}
    </div>
  );
}
