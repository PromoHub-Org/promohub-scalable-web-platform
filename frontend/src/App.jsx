import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DealsList from './pages/DealsList';
import DealDetail from './pages/DealDetail';
import HowItWorks from './pages/HowItWorks';
import InterestedDeals from './pages/InterestedDeals';
import { MOCK_DEALS } from './mockData/deals';
import { X, LogIn, UserPlus } from 'lucide-react';
import './styles/global.css';

export default function App() {
  const [deals, setDeals] = useState(MOCK_DEALS);
  const [activeTab, setActiveTab] = useState('deals'); // 'deals', 'interested', 'how-it-works', 'detail'
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [authModal, setAuthModal] = useState(null); // 'login', 'register', or null

  // Toggle user's interest for a deal
  const handleToggleInterest = (dealId) => {
    setDeals(prevDeals =>
      prevDeals.map(d => {
        if (d.id === dealId) {
          const isNowInterested = !d.is_interested;
          return {
            ...d,
            is_interested: isNowInterested,
            interested_count: d.interested_count + (isNowInterested ? 1 : -1)
          };
        }
        return d;
      })
    );
  };

  const handleViewDetail = (deal) => {
    setSelectedDeal(deal);
    setActiveTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDeals = () => {
    setSelectedDeal(null);
    setActiveTab('deals');
  };

  const interestedDealsCount = deals.filter(d => d.is_interested).length;

  return (
    <div className="app-container">
      <Navbar 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'detail') setSelectedDeal(null);
        }}
        interestedCount={interestedDealsCount}
        onLoginClick={() => setAuthModal('login')}
        onRegisterClick={() => setAuthModal('register')}
      />

      <main className="main-content">
        {activeTab === 'deals' && (
          <DealsList 
            deals={deals}
            setDeals={setDeals}
            onViewDetail={handleViewDetail}
            onToggleInterest={handleToggleInterest}
          />
        )}

        {activeTab === 'interested' && (
          <InterestedDeals 
            deals={deals}
            onClaim={(d) => { setSelectedDeal(d); setActiveTab('detail'); }}
            onViewDetail={handleViewDetail}
            onToggleInterest={handleToggleInterest}
            onBackToAll={handleBackToDeals}
          />
        )}

        {activeTab === 'detail' && selectedDeal && (
          <DealDetail 
            deal={deals.find(d => d.id === selectedDeal.id) || selectedDeal} 
            onBack={handleBackToDeals} 
          />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorks />
        )}
      </main>

      <Footer />

      {/* User Login / Register Auth Modal */}
      {authModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(28, 37, 65, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--color-ticket-cream)',
            border: '3px solid var(--color-ink-navy)',
            borderRadius: 'var(--radius)',
            maxWidth: '420px',
            width: '100%',
            padding: '24px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setAuthModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-ink-navy)'
              }}
            >
              <X size={24} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              {authModal === 'login' ? <LogIn size={24} color="var(--color-ink-navy)" /> : <UserPlus size={24} color="var(--color-flame-coral)" />}
              <h2>{authModal === 'login' ? 'User Login' : 'Create Account'}</h2>
            </div>

            <p style={{ fontSize: '14px', marginBottom: '20px', color: 'var(--color-slate-grey)' }}>
              {authModal === 'login' 
                ? 'Sign in to view your saved vouchers and claim codes on D-Day.' 
                : 'Create a free PromoHub account to indicate interest and claim brand discount codes.'}
            </p>

            <form onSubmit={(e) => { e.preventDefault(); setAuthModal(null); }}>
              {authModal === 'register' && (
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Jane Doe"
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius)',
                      border: '2px solid var(--color-ink-navy)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="jane@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius)',
                    border: '2px solid var(--color-ink-navy)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius)',
                    border: '2px solid var(--color-ink-navy)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
                {authModal === 'login' ? 'Log In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
