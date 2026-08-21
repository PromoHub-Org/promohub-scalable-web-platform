import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DealsList from './pages/DealsList';
import DealDetail from './pages/DealDetail';
import HowItWorks from './pages/HowItWorks';
import InterestedDeals from './pages/InterestedDeals';
import Login from './pages/Login';
import Register from './pages/Register';
import MyClaims from './pages/MyClaims';
import AdminDashboard from './pages/AdminDashboard';
import { MOCK_DEALS } from './mockData/deals';
import './styles/global.css';

export default function App() {
  const [deals, setDeals] = useState(MOCK_DEALS);
  const [activeTab, setActiveTab] = useState('deals'); // 'deals', 'interested', 'my-claims', 'admin', 'login', 'register', 'how-it-works', 'detail'
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // { name, email, is_admin }
  const [userClaims, setUserClaims] = useState([]);

  // Handle toggling user interest for a deal
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

  // Handle claim voucher addition
  const handleClaimSuccess = (dealId) => {
    const targetDeal = deals.find(d => d.id === dealId);
    if (targetDeal) {
      const randomCode = 'CLAIM-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      const newClaim = {
        id: 'c_' + Date.now(),
        claim_code: randomCode,
        deal_title: targetDeal.title,
        brand: targetDeal.brand,
        price: targetDeal.price,
        original_price: targetDeal.original_price,
        claimed_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'ACTIVE'
      };
      setUserClaims(prev => [newClaim, ...prev]);
    }
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

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.is_admin) {
      setActiveTab('admin');
    } else {
      setActiveTab('deals');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
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
        currentUser={currentUser}
        onLoginClick={() => setActiveTab('login')}
        onRegisterClick={() => setActiveTab('register')}
        onLogout={handleLogout}
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

        {activeTab === 'my-claims' && (
          <MyClaims 
            userClaims={userClaims}
            onExploreDeals={handleBackToDeals}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard 
            deals={deals}
            setDeals={setDeals}
            userClaims={userClaims}
          />
        )}

        {activeTab === 'login' && (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setActiveTab('register')}
          />
        )}

        {activeTab === 'register' && (
          <Register 
            onRegisterSuccess={handleLoginSuccess}
            onSwitchToLogin={() => setActiveTab('login')}
          />
        )}

        {activeTab === 'detail' && selectedDeal && (
          <DealDetail 
            deal={deals.find(d => d.id === selectedDeal.id) || selectedDeal} 
            onBack={handleBackToDeals}
            onClaimSuccess={handleClaimSuccess}
          />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorks />
        )}
      </main>

      <Footer />
    </div>
  );
}
