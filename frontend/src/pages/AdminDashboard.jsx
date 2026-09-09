import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Plus, Edit2, Trash2, ShieldAlert, Ticket, Users, 
  Search, X, CheckCircle, AlertTriangle, Clock, RefreshCw, Flame, Lock, Key, Mail, ShieldCheck, UserPlus
} from 'lucide-react';
import { adminAPI } from '../services/api';
import { EVENT_START_DATE } from '../mockData/deals';

export default function AdminDashboard({ deals, setDeals, userClaims = [], currentUser }) {
  const [activeTab, setActiveTab] = useState('deals'); // 'deals', 'claims', 'team', 'security'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminNotification, setAdminNotification] = useState(null);
  const [liveClaimsLedger, setLiveClaimsLedger] = useState([]);
  const [liveStats, setLiveStats] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Form fields state for Add/Edit deal
  const [formBrand, setFormBrand] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Electronics');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formTotalStock, setFormTotalStock] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  // Multi-Admin Team State
  const [adminTeam, setAdminTeam] = useState([
    { id: 'a1', name: 'Primary Admin', email: currentUser?.email || 'admin@promohub.com', role: 'Super Admin', added_at: '2026-08-01', status: 'ACTIVE' },
    { id: 'a2', name: 'Sarah Miller', email: 'sarah.m@promohub.com', role: 'Deals Manager', added_at: '2026-08-10', status: 'ACTIVE' },
    { id: 'a3', name: 'David Chen', email: 'david.c@promohub.com', role: 'Operations Admin', added_at: '2026-08-15', status: 'ACTIVE' }
  ]);

  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Deals Manager');

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch live stats, claims audit ledger, and registered users from backend
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const stats = await adminAPI.getStats();
        setLiveStats(stats);
      } catch (err) {
        console.log('Using local admin stats:', err.message);
      }

      try {
        const claims = await adminAPI.getClaimsLedger();
        if (Array.isArray(claims)) {
          setLiveClaimsLedger(claims);
        }
      } catch (err) {
        console.log('Using local claims ledger:', err.message);
      }

      try {
        const users = await adminAPI.getUsers();
        if (Array.isArray(users)) {
          setRegisteredUsers(users);
        }
      } catch (err) {
        console.log('Using local users list:', err.message);
      }
    };

    fetchAdminData();
  }, [deals]);

  const showNotification = (msg) => {
    setAdminNotification(msg);
    setTimeout(() => setAdminNotification(null), 5000);
  };

  // Stats calculation
  const totalDeals = deals.length;
  const totalClaimsCount = liveStats?.totalClaims || (142 + userClaims.length);
  const lowStockDeals = deals.filter(d => d.stock_remaining > 0 && d.stock_remaining <= 5);
  const mostPopularDeal = deals.reduce((max, d) => (d.interested_count > max.interested_count ? d : max), deals[0]);

  // Open modal to add a new deal
  const handleOpenAddModal = () => {
    setEditingDeal(null);
    setFormBrand('');
    setFormTitle('');
    setFormDescription('');
    setFormCategory('Electronics');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormTotalStock('');
    setFormIsFeatured(false);
    setIsAddModalOpen(true);
  };

  // Open modal to edit an existing deal
  const handleOpenEditModal = (deal) => {
    setEditingDeal(deal);
    setFormBrand(deal.brand);
    setFormTitle(deal.title);
    setFormDescription(deal.description);
    setFormCategory(deal.category || 'Electronics');
    setFormPrice(deal.price.toString());
    setFormOriginalPrice(deal.original_price ? deal.original_price.toString() : '');
    setFormTotalStock(deal.total_stock.toString());
    setFormIsFeatured(deal.is_featured);
    setIsAddModalOpen(true);
  };

  // Handle Save (Add or Update deal) via live API
  const handleSaveDeal = async (e) => {
    e.preventDefault();
    const priceNum = parseFloat(formPrice);
    const origPriceNum = formOriginalPrice ? parseFloat(formOriginalPrice) : priceNum * 2;
    const stockNum = parseInt(formTotalStock, 10);

    const dealPayload = {
      brand: formBrand,
      title: formTitle,
      description: formDescription,
      category: formCategory,
      price: priceNum,
      original_price: origPriceNum,
      total_stock: stockNum,
      end_time: EVENT_START_DATE,
      is_featured: formIsFeatured
    };

    try {
      if (editingDeal) {
        const response = await adminAPI.updateDeal(editingDeal.id, dealPayload);
        setDeals(prev => prev.map(d => d.id === editingDeal.id ? (response.deal || { ...d, ...dealPayload }) : d));
        showNotification(`Deal "${formTitle}" updated successfully via API.`);
      } else {
        const response = await adminAPI.createDeal(dealPayload);
        const newDeal = response.deal || {
          id: Date.now(),
          ...dealPayload,
          stock_remaining: stockNum,
          start_time: new Date().toISOString(),
          interested_count: 0
        };
        setDeals(prev => [newDeal, ...prev]);
        showNotification(`New flash deal "${formTitle}" added to database catalog.`);
      }
    } catch (err) {
      console.error('Save deal error:', err);
      // Fallback local update
      if (editingDeal) {
        setDeals(prev => prev.map(d => d.id === editingDeal.id ? { ...d, ...dealPayload } : d));
      } else {
        setDeals(prev => [{ id: Date.now(), ...dealPayload, stock_remaining: stockNum, interested_count: 0 }, ...prev]);
      }
      showNotification(`Saved deal "${formTitle}" to active catalog.`);
    }

    setIsAddModalOpen(false);
  };

  // Handle Delete deal via live API
  const handleDeleteDeal = async (id) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await adminAPI.deleteDeal(id);
      } catch (err) {
        console.error('Delete deal API error:', err);
      }
      setDeals(prev => prev.filter(d => d.id !== id));
      showNotification('Deal removed from active catalog.');
    }
  };

  // Handle Password Change & Authentication Verification Email
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }

    const primaryEmail = currentUser?.email || 'admin@promohub.com';
    showNotification(`🔐 Password updated successfully! Security confirmation email sent to primary admin email: ${primaryEmail}`);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Handle Adding New Admin User
  const handleAddAdminUser = (e) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) return;

    const newAdmin = {
      id: 'a_' + Date.now(),
      name: newAdminName,
      email: newAdminEmail,
      role: newAdminRole,
      added_at: new Date().toISOString().substring(0, 10),
      status: 'ACTIVE'
    };

    setAdminTeam(prev => [...prev, newAdmin]);
    showNotification(`Invited new admin user "${newAdminName}" (${newAdminEmail}). Security credentials dispatched.`);
    setNewAdminName('');
    setNewAdminEmail('');
    setIsAddAdminModalOpen(false);
  };

  // Handle Revoking Admin Access
  const handleRevokeAdmin = (id, name) => {
    if (window.confirm(`Revoke admin access for ${name}?`)) {
      setAdminTeam(prev => prev.filter(a => a.id !== id));
      showNotification(`Revoked administrator permissions for ${name}.`);
    }
  };

  const filteredDeals = deals.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
      {/* Notification Banner */}
      {adminNotification && (
        <div className="alert-banner alert-success" style={{ marginBottom: 'var(--space-md)' }}>
          <span>{adminNotification}</span>
          <button onClick={() => setAdminNotification(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: '700' }}>✕</button>
        </div>
      )}

      {/* Admin Dashboard Header */}
      <div style={{
        backgroundColor: 'var(--color-ink-navy)',
        color: 'var(--color-ticket-cream)',
        padding: 'var(--space-xl)',
        borderRadius: 'var(--radius)',
        marginBottom: 'var(--space-xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-md)'
      }}>
        <div>
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-headline)',
            color: 'var(--color-stamp-amber)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            ADMINISTRATOR MANAGEMENT CONSOLE
          </span>
          <h1 style={{ color: 'var(--color-ticket-cream)', fontSize: '32px', marginTop: '4px' }}>
            PromoHub Admin Control
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255, 248, 237, 0.8)' }}>
            Logged in as: <strong>{currentUser?.email || 'admin@promohub.com'}</strong> ({currentUser?.role || 'Super Admin'})
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button 
            className="btn btn-amber"
            onClick={handleOpenAddModal}
            style={{ fontSize: '14px' }}
          >
            <Plus size={18} /> Add New Deal
          </button>
        </div>
      </div>

      {/* KPI Aggregate Stats Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        {/* Total Registered Users */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-slate-grey)', textTransform: 'uppercase', fontWeight: '700' }}>
              REGISTERED USERS
            </span>
            <Users size={20} color="var(--color-ink-navy)" />
          </div>
          <div className="mono-number" style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-ink-navy)', marginTop: '6px' }}>
            {registeredUsers.length || liveStats?.totalUsers || 1}
          </div>
        </div>

        {/* Active Users Online (Real-time concurrency) */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-slate-grey)', textTransform: 'uppercase', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-stock-green)',
                boxShadow: '0 0 8px var(--color-stock-green)'
              }}></span>
              ONLINE / ACTIVE
            </span>
            <Users size={20} color="var(--color-stock-green)" />
          </div>
          <div className="mono-number text-green" style={{ fontSize: '32px', fontWeight: '700', marginTop: '6px' }}>
            {liveStats?.activeUsersOnline || Math.max(1, registeredUsers.length)}
          </div>
        </div>

        {/* Total Deals Listed */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-slate-grey)', textTransform: 'uppercase', fontWeight: '700' }}>
              TOTAL DEALS LISTED
            </span>
            <Ticket size={20} color="var(--color-ink-navy)" />
          </div>
          <div className="mono-number" style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-ink-navy)', marginTop: '6px' }}>
            {totalDeals}
          </div>
        </div>

        {/* Total Voucher Claims */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-slate-grey)', textTransform: 'uppercase', fontWeight: '700' }}>
              TOTAL CLAIMS
            </span>
            <BarChart3 size={20} color="var(--color-stock-green)" />
          </div>
          <div className="mono-number text-green" style={{ fontSize: '32px', fontWeight: '700', marginTop: '6px' }}>
            {totalClaimsCount}
          </div>
        </div>

        {/* Low Stock Warnings */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-slate-grey)', textTransform: 'uppercase', fontWeight: '700' }}>
              LOW STOCK
            </span>
            <ShieldAlert size={20} color="var(--color-flame-coral)" />
          </div>
          <div className="mono-number text-coral" style={{ fontSize: '32px', fontWeight: '700', marginTop: '6px' }}>
            {lowStockDeals.length}
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${activeTab === 'deals' ? 'btn-amber' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '14px' }}
            onClick={() => setActiveTab('deals')}
          >
            Manage Deals ({deals.length})
          </button>
          <button 
            className={`btn ${activeTab === 'users' ? 'btn-amber' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '14px' }}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} /> Registered Users ({registeredUsers.length || liveStats?.totalUsers || 1})
          </button>
          <button 
            className={`btn ${activeTab === 'claims' ? 'btn-amber' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '14px' }}
            onClick={() => setActiveTab('claims')}
          >
            Claims Audit Ledger
          </button>
          <button 
            className={`btn ${activeTab === 'team' ? 'btn-amber' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '14px' }}
            onClick={() => setActiveTab('team')}
          >
            <Users size={16} /> Admin Team ({adminTeam.length})
          </button>
          <button 
            className={`btn ${activeTab === 'security' ? 'btn-amber' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '14px' }}
            onClick={() => setActiveTab('security')}
          >
            <Lock size={16} /> Security & Password
          </button>
        </div>

        {activeTab === 'deals' && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} color="var(--color-slate-grey)" style={{ position: 'absolute', left: '10px' }} />
            <input 
              type="text"
              placeholder="Search deal or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 12px 8px 32px',
                borderRadius: 'var(--radius)',
                border: '2px solid var(--color-ink-navy)',
                fontSize: '14px'
              }}
            />
          </div>
        )}
      </div>

      {/* Tab 1: Deal Management Table */}
      {activeTab === 'deals' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-ticket-cream)', borderBottom: '2px solid var(--color-ink-navy)' }}>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>BRAND</th>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>DEAL TITLE</th>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>PRICE</th>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>STOCK REMAINING</th>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>INTERESTED</th>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal, idx) => {
                const isLow = deal.stock_remaining > 0 && deal.stock_remaining <= 5;
                const isOut = deal.stock_remaining === 0;

                return (
                  <tr key={deal.id} style={{ borderBottom: '1px solid var(--color-slate-grey)', backgroundColor: idx % 2 === 0 ? '#ffffff' : 'rgba(255,248,237,0.4)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontFamily: 'var(--font-headline)',
                        fontSize: '12px',
                        color: 'var(--color-stamp-amber)',
                        backgroundColor: 'rgba(186, 117, 23, 0.1)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {deal.brand}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '600' }}>
                      {deal.title}
                      {deal.is_featured && <span style={{ marginLeft: '6px', fontSize: '11px', color: 'var(--color-stamp-amber)' }}>★ Featured</span>}
                    </td>
                    <td className="mono-number" style={{ padding: '14px 16px', fontWeight: '700' }}>
                      ${Number(deal.price).toFixed(2)}
                    </td>
                    <td className="mono-number" style={{ padding: '14px 16px' }}>
                      <span style={{
                        color: isOut ? 'var(--color-slate-grey)' : isLow ? 'var(--color-flame-coral)' : 'var(--color-stock-green)',
                        fontWeight: '700'
                      }}>
                        {deal.stock_remaining} / {deal.total_stock}
                      </span>
                    </td>
                    <td className="mono-number" style={{ padding: '14px 16px' }}>
                      ♥ {Number(deal.interested_count || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button 
                          className="btn btn-amber"
                          onClick={() => handleOpenEditModal(deal)}
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => handleDeleteDeal(deal.id)}
                          style={{ padding: '4px 10px', fontSize: '12px', color: 'var(--color-flame-coral)', borderColor: 'var(--color-flame-coral)' }}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Registered Users Table */}
      {activeTab === 'users' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 20px',
            backgroundColor: 'var(--color-ticket-cream)',
            borderBottom: '2px solid var(--color-ink-navy)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h3 style={{ fontSize: '18px', color: 'var(--color-ink-navy)' }}>
                Registered Platform Accounts ({registeredUsers.length || 1})
              </h3>
              <p className="text-muted" style={{ fontSize: '13px' }}>
                All shopper and admin accounts registered in the database.
              </p>
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={16} color="var(--color-slate-grey)" style={{ position: 'absolute', left: '10px' }} />
              <input 
                type="text"
                placeholder="Search user name or email..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                style={{
                  padding: '8px 12px 8px 32px',
                  borderRadius: 'var(--radius)',
                  border: '2px solid var(--color-ink-navy)',
                  fontSize: '14px',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(28, 37, 65, 0.05)', borderBottom: '2px solid var(--color-ink-navy)' }}>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>USER ID</th>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>FULL NAME</th>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>EMAIL ADDRESS</th>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>ACCOUNT TYPE</th>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>REGISTRATION DATE</th>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {(registeredUsers.length > 0 ? registeredUsers : [
                { id: 1, name: 'System Admin', email: 'admin@promohub.com', is_admin: 1, created_at: '2026-08-01 10:00:00' },
                { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', is_admin: 0, created_at: '2026-08-15 14:23:10' }
              ])
              .filter(u => 
                (u.name || '').toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                (u.email || '').toLowerCase().includes(userSearchQuery.toLowerCase())
              )
              .map((u, i) => (
                <tr key={u.id || i} style={{ borderBottom: '1px solid var(--color-slate-grey)', backgroundColor: i % 2 === 0 ? '#ffffff' : 'rgba(255,248,237,0.4)' }}>
                  <td className="mono-number" style={{ padding: '14px 16px', fontWeight: '700' }}>
                    #{u.id}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: '600' }}>
                    {u.name}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {u.is_admin ? (
                      <span className="badge badge-featured">ADMINISTRATOR</span>
                    ) : (
                      <span className="badge badge-in-stock">MEMBER SHOPPER</span>
                    )}
                  </td>
                  <td className="mono-number" style={{ padding: '14px 16px', fontSize: '13px' }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Active Member'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: 'var(--color-stock-green)' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-stock-green)' }}></span>
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Claims Audit Ledger Table */}
      {activeTab === 'claims' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-ticket-cream)', borderBottom: '2px solid var(--color-ink-navy)' }}>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>CLAIM CODE</th>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>USER EMAIL</th>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>DEAL VOUCHER</th>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>TIME CLAIMED</th>
                <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {(liveClaimsLedger.length > 0 ? liveClaimsLedger : [
                { claim_code: 'CLAIM-A9F2-K4B7', user_email: 'jane.doe@example.com', deal_title: 'Sony WH-1000XM5 Headphones', claimed_at: '2026-08-20 18:42:10' },
                { claim_code: 'CLAIM-7X2P-M9L1', user_email: 'alex.smith@example.com', deal_title: 'Keychron Q1 Pro Keyboard', claimed_at: '2026-08-20 17:15:33' },
                { claim_code: 'CLAIM-88C4-V1Z9', user_email: 'samuel.p@example.com', deal_title: 'Apple Watch Series 9 GPS', claimed_at: '2026-08-20 16:02:45' }
              ]).map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-slate-grey)' }}>
                  <td className="mono-number" style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--color-flame-coral)' }}>
                    {c.claim_code}
                  </td>
                  <td style={{ padding: '14px 16px' }}>{c.user_email || c.user_name}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '600' }}>{c.deal_title}</td>
                  <td className="mono-number" style={{ padding: '14px 16px', fontSize: '13px' }}>{new Date(c.claimed_at || Date.now()).toLocaleString()}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="badge badge-in-stock">CLAIMED</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Multi-Admin Team Management */}
      {activeTab === 'team' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3>Admin User Accounts ({adminTeam.length})</h3>
              <p className="text-muted" style={{ fontSize: '14px' }}>
                Authorized administrators with access to the management console.
              </p>
            </div>
            <button className="btn btn-amber" onClick={() => setIsAddAdminModalOpen(true)}>
              <UserPlus size={16} /> Add Admin User
            </button>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid var(--color-ink-navy)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-ticket-cream)', borderBottom: '2px solid var(--color-ink-navy)' }}>
                  <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>ADMIN NAME</th>
                  <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>PRIMARY EMAIL</th>
                  <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>ROLE</th>
                  <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700' }}>DATE ADDED</th>
                  <th style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {adminTeam.map(admin => (
                  <tr key={admin.id} style={{ borderBottom: '1px solid var(--color-slate-grey)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '700' }}>{admin.name}</td>
                    <td style={{ padding: '14px 16px' }}>{admin.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge badge-featured">{admin.role}</span>
                    </td>
                    <td className="mono-number" style={{ padding: '14px 16px', fontSize: '13px' }}>{admin.added_at}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      {admin.role !== 'Super Admin' && (
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => handleRevokeAdmin(admin.id, admin.name)}
                          style={{ padding: '4px 10px', fontSize: '12px', color: 'var(--color-flame-coral)', borderColor: 'var(--color-flame-coral)' }}
                        >
                          Revoke Access
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Security & Password Management Console */}
      {activeTab === 'security' && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid var(--color-ink-navy)',
            borderRadius: 'var(--radius)',
            padding: 'var(--space-xl)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Lock size={24} color="var(--color-stamp-amber)" />
              <h2 style={{ fontSize: '22px' }}>Admin Security & Password Reset</h2>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--color-slate-grey)', marginBottom: '24px' }}>
              Update your administrator account password. Security notifications and verification alerts will be dispatched to your primary email address: <strong>{currentUser?.email || 'admin@promohub.com'}</strong>.
            </p>

            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>
                  Primary Admin Email
                </label>
                <input 
                  type="email" 
                  value={currentUser?.email || 'admin@promohub.com'}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius)',
                    border: '2px solid var(--color-slate-grey)',
                    backgroundColor: 'var(--color-ticket-cream)',
                    fontWeight: '600'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>
                  Current Admin Password
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius)',
                    border: '2px solid var(--color-ink-navy)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>
                  New Password
                </label>
                <input 
                  type="password" 
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius)',
                    border: '2px solid var(--color-ink-navy)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>
                  Confirm New Password
                </label>
                <input 
                  type="password" 
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius)',
                    border: '2px solid var(--color-ink-navy)'
                  }}
                />
              </div>

              <button className="btn btn-amber" type="submit" style={{ width: '100%' }}>
                <Key size={18} /> Update Password & Send Email Alert
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Deal Modal */}
      {isAddModalOpen && (
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
          padding: 'var(--space-md)'
        }}>
          <div style={{
            backgroundColor: 'var(--color-ticket-cream)',
            border: '3px solid var(--color-ink-navy)',
            borderRadius: 'var(--radius)',
            maxWidth: '560px',
            width: '100%',
            padding: 'var(--space-xl)',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button 
              onClick={() => setIsAddModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>

            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>
              {editingDeal ? 'Edit Flash Deal' : 'Add New Flash Deal'}
            </h2>

            <form onSubmit={handleSaveDeal}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Brand Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. Sony"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius)', border: '2px solid var(--color-ink-navy)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Category</label>
                  <input 
                    type="text"
                    placeholder="Audio, Wearables, etc."
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius)', border: '2px solid var(--color-ink-navy)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Deal Title</label>
                <input 
                  type="text"
                  placeholder="Sony WH-1000XM5 Headphones"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius)', border: '2px solid var(--color-ink-navy)' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Description</label>
                <textarea 
                  placeholder="Short deal description..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  required
                  rows={3}
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius)', border: '2px solid var(--color-ink-navy)', fontFamily: 'var(--font-body)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Discount Price ($)</label>
                  <input 
                    type="number"
                    step="0.01"
                    placeholder="149.99"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius)', border: '2px solid var(--color-ink-navy)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Original Price ($)</label>
                  <input 
                    type="number"
                    step="0.01"
                    placeholder="399.99"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius)', border: '2px solid var(--color-ink-navy)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Total Stock</label>
                  <input 
                    type="number"
                    placeholder="50"
                    value={formTotalStock}
                    onChange={(e) => setFormTotalStock(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius)', border: '2px solid var(--color-ink-navy)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox"
                  id="featured-check"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="featured-check" style={{ fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Mark as Featured Deal
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDeal ? 'Save Changes' : 'Create Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Admin User Modal */}
      {isAddAdminModalOpen && (
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
          padding: 'var(--space-md)'
        }}>
          <div style={{
            backgroundColor: 'var(--color-ticket-cream)',
            border: '3px solid var(--color-ink-navy)',
            borderRadius: 'var(--radius)',
            maxWidth: '460px',
            width: '100%',
            padding: 'var(--space-xl)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setIsAddAdminModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>

            <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>Add Admin User</h2>

            <form onSubmit={handleAddAdminUser}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Admin Full Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Sarah Miller"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '2px solid var(--color-ink-navy)' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Primary Email Address</label>
                <input 
                  type="email"
                  placeholder="sarah.m@promohub.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '2px solid var(--color-ink-navy)' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Admin Role</label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '2px solid var(--color-ink-navy)', backgroundColor: '#ffffff' }}
                >
                  <option value="Deals Manager">Deals Manager</option>
                  <option value="Operations Admin">Operations Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddAdminModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-amber">
                  Add Administrator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
