import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Heart, BellRing } from 'lucide-react';
import { EVENT_START_DATE } from '../mockData/deals';

export default function HeroBanner({ totalDeals, totalInterestedCount }) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const difference = new Date(EVENT_START_DATE) - new Date();
      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-banner" style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-lg)' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'var(--color-flame-coral)',
        color: '#ffffff',
        padding: '6px 16px',
        borderRadius: 'var(--radius-pill)',
        fontSize: '13px',
        fontWeight: '700',
        marginBottom: '20px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        <Flame size={16} /> Official Flash Sale D-Day Event Countdown
      </div>

      <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>
        Huge Flash Sale Drops Soon!
      </h1>
      
      <p style={{ maxWidth: '680px', margin: '0 auto 24px auto', fontSize: '17px', color: 'rgba(255, 248, 237, 0.9)' }}>
        Massive discounts on top brands. Browse exclusive product vouchers below, indicate your interest before D-Day, and claim your code the second the countdown hits zero!
      </p>

      {/* D-Day Grand Countdown Timer Component */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: 'rgba(255, 248, 237, 0.08)',
        border: '2px dashed var(--color-flame-coral)',
        borderRadius: 'var(--radius)',
        padding: '16px 28px',
        marginBottom: '24px'
      }}>
        <div style={{ textTransform: 'uppercase', textAlign: 'center' }}>
          <span className="mono-number" style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-ticket-cream)' }}>
            {String(countdown.days).padStart(2, '0')}
          </span>
          <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-stamp-amber)', fontWeight: '700' }}>DAYS</span>
        </div>

        <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-flame-coral)' }}>:</span>

        <div style={{ textTransform: 'uppercase', textAlign: 'center' }}>
          <span className="mono-number" style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-ticket-cream)' }}>
            {String(countdown.hours).padStart(2, '0')}
          </span>
          <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-stamp-amber)', fontWeight: '700' }}>HOURS</span>
        </div>

        <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-flame-coral)' }}>:</span>

        <div style={{ textTransform: 'uppercase', textAlign: 'center' }}>
          <span className="mono-number" style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-ticket-cream)' }}>
            {String(countdown.minutes).padStart(2, '0')}
          </span>
          <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-stamp-amber)', fontWeight: '700' }}>MINS</span>
        </div>

        <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-flame-coral)' }}>:</span>

        <div style={{ textTransform: 'uppercase', textAlign: 'center' }}>
          <span className="mono-number" style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-flame-coral)' }}>
            {String(countdown.seconds).padStart(2, '0')}
          </span>
          <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-flame-coral)', fontWeight: '700' }}>SECS</span>
        </div>
      </div>

      {/* Shopper Momentum Badge Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'var(--space-xl)',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart size={20} color="var(--color-flame-coral)" fill="var(--color-flame-coral)" />
          <span className="mono-number" style={{ fontSize: '16px', fontWeight: '700' }}>
            {totalInterestedCount.toLocaleString()} Shoppers Pre-Registered
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="var(--color-stamp-amber)" />
          <span className="mono-number" style={{ fontSize: '16px', fontWeight: '700' }}>
            {totalDeals} Top Brand Vouchers
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BellRing size={20} color="var(--color-stock-green)" />
          <span className="mono-number" style={{ fontSize: '16px', fontWeight: '700' }}>
            Instant D-Day Claim Codes
          </span>
        </div>
      </div>
    </section>
  );
}
