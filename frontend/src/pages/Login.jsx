import React, { useState } from 'react';
import { Ticket, LogIn, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email && password) {
        const isAdmin = email.toLowerCase().includes('admin');
        const user = {
          name: email.split('@')[0],
          email: email,
          is_admin: isAdmin
        };
        setIsLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      } else {
        setIsLoading(false);
        setError('Please fill in both email and password.');
      }
    }, 600);
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto' }}>
      <div style={{
        backgroundColor: 'var(--color-ticket-cream)',
        border: '3px solid var(--color-ink-navy)',
        borderRadius: 'var(--radius)',
        padding: 'var(--space-xl)',
        boxShadow: 'var(--shadow-md)',
        position: 'relative'
      }}>
        {/* Ticket Perforation Accent */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: 'var(--space-lg)',
          paddingBottom: 'var(--space-md)',
          borderBottom: '2px dashed var(--color-ink-navy)'
        }}>
          <div style={{
            backgroundColor: 'var(--color-ink-navy)',
            color: 'var(--color-ticket-cream)',
            padding: '6px 10px',
            borderRadius: '6px'
          }}>
            <Ticket size={22} color="var(--color-ticket-cream)" />
          </div>
          <div>
            <span className="mono-number" style={{ fontSize: '11px', color: 'var(--color-stamp-amber)', textTransform: 'uppercase', fontWeight: '700' }}>
              MEMBER ACCESS STUB
            </span>
            <h1 style={{ fontSize: '26px', lineHeight: '1.1' }}>User Login</h1>
          </div>
        </div>

        {error && (
          <div className="alert-banner alert-error" style={{ fontSize: '14px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} color="var(--color-slate-grey)" style={{ position: 'absolute', left: '12px' }} />
              <input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  borderRadius: 'var(--radius)',
                  border: '2px solid var(--color-ink-navy)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '700' }}>
                Password
              </label>
              <span className="text-muted" style={{ fontSize: '12px' }}>Use "admin@promohub.com" for Admin</span>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} color="var(--color-slate-grey)" style={{ position: 'absolute', left: '12px' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  borderRadius: 'var(--radius)',
                  border: '2px solid var(--color-ink-navy)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            type="submit" 
            style={{ width: '100%', marginBottom: '16px', fontSize: '16px' }}
            disabled={isLoading}
          >
            <LogIn size={18} />
            {isLoading ? 'Signing In...' : 'Log In to PromoHub'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          paddingTop: '16px',
          borderTop: '1px solid rgba(28,37,65,0.1)',
          fontSize: '14px'
        }}>
          <span className="text-muted">Don't have an account yet? </span>
          <button 
            onClick={onSwitchToRegister}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-flame-coral)',
              fontWeight: '700',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
}
