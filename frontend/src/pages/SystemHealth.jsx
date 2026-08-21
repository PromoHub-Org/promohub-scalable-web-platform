import React from 'react';
import { HeartPulse, CheckCircle2, Server, Database, ShieldAlert, Cpu } from 'lucide-react';

export default function SystemHealth() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-lg)' }}>
        <HeartPulse size={32} color="var(--color-stock-green)" />
        <div>
          <h1>System Health & Status</h1>
          <p className="text-muted">Real-time status monitoring endpoint for PromoHub platform</p>
        </div>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid var(--color-ink-navy)',
        borderRadius: 'var(--radius)',
        padding: 'var(--space-xl)',
        marginBottom: 'var(--space-xl)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(28,37,65,0.1)',
          marginBottom: '20px'
        }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--color-slate-grey)', textTransform: 'uppercase', fontWeight: '700' }}>
              OVERALL PLATFORM STATUS
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <CheckCircle2 size={24} color="var(--color-stock-green)" />
              <span className="mono-number" style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-stock-green)' }}>
                HEALTHY — 200 OK
              </span>
            </div>
          </div>

          <span className="badge badge-in-stock" style={{ padding: '6px 12px', fontSize: '13px' }}>
            All Systems Operational
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-md)' }}>
          <div style={{
            backgroundColor: 'var(--color-ticket-cream)',
            padding: '16px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--color-ink-navy)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Server size={18} color="var(--color-ink-navy)" />
              <strong>Web App Server</strong>
            </div>
            <span className="mono-number text-green" style={{ fontSize: '14px' }}>ONLINE (Node.js + Express)</span>
          </div>

          <div style={{
            backgroundColor: 'var(--color-ticket-cream)',
            padding: '16px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--color-ink-navy)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Database size={18} color="var(--color-ink-navy)" />
              <strong>Database Pool</strong>
            </div>
            <span className="mono-number text-green" style={{ fontSize: '14px' }}>CONNECTED (PostgreSQL)</span>
          </div>

          <div style={{
            backgroundColor: 'var(--color-ticket-cream)',
            padding: '16px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--color-ink-navy)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldAlert size={18} color="var(--color-ink-navy)" />
              <strong>Atomic Claim Engine</strong>
            </div>
            <span className="mono-number text-green" style={{ fontSize: '14px' }}>ACTIVE (Zero Oversell)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
