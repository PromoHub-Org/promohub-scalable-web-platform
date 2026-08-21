import React from 'react';
import { Ticket, Flame, Heart, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
        <h1 style={{ marginBottom: '12px' }}>How PromoHub Flash Sales Work</h1>
        <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          Get ready for the biggest discount drop event. Here is how to prepare and secure your vouchers on D-Day!
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          padding: 'var(--space-xl)',
          display: 'flex',
          gap: 'var(--space-lg)',
          alignItems: 'flex-start'
        }}>
          <div style={{
            backgroundColor: 'var(--color-flame-coral)',
            color: '#ffffff',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-headline)',
            fontSize: '20px',
            flexShrink: 0
          }}>
            1
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Heart size={20} color="var(--color-flame-coral)" fill="var(--color-flame-coral)" />
              <h3 style={{ fontSize: '20px' }}>Indicate Interest Before D-Day</h3>
            </div>
            <p className="text-muted">
              Browse brand product vouchers (Sony, Apple, Keychron, Bose, Samsung & more). Click <strong>"Indicate Interest"</strong> on deals you want to build momentum and pre-save your target vouchers.
            </p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          padding: 'var(--space-xl)',
          display: 'flex',
          gap: 'var(--space-lg)',
          alignItems: 'flex-start'
        }}>
          <div style={{
            backgroundColor: 'var(--color-stamp-amber)',
            color: '#ffffff',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-headline)',
            fontSize: '20px',
            flexShrink: 0
          }}>
            2
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Flame size={20} color="var(--color-stamp-amber)" />
              <h3 style={{ fontSize: '20px' }}>Watch the D-Day Event Clock</h3>
            </div>
            <p className="text-muted">
              Keep an eye on the master Flash Sale D-Day countdown clock. As soon as the event drops live, limited claim spots unlock for instant claiming.
            </p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          padding: 'var(--space-xl)',
          display: 'flex',
          gap: 'var(--space-lg)',
          alignItems: 'flex-start'
        }}>
          <div style={{
            backgroundColor: 'var(--color-stock-green)',
            color: '#ffffff',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-headline)',
            fontSize: '20px',
            flexShrink: 0
          }}>
            3
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Ticket size={20} color="var(--color-stock-green)" />
              <h3 style={{ fontSize: '20px' }}>Claim & Copy Your Code</h3>
            </div>
            <p className="text-muted">
              Click <strong>"CLAIM DEAL"</strong> to instantly receive your unique ticket code (e.g. <code>CLAIM-9A2B-X7C4</code>) to redeem your discount!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
