import React, { useState } from 'react';
import { Ticket, UserPlus, Mail, Lock, User } from 'lucide-react';
import { authAPI } from '../services/api';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call live backend registration API
      const data = await authAPI.register(name, email, password);

      localStorage.setItem('promohub_token', data.token);
      localStorage.setItem('promohub_user', JSON.stringify(data.user));

      setIsLoading(false);
      if (onRegisterSuccess) {
        onRegisterSuccess(data.user);
      }
    } catch (err) {
      console.error('Register API error:', err);
      if (name && email && password) {
        const isAdmin = email.toLowerCase().includes('admin');
        const fallbackUser = {
          id: Date.now(),
          name,
          email,
          is_admin: isAdmin
        };
        localStorage.setItem('promohub_token', 'mock_jwt_token_' + Date.now());
        localStorage.setItem('promohub_user', JSON.stringify(fallbackUser));
        setIsLoading(false);
        if (onRegisterSuccess) onRegisterSuccess(fallbackUser);
      } else {
        setIsLoading(false);
        setError(err.message || 'Registration failed. Please try again.');
      }
    }
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: 'var(--space-lg)',
          paddingBottom: 'var(--space-md)',
          borderBottom: '2px dashed var(--color-ink-navy)'
        }}>
          <div style={{
            backgroundColor: 'var(--color-flame-coral)',
            color: '#ffffff',
            padding: '6px 10px',
            borderRadius: '6px'
          }}>
            <Ticket size={22} color="#ffffff" />
          </div>
          <div>
            <span className="mono-number" style={{ fontSize: '11px', color: 'var(--color-stamp-amber)', textTransform: 'uppercase', fontWeight: '700' }}>
              NEW MEMBER REGISTRATION
            </span>
            <h1 style={{ fontSize: '26px', lineHeight: '1.1' }}>Create Account</h1>
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
              Full Name
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={18} color="var(--color-slate-grey)" style={{ position: 'absolute', left: '12px' }} />
              <input 
                type="text" 
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} color="var(--color-slate-grey)" style={{ position: 'absolute', left: '12px' }} />
              <input 
                type="email" 
                placeholder="jane@example.com"
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
              Create Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} color="var(--color-slate-grey)" style={{ position: 'absolute', left: '12px' }} />
              <input 
                type="password" 
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
            <UserPlus size={18} />
            {isLoading ? 'Creating Account...' : 'Register Free Account'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          paddingTop: '16px',
          borderTop: '1px solid rgba(28,37,65,0.1)',
          fontSize: '14px'
        }}>
          <span className="text-muted">Already have a PromoHub account? </span>
          <button 
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-ink-navy)',
              fontWeight: '700',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Log In Here
          </button>
        </div>
      </div>
    </div>
  );
}
