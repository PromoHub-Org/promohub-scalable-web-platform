import React, { useState } from 'react';
import { 
  BarChart3, Plus, Edit2, Trash2, ShieldAlert, Ticket, Users, 
  Search, X, CheckCircle, AlertTriangle, Clock, RefreshCw, Flame, ArrowUpRight
} from 'lucide-react';
import { EVENT_START_DATE } from '../mockData/deals';

export default function AdminDashboard({ deals, setDeals, userClaims = [] }) {
  const [activeTab, setActiveTab] = useState('deals'); // 'deals', 'claims', 'analytics'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form fields state for Add/Edit deal
  const [formBrand, setFormBrand] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Electronics');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formTotalStock, setFormTotalStock] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  // Stats calculation
  const totalDeals = deals.length;
  const totalClaimsCount = 142 + userClaims.length;
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

  // Handle Save (Add or Update deal)
  const handleSaveDeal = (e) => {
    e.preventDefault();
    const priceNum = parseFloat(formPrice);
    const origPriceNum = formOriginalPrice ? parseFloat(formOriginalPrice) : priceNum * 2;
    const stockNum = parseInt(formTotalStock, 10);

    if (editingDeal) {
      // Update existing deal
      setDeals(prev => prev.map(d => {
        if (d.id === editingDeal.id) {
          return {
            ...d,
            brand: formBrand,
            title: formTitle,
            description: formDescription,
            category: formCategory,
            price: priceNum,
            original_price: origPriceNum,
            total_stock: stockNum,
            stock_remaining: Math.min(d.stock_remaining, stockNum),
            is_featured: formIsFeatured
          };
        }
        return d;
      }));
    } else {
      // Add new deal
      const newDeal = {
        id: Date.now(),
        brand: formBrand,
        title: formTitle,
        description: formDescription,
        category: formCategory,
        price: priceNum,
        original_price: origPriceNum,
        total_stock: stockNum,
        stock_remaining: stockNum,
        start_time: new Date().toISOString(),
        end_time: EVENT_START_DATE,
        is_featured: formIsFeatured,
        interested_count: 0,
        is_interested: false
      };
      setDeals(prev => [newDeal, ...prev]);
    }

    setIsAddModalOpen(false);
  };

  // Handle Delete deal
  const handleDeleteDeal = (id) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      setDeals(prev => prev.filter(d => d.id !== id));
    }
  };

  const filteredDeals = deals.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
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
          <div className="mono-number" style={{ fontSize: '36px', fontWeight: '700', color: 'var(--color-ink-navy)', marginTop: '6px' }}>
            {totalDeals}
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-slate-grey)', textTransform: 'uppercase', fontWeight: '700' }}>
              TOTAL VOUCHER CLAIMS
            </span>
            <BarChart3 size={20} color="var(--color-stock-green)" />
          </div>
          <div className="mono-number text-green" style={{ fontSize: '36px', fontWeight: '700', marginTop: '6px' }}>
            {totalClaimsCount}
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-slate-grey)', textTransform: 'uppercase', fontWeight: '700' }}>
              LOW STOCK WARNINGS
            </span>
            <ShieldAlert size={20} color="var(--color-flame-coral)" />
          </div>
          <div className="mono-number text-coral" style={{ fontSize: '36px', fontWeight: '700', marginTop: '6px' }}>
            {lowStockDeals.length}
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-ink-navy)',
          borderRadius: 'var(--radius)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-slate-grey)', textTransform: 'uppercase', fontWeight: '700' }}>
              MOST POPULAR BRAND
            </span>
            <Flame size={20} color="var(--color-stamp-amber)" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-ink-navy)', marginTop: '8px' }}>
            {mostPopularDeal ? `${mostPopularDeal.brand}` : 'N/A'}
          </div>
          <span className="mono-number" style={{ fontSize: '12px', color: 'var(--color-slate-grey)' }}>
            {mostPopularDeal ? `${mostPopularDeal.interested_count} Interested` : ''}
          </span>
        </div>
      </div>

      {/* Admin Tab Switcher & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn ${activeTab === 'deals' ? 'btn-amber' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '14px' }}
            onClick={() => setActiveTab('deals')}
          >
            Manage Deals ({deals.length})
          </button>
          <button 
            className={`btn ${activeTab === 'claims' ? 'btn-amber' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '14px' }}
            onClick={() => setActiveTab('claims')}
          >
            Claims Audit Ledger ({totalClaimsCount})
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
                      ${deal.price.toFixed(2)}
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
                      ♥ {deal.interested_count.toLocaleString()}
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
              {[
                { code: 'CLAIM-A9F2-K4B7', user: 'jane.doe@example.com', deal: 'Sony WH-1000XM5 Headphones', time: '2026-08-20 18:42:10' },
                { code: 'CLAIM-7X2P-M9L1', user: 'alex.smith@example.com', deal: 'Keychron Q1 Pro Keyboard', time: '2026-08-20 17:15:33' },
                { code: 'CLAIM-88C4-V1Z9', user: 'samuel.p@example.com', deal: 'Apple Watch Series 9 GPS', time: '2026-08-20 16:02:45' },
                { code: 'CLAIM-39B1-W5T0', user: 'michael.k@example.com', deal: 'Anker 737 Power Bank', time: '2026-08-20 15:20:11' }
              ].map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-slate-grey)' }}>
                  <td className="mono-number" style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--color-flame-coral)' }}>
                    {c.code}
                  </td>
                  <td style={{ padding: '14px 16px' }}>{c.user}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '600' }}>{c.deal}</td>
                  <td className="mono-number" style={{ padding: '14px 16px', fontSize: '13px' }}>{c.time}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="badge badge-in-stock">CLAIMED</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}
