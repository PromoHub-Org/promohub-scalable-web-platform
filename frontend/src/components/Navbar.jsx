import React, { useState } from 'react';
import { Tag, Ticket, Heart, User, LogIn, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';

export default function Navbar({ 
  onNavigate,
  currentPage,
  savedCount = 0,
  claimsCount = 0,
  currentUser,
  onLogout 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Wordmark */}
        <button 
          onClick={() => handleNavClick('home')} 
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

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <ul className="navbar-nav">
            <li>
              <button 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Tag size={18} />
                Flash Deals
              </button>
            </li>

            <li>
              <button 
                className={`nav-link ${currentPage === 'interested' ? 'active' : ''}`}
                onClick={() => handleNavClick('interested')}
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
                  onClick={() => handleNavClick('claims')}
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
                  onClick={() => handleNavClick('admin')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-stamp-amber)' }}
                >
                  <LayoutDashboard size={18} />
                  Admin Dashboard
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Desktop User Auth Section */}
        <div className="desktop-auth" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
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
                onClick={() => handleNavClick('login')}
              >
                <LogIn size={16} />
                Log In
              </button>
              <button 
                className="btn btn-primary" 
                style={{ padding: '6px 14px', fontSize: '14px' }}
                onClick={() => handleNavClick('register')}
              >
                <User size={16} />
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Header Quick Actions & Hamburger Menu Button */}
        <div className="mobile-header-actions" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
          {!currentUser ? (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ 
                  color: 'var(--color-ticket-cream)', 
                  borderColor: 'var(--color-ticket-cream)', 
                  padding: '6px 10px', 
                  fontSize: '13px',
                  minHeight: '36px'
                }}
                onClick={() => handleNavClick('login')}
              >
                Log In
              </button>
              <button 
                className="btn btn-primary" 
                style={{ 
                  padding: '6px 10px', 
                  fontSize: '13px',
                  minHeight: '36px'
                }}
                onClick={() => handleNavClick('register')}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleNavClick('claims')}
              className="btn btn-secondary"
              style={{ color: 'var(--color-ticket-cream)', borderColor: 'var(--color-ticket-cream)', padding: '4px 8px', fontSize: '12px', minHeight: '34px' }}
            >
              <Ticket size={14} /> My Claims
            </button>
          )}

          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
            style={{
              background: 'none',
              border: '1px solid rgba(255, 248, 237, 0.4)',
              borderRadius: '6px',
              color: 'var(--color-ticket-cream)',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" style={{
          backgroundColor: 'var(--color-ink-navy)',
          borderTop: '1px solid rgba(255, 248, 237, 0.15)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {currentUser && (
            <div style={{
              padding: '10px',
              backgroundColor: 'rgba(255, 248, 237, 0.08)',
              borderRadius: 'var(--radius)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '14px', color: 'var(--color-ticket-cream)', fontWeight: '600' }}>
                Signed in as: <strong>{currentUser.name}</strong>
              </span>
              <button 
                onClick={onLogout}
                className="btn btn-secondary"
                style={{ color: 'var(--color-flame-coral)', borderColor: 'var(--color-flame-coral)', padding: '4px 8px', fontSize: '12px', minHeight: '32px' }}
              >
                Log Out
              </button>
            </div>
          )}

          <button
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
            style={{
              background: 'none',
              border: 'none',
              padding: '10px',
              textAlign: 'left',
              width: '100%',
              fontSize: '16px',
              borderBottom: '1px solid rgba(255, 248, 237, 0.1)',
              cursor: 'pointer'
            }}
          >
            <Tag size={18} /> Flash Deals
          </button>

          <button
            className={`nav-link ${currentPage === 'interested' ? 'active' : ''}`}
            onClick={() => handleNavClick('interested')}
            style={{
              background: 'none',
              border: 'none',
              padding: '10px',
              textAlign: 'left',
              width: '100%',
              fontSize: '16px',
              borderBottom: '1px solid rgba(255, 248, 237, 0.1)',
              cursor: 'pointer'
            }}
          >
            <Heart size={18} color="var(--color-flame-coral)" fill={savedCount > 0 ? "var(--color-flame-coral)" : "none"} />
            My Saved Deals ({savedCount})
          </button>

          {currentUser && (
            <button
              className={`nav-link ${currentPage === 'claims' ? 'active' : ''}`}
              onClick={() => handleNavClick('claims')}
              style={{
                background: 'none',
                border: 'none',
                padding: '10px',
                textAlign: 'left',
                width: '100%',
                fontSize: '16px',
                borderBottom: '1px solid rgba(255, 248, 237, 0.1)',
                cursor: 'pointer'
              }}
            >
              <Ticket size={18} /> My Claims ({claimsCount})
            </button>
          )}

          {currentUser && currentUser.is_admin && (
            <button
              className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={() => handleNavClick('admin')}
              style={{
                background: 'none',
                border: 'none',
                padding: '10px',
                textAlign: 'left',
                width: '100%',
                fontSize: '16px',
                color: 'var(--color-stamp-amber)',
                borderBottom: '1px solid rgba(255, 248, 237, 0.1)',
                cursor: 'pointer'
              }}
            >
              <LayoutDashboard size={18} /> Admin Dashboard
            </button>
          )}

          {!currentUser && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, color: 'var(--color-ticket-cream)', borderColor: 'var(--color-ticket-cream)' }}
                onClick={() => handleNavClick('login')}
              >
                <LogIn size={16} /> Log In
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                onClick={() => handleNavClick('register')}
              >
                <User size={16} /> Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
