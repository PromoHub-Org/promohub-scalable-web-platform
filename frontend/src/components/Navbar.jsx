import React from 'react';
import { Tag, Ticket, Heart, User, LogIn, Sparkles, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar({ 
  onNavigate,
  currentPage,
  savedCount = 0,
  claimsCount = 0,
  currentUser,
  onLogout 
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Wordmark */}
        <button 
          onClick={() => onNavigate('home')} 
          className="navbar-brand"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
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
        </button>

        {/* Navigation Links */}
        <nav>
          <ul className="navbar-nav">
            <li>
              <button 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => onNavigate('home')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Tag size={18} />
                Flash Deals
              </button>
            </li>

            <li>
              <button 
                className={`nav-link ${currentPage === 'interested' ? 'active' : ''}`}
                onClick={() => onNavigate('interested')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
              >
                <Heart size={18} color="var(--color-flame-coral)" fill={savedCount > 0 ? "var(--color-flame-coral)" : "none"} />
                My Saved Deals
                {savedCount > 0 && (
                  <span className="mono-number" style={{
                    backgroundColor: 'var(--color-flame-coral)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '700',
                    borderRadius: 'var(--radius-pill)',
                    padding: '2px 6px',
                    marginLeft: '4px'
                  }}>
                    {savedCount}
                  </span>
                )}
              </button>
            </li>

            {currentUser && (
              <li>
                <button 
                  className={`nav-link ${currentPage === 'claims' ? 'active' : ''}`}
                  onClick={() => onNavigate('claims')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Ticket size={18} />
                  My Claims ({claimsCount})
                </button>
              </li>
            )}

            {currentUser && currentUser.is_admin && (
              <li>
                <button 
                  className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
                  onClick={() => onNavigate('admin')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-stamp-amber)' }}
                >
                  <LayoutDashboard size={18} />
                  Admin Dashboard
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* User Auth Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={16} color="var(--color-ticket-cream)" />
                <span style={{ fontSize: '14px', color: 'var(--color-ticket-cream)', fontWeight: '600' }}>
                  {currentUser.name} {currentUser.is_admin && <span style={{ color: 'var(--color-stamp-amber)', fontSize: '11px' }}>(Admin)</span>}
                </span>
              </div>
              <button 
                className="btn btn-secondary" 
                style={{ color: 'var(--color-ticket-cream)', borderColor: 'var(--color-ticket-cream)', padding: '6px 12px', fontSize: '13px' }}
                onClick={onLogout}
              >
                <LogOut size={14} />
                Log Out
              </button>
            </div>
          ) : (
            <>
              <button 
                className="btn btn-secondary" 
                style={{ color: 'var(--color-ticket-cream)', borderColor: 'var(--color-ticket-cream)', padding: '6px 14px', fontSize: '14px' }}
                onClick={() => onNavigate('login')}
              >
                <LogIn size={16} />
                Log In
              </button>
              <button 
                className="btn btn-primary" 
                style={{ padding: '6px 14px', fontSize: '14px' }}
                onClick={() => onNavigate('register')}
              >
                <User size={16} />
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
