import React from 'react';
import { Tag, Ticket, Heart, User, LogIn, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, interestedCount, onLoginClick, onRegisterClick }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="#deals" className="navbar-brand" onClick={() => setActiveTab('deals')}>
          <div style={{
            backgroundColor: 'var(--color-ticket-cream)',
            padding: '4px 8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--color-ink-navy)'
          }}>
            <Ticket size={20} color="var(--color-ink-navy)" strokeWidth={2.5} />
          </div>
          <span className="navbar-logo-text">PromoHub</span>
        </a>

        <nav>
          <ul className="navbar-nav">
            <li>
              <button 
                className={`nav-link ${activeTab === 'deals' ? 'active' : ''}`}
                onClick={() => setActiveTab('deals')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Tag size={18} />
                Flash Deals
              </button>
            </li>

            <li>
              <button 
                className={`nav-link ${activeTab === 'interested' ? 'active' : ''}`}
                onClick={() => setActiveTab('interested')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
              >
                <Heart size={18} color="var(--color-flame-coral)" fill={interestedCount > 0 ? "var(--color-flame-coral)" : "none"} />
                My Interested Deals
                {interestedCount > 0 && (
                  <span className="mono-number" style={{
                    backgroundColor: 'var(--color-flame-coral)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '700',
                    borderRadius: 'var(--radius-pill)',
                    padding: '2px 6px',
                    marginLeft: '4px'
                  }}>
                    {interestedCount}
                  </span>
                )}
              </button>
            </li>

            <li>
              <button 
                className={`nav-link ${activeTab === 'how-it-works' ? 'active' : ''}`}
                onClick={() => setActiveTab('how-it-works')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Sparkles size={18} />
                How It Works
              </button>
            </li>
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <button 
            className="btn btn-secondary" 
            style={{ color: 'var(--color-ticket-cream)', borderColor: 'var(--color-ticket-cream)', padding: '6px 14px', fontSize: '14px' }}
            onClick={onLoginClick}
          >
            <LogIn size={16} />
            Log In
          </button>
          <button 
            className="btn btn-primary" 
            style={{ padding: '6px 14px', fontSize: '14px' }}
            onClick={onRegisterClick}
          >
            <User size={16} />
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
