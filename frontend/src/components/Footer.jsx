import React from 'react';
import { Ticket, ShieldCheck, Sparkles, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Ticket size={24} color="var(--color-ticket-cream)" />
          <span className="brand-font" style={{ fontSize: '20px', color: 'var(--color-ticket-cream)' }}>PromoHub</span>
        </div>

        <p style={{ maxWidth: '500px' }}>
          The premier promotional deals & flash sale reservation platform. Claim exclusive brand discounts and voucher stubs in real time.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-sm)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ color: 'rgba(255, 248, 237, 0.9)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} color="var(--color-stamp-amber)" /> Official Brand Deals
          </span>

          <span style={{ color: 'rgba(255, 248, 237, 0.4)' }}>|</span>

          <span style={{ color: 'rgba(255, 248, 237, 0.9)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="var(--color-stock-green)" /> Guaranteed Instant Voucher Codes
          </span>

          <span style={{ color: 'rgba(255, 248, 237, 0.4)' }}>|</span>

          <span style={{ color: 'rgba(255, 248, 237, 0.9)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--color-flame-coral)" /> 100% Free Claiming
          </span>
        </div>

        <p style={{ marginTop: 'var(--space-md)', fontSize: '12px', opacity: 0.6 }}>
          © {new Date().getFullYear()} PromoHub. All rights reserved. Top brands and promotional discount codes.
        </p>
      </div>
    </footer>
  );
}
