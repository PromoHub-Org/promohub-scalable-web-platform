import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DealsList from './pages/DealsList';
import DealDetail from './pages/DealDetail';
import MyClaims from './pages/MyClaims';
import AdminDashboard from './pages/AdminDashboard';
import InterestedDeals from './pages/InterestedDeals';
import Login from './pages/Login';
import Register from './pages/Register';
import ClaimModal from './components/ClaimModal';
import { MOCK_DEALS as mockDeals } from './mockData/deals';
import { dealsAPI } from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'detail', 'claims', 'admin', 'interested', 'login', 'register'
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [deals, setDeals] = useState(mockDeals);
  const [userClaims, setUserClaims] = useState([]);
  const [savedDealIds, setSavedDealIds] = useState([]);
  const [claimingDeal, setClaimingDeal] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [targetAdminView, setTargetAdminView] = useState(false);

  // Initialize Auth state & fetch live deals catalog from backend on mount
  useEffect(() => {
    // Check localStorage for saved token & user
    const savedToken = localStorage.getItem('promohub_token');
    const savedUser = localStorage.getItem('promohub_user');
    if (savedToken && savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }

    // Fetch live deals from Express backend API
    const fetchDeals = async () => {
      try {
        const liveDeals = await dealsAPI.getAll();
        if (Array.isArray(liveDeals) && liveDeals.length > 0) {
          setDeals(liveDeals);
        }
      } catch (err) {
        console.log('Backend API offline or unreachable; using local deals catalog:', err.message);
      }
    };

    fetchDeals();
  }, []);

  const handleNavigate = (page, dealId = null) => {
    setCurrentPage(page);
    if (dealId) {
      setSelectedDealId(dealId);
    }
    window.scrollTo(0, 0);
  };

  const handleToggleSaved = (dealId) => {
    setSavedDealIds(prev => {
      const exists = prev.includes(dealId);
      const updated = exists ? prev.filter(id => id !== dealId) : [...prev, dealId];

      setDeals(dealsList => dealsList.map(d => {
        if (d.id === dealId) {
          return {
            ...d,
            interested_count: exists ? Math.max(0, (d.interested_count || 0) - 1) : (d.interested_count || 0) + 1
          };
        }
        return d;
      }));

      return updated;
    });
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.is_admin) {
      handleNavigate('admin');
    } else {
      handleNavigate('home');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('promohub_token');
    localStorage.removeItem('promohub_user');
    setCurrentUser(null);
    handleNavigate('home');
  };

  const handleOpenClaimModal = (deal) => {
    setClaimingDeal(deal);
  };

  const handleConfirmClaim = (dealId) => {
    setDeals(prevDeals => prevDeals.map(d => {
      if (d.id === dealId) {
        return {
          ...d,
          stock_remaining: Math.max(0, d.stock_remaining - 1)
        };
      }
      return d;
    }));

    const claimedDeal = deals.find(d => d.id === dealId);
    if (claimedDeal) {
      const newClaim = {
        id: Date.now(),
        deal_id: dealId,
        claim_code: 'CLAIM-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        claimed_at: new Date().toISOString(),
        deal_title: claimedDeal.title,
        brand: claimedDeal.brand,
        price: claimedDeal.price,
        original_price: claimedDeal.original_price
      };
      setUserClaims(prev => [newClaim, ...prev]);
    }
  };

  const selectedDeal = deals.find(d => d.id === selectedDealId);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-canvas)' }}>
      {/* Brand Header & Role-Based Navigation */}
      <Navbar 
        onNavigate={handleNavigate}
        claimsCount={userClaims.length}
        savedCount={savedDealIds.length}
        currentPage={currentPage}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: 'var(--space-xl) var(--space-md)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {currentPage === 'home' && (
            <DealsList 
              deals={deals}
              onSelectDeal={(id) => handleNavigate('detail', id)}
              onClaim={handleOpenClaimModal}
              savedDealIds={savedDealIds}
              onToggleSaved={handleToggleSaved}
            />
          )}

          {currentPage === 'detail' && (
            <DealDetail 
              deal={selectedDeal}
              onBack={() => handleNavigate('home')}
              onClaim={handleOpenClaimModal}
              isSaved={selectedDealId ? savedDealIds.includes(selectedDealId) : false}
              onToggleSaved={handleToggleSaved}
            />
          )}

          {currentPage === 'claims' && (
            <MyClaims 
              userClaims={userClaims}
              onExploreDeals={() => handleNavigate('home')}
            />
          )}

          {currentPage === 'admin' && (
            <AdminDashboard 
              deals={deals}
              setDeals={setDeals}
              userClaims={userClaims}
              currentUser={currentUser}
            />
          )}

          {currentPage === 'interested' && (
            <InterestedDeals 
              deals={deals}
              savedDealIds={savedDealIds}
              onSelectDeal={(id) => handleNavigate('detail', id)}
              onClaim={handleOpenClaimModal}
              onToggleSaved={handleToggleSaved}
              onExploreDeals={() => handleNavigate('home')}
            />
          )}

          {currentPage === 'login' && (
            <Login 
              initialAdminMode={targetAdminView}
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => handleNavigate('register')}
            />
          )}

          {currentPage === 'register' && (
            <Register 
              onRegisterSuccess={handleLoginSuccess}
              onSwitchToLogin={() => handleNavigate('login')}
            />
          )}
        </div>
      </main>

      {/* Voucher Claiming Confirmation Popup Modal */}
      {claimingDeal && (
        <ClaimModal 
          deal={claimingDeal}
          onClose={() => setClaimingDeal(null)}
          onConfirmClaim={handleConfirmClaim}
          currentUser={currentUser}
          onPromptLogin={() => handleNavigate('login')}
        />
      )}

      {/* Brand Footer */}
      <footer style={{
        backgroundColor: 'var(--color-ink-navy)',
        color: 'var(--color-ticket-cream)',
        padding: 'var(--space-xl) var(--space-md)',
        marginTop: 'var(--space-2xl)',
        borderTop: '3px solid var(--color-stamp-amber)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', fontSize: '14px' }}>
          <p style={{ fontWeight: '700', marginBottom: '4px' }}>PromoHub — Scalable Flash Sale & Deals Voucher Platform</p>
          <p style={{ color: 'rgba(255,248,237,0.7)', fontSize: '12px' }}>
            Zero-oversell atomic concurrency locking • High-traffic Cloud Architecture • Open Source MVP
          </p>
        </div>
      </footer>
    </div>
  );
}
