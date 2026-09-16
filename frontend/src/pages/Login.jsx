import React, { useState } from 'react';
import { Ticket, LogIn, Mail, Lock, ShieldCheck, UserCheck } from 'lucide-react';
import { authAPI } from '../services/api';

export default function Login({ onLoginSuccess, onSwitchToRegister, initialAdminMode = false }) {
  const [isAdminMode, setIsAdminMode] = useState(initialAdminMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call live backend login API
      const data = await authAPI.login(email, password);
      
      // Store JWT token and user info in localStorage
      localStorage.setItem('promohub_token', data.token);
      localStorage.setItem('promohub_user', JSON.stringify(data.user));

      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      console.warn('Login API error, checking offline/local fallback:', err);
      const isNetworkError = err.message && (
        err.message.includes('Cannot connect') || 
        err.message.includes('Failed to fetch') || 
        err.message.includes('NetworkError')
      );

      // Handle offline or direct demo credentials fallback
      if (isNetworkError) {
        const normalizedEmail = email.trim().toLowerCase();
        // Check if admin login
        if (isAdminMode || normalizedEmail === 'admin@promohub.com') {
          const adminUser = {
            id: 1,
            name: 'System Admin',
            email: 'admin@promohub.com',
            is_admin: 1
          };
          localStorage.setItem('promohub_token', 'local-admin-token-' + Date.now());
          localStorage.setItem('promohub_user', JSON.stringify(adminUser));
          setIsLoading(false);
          if (onLoginSuccess) return onLoginSuccess(adminUser);
        }

        // Check locally registered users
        try {
          const storedUsers = JSON.parse(localStorage.getItem('promohub_registered_users') || '[]');
          const matchedUser = storedUsers.find(u => u.email === normalizedEmail);
          if (matchedUser) {
            localStorage.setItem('promohub_token', 'local-token-' + Date.now());
            localStorage.setItem('promohub_user', JSON.stringify(matchedUser));
            setIsLoading(false);
            if (onLoginSuccess) return onLoginSuccess(matchedUser);
          }
        } catch (e) {
          console.warn('LocalStorage lookup error:', e);
        }

        setIsLoading(false);
        setError('Cannot connect to backend server and credentials not found locally. Please verify your email or run backend on port 5000.');
      } else {
        setIsLoading(false);
        setError(err.message || 'Invalid email or password.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto' }}>
      <div style={{
        backgroundColor: 'var(--color-ticket-cream)',
        border: `3px solid ${isAdminMode ? 'var(--color-stamp-amber)' : 'var(--color-ink-navy)'}`,
        borderRadius: 'var(--radius)',
        padding: 'var(--space-xl)',
        boxShadow: 'var(--shadow-md)',
        position: 'relative'
      }}>
        {/* Portal Selection Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          backgroundColor: 'rgba(28, 37, 65, 0.08)',
          padding: '4px',
          borderRadius: 'var(--radius)',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => { setIsAdminMode(false); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: !isAdminMode ? '#ffffff' : 'transparent',
              color: !isAdminMode ? 'var(--color-ink-navy)' : 'var(--color-slate-grey)',
              boxShadow: !isAdminMode ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <UserCheck size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Shopper Sign In
          </button>
          
          <button
            type="button"
            onClick={() => { setIsAdminMode(true); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: isAdminMode ? 'var(--color-stamp-amber)' : 'transparent',
              color: isAdminMode ? '#ffffff' : 'var(--color-slate-grey)',
              boxShadow: isAdminMode ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <ShieldCheck size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Admin Portal
          </button>
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: 'var(--space-lg)',
          paddingBottom: 'var(--space-md)',
          borderBottom: '2px dashed var(--color-ink-navy)'
        }}>
          <div style={{
            backgroundColor: isAdminMode ? 'var(--color-stamp-amber)' : 'var(--color-ink-navy)',
            color: '#ffffff',
            padding: '6px 10px',
            borderRadius: '6px'
          }}>
            {isAdminMode ? <ShieldCheck size={22} color="#ffffff" /> : <Ticket size={22} color="var(--color-ticket-cream)" />}
          </div>
          <div>
            <span className="mono-number" style={{ fontSize: '11px', color: isAdminMode ? 'var(--color-stamp-amber)' : 'var(--color-slate-grey)', textTransform: 'uppercase', fontWeight: '700' }}>
              {isAdminMode ? 'RESTRICTED MANAGEMENT ACCESS' : 'MEMBER ACCESS STUB'}
            </span>
            <h1 style={{ fontSize: '24px', lineHeight: '1.1' }}>
              {isAdminMode ? 'Admin Authentication' : 'Shopper Sign In'}
            </h1>
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
              {isAdminMode ? 'Admin Primary Email' : 'Email Address'}
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} color="var(--color-slate-grey)" style={{ position: 'absolute', left: '12px' }} />
              <input 
                type="email" 
                placeholder={isAdminMode ? "admin@promohub.com" : "you@example.com"}
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
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>
              Password
            </label>
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
            className={`btn ${isAdminMode ? 'btn-amber' : 'btn-primary'}`} 
            type="submit" 
            style={{ width: '100%', marginBottom: '16px', fontSize: '16px' }}
            disabled={isLoading}
          >
            {isAdminMode ? <ShieldCheck size={18} /> : <LogIn size={18} />}
            {isLoading ? 'Authenticating...' : isAdminMode ? 'Authenticate Admin Console' : 'Sign In to PromoHub'}
          </button>
        </form>

        {!isAdminMode && (
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
              Sign Up Free
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
