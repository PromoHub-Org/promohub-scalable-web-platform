import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, Ticket, Heart } from 'lucide-react';
import { EVENT_START_DATE } from '../mockData/deals';

export default function TicketCard({ deal, onClaim, onViewDetail, onToggleInterest }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  // Synchronized countdown timer matching master D-Day Event date (14 days)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(deal.end_time || EVENT_START_DATE);
      const difference = targetDate - new Date();
      if (difference <= 0) {
        setTimeLeft('00d 00:00:00');
        setIsExpired(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const daysStr = days > 0 ? `${days.toString().padStart(2, '0')}d ` : '';
      const timeStr = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
      ].join(':');

      setTimeLeft(`${daysStr}${timeStr}`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [deal.end_time]);

  const isSoldOut = deal.stock_remaining === 0 || isExpired;
  const isLowStock = deal.stock_remaining > 0 && deal.stock_remaining <= 5;

  return (
    <div className={`ticket-card ${isSoldOut ? 'sold-out' : ''}`}>
      {/* Left side: Brand, Title, Description, Price, Interest Counter */}
      <div className="ticket-info">
        <div>
          {/* Brand Tag & Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '13px',
              color: 'var(--color-stamp-amber)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              backgroundColor: 'rgba(186, 117, 23, 0.1)',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(186, 117, 23, 0.3)'
            }}>
              {deal.brand}
            </span>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {deal.is_featured && (
                <span className="badge badge-featured">
                  ★ Featured
                </span>
              )}
              {isSoldOut ? (
                <span className="badge badge-sold-out">Sold Out</span>
              ) : isLowStock ? (
                <span className="badge badge-low-stock">
                  <AlertTriangle size={12} /> Low Stock
                </span>
              ) : (
                <span className="badge badge-in-stock">
                  <CheckCircle size={12} /> Drop Live
                </span>
              )}
            </div>
          </div>

          <h3 className="ticket-title" style={{ marginBottom: '8px' }}>{deal.title}</h3>
          <p className="ticket-description">{deal.description}</p>
        </div>

        <div className="ticket-meta">
          <div>
            <span className="ticket-price">${deal.price.toFixed(2)}</span>
            {deal.original_price && (
              <span className="ticket-original-price">${deal.original_price.toFixed(2)}</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Indicate Interest / Wishlist Button */}
            <button
              onClick={() => onToggleInterest && onToggleInterest(deal.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius)',
                border: deal.is_interested ? '2px solid var(--color-flame-coral)' : '1px solid var(--color-ink-navy)',
                backgroundColor: deal.is_interested ? 'rgba(226, 75, 74, 0.1)' : '#ffffff',
                color: deal.is_interested ? 'var(--color-flame-coral)' : 'var(--color-ink-navy)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title={deal.is_interested ? "You indicated interest for D-Day!" : "Click to indicate interest for D-Day!"}
            >
              <Heart 
                size={16} 
                color="var(--color-flame-coral)" 
                fill={deal.is_interested ? "var(--color-flame-coral)" : "none"} 
              />
              <span>{deal.interested_count.toLocaleString()}</span>
              {deal.is_interested && <span style={{ fontSize: '11px', textTransform: 'uppercase' }}>Interested</span>}
            </button>

            <button 
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '13px' }}
              onClick={() => onViewDetail(deal)}
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Dashed perforation line */}
      <div className="ticket-divider"></div>

      {/* Right side: The Ticket Stub (Stock + Timer + Claim Action) */}
      <div className="ticket-stub">
        <div>
          <span className="stub-timer-label">Stock Remaining</span>
          <div 
            className="stub-stock"
            style={{
              color: isSoldOut 
                ? 'var(--color-slate-grey)' 
                : isLowStock 
                  ? 'var(--color-flame-coral)' 
                  : 'var(--color-stock-green)'
            }}
          >
            {deal.stock_remaining} / {deal.total_stock} LEFT
          </div>
        </div>

        <div className="stub-timer">
          <span className="stub-timer-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> D-Day Countdown
          </span>
          <span className="stub-timer-val">{timeLeft || '00d 00:00:00'}</span>
        </div>

        <button
          className={`btn ${isSoldOut ? 'btn-disabled' : 'btn-primary'}`}
          disabled={isSoldOut}
          onClick={() => onClaim(deal)}
        >
          <Ticket size={18} />
          {isSoldOut ? 'SOLD OUT' : 'CLAIM DEAL'}
        </button>
      </div>
    </div>
  );
}
