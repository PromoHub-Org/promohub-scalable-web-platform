import React, { useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import TicketCard from '../components/TicketCard';
import ClaimModal from '../components/ClaimModal';
import { Flame, AlertTriangle, CheckCircle, Search, Filter, RefreshCw, Heart } from 'lucide-react';

export default function DealsList({ deals, setDeals, onViewDetail, onToggleInterest }) {
  const [filter, setFilter] = useState('all'); // 'all', 'low-stock', 'available', 'featured'
  const [brandFilter, setBrandFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDealForClaim, setSelectedDealForClaim] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Extract unique brands for brand filter
  const brands = ['all', ...new Set(deals.map(d => d.brand))];

  // Handle claiming a deal (atomically reduce stock in state)
  const handleClaimSuccess = (dealId) => {
    setDeals(prevDeals => 
      prevDeals.map(d => {
        if (d.id === dealId && d.stock_remaining > 0) {
          const updatedStock = d.stock_remaining - 1;
          showToast(`Successfully claimed 1 voucher for "${d.brand} — ${d.title}"! Vouchers remaining: ${updatedStock}`);
          return { ...d, stock_remaining: updatedStock };
        }
        return d;
      })
    );
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter logic
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          deal.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          deal.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (brandFilter !== 'all' && deal.brand.toLowerCase() !== brandFilter.toLowerCase()) return false;

    if (filter === 'low-stock') return deal.stock_remaining > 0 && deal.stock_remaining <= 5;
    if (filter === 'available') return deal.stock_remaining > 0;
    if (filter === 'featured') return deal.is_featured;
    return true;
  });

  const totalInterested = deals.reduce((acc, d) => acc + d.interested_count, 0);
  const activeCount = deals.filter(d => d.stock_remaining > 0).length;
  const lowStockCount = deals.filter(d => d.stock_remaining > 0 && d.stock_remaining <= 5).length;

  return (
    <div>
      {/* Hero Section with Master D-Day Event Countdown */}
      <HeroBanner totalDeals={deals.length} totalInterestedCount={totalInterested} />

      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="alert-banner alert-success">
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: '700' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="section-header" style={{ flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <h2>Product Voucher Drops</h2>
          <p className="text-muted" style={{ fontSize: '14px' }}>
            Click the heart to indicate interest for D-Day, or click "CLAIM DEAL" to reserve available vouchers now.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={16} color="var(--color-slate-grey)" style={{ position: 'absolute', left: '10px' }} />
            <input 
              type="text"
              placeholder="Search brand or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 12px 8px 32px',
                borderRadius: 'var(--radius)',
                border: '2px solid var(--color-ink-navy)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                backgroundColor: '#ffffff'
              }}
            />
          </div>

          {/* Brand Filter Selector */}
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius)',
              border: '2px solid var(--color-ink-navy)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Brands</option>
            {brands.filter(b => b !== 'all').map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'rgba(28,37,65,0.06)', padding: '4px', borderRadius: 'var(--radius)' }}>
            <button 
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 12px', fontSize: '13px', border: 'none' }}
              onClick={() => setFilter('all')}
            >
              All ({deals.length})
            </button>
            <button 
              className={`btn ${filter === 'low-stock' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 12px', fontSize: '13px', border: 'none' }}
              onClick={() => setFilter('low-stock')}
            >
              <AlertTriangle size={14} /> Low Stock ({lowStockCount})
            </button>
            <button 
              className={`btn ${filter === 'featured' ? 'btn-amber' : 'btn-secondary'}`}
              style={{ padding: '6px 12px', fontSize: '13px', border: 'none' }}
              onClick={() => setFilter('featured')}
            >
              Featured
            </button>
          </div>
        </div>
      </div>

      {/* Deals List Feed */}
      <div className="deals-grid">
        {filteredDeals.length > 0 ? (
          filteredDeals.map(deal => (
            <TicketCard 
              key={deal.id}
              deal={deal}
              onClaim={(d) => setSelectedDealForClaim(d)}
              onViewDetail={onViewDetail}
              onToggleInterest={onToggleInterest}
            />
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-2xl)',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius)',
            border: '2px dashed var(--color-ink-navy)'
          }}>
            <Flame size={40} color="var(--color-slate-grey)" style={{ marginBottom: '12px' }} />
            <h3>No Products Found</h3>
            <p className="text-muted">Try clearing your search query, brand filter, or status tab.</p>
            <button 
              className="btn btn-secondary" 
              style={{ marginTop: '16px' }}
              onClick={() => { setFilter('all'); setBrandFilter('all'); setSearchQuery(''); }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Interactive Claim Voucher Modal */}
      {selectedDealForClaim && (
        <ClaimModal 
          deal={selectedDealForClaim}
          onClose={() => setSelectedDealForClaim(null)}
          onConfirmClaim={handleClaimSuccess}
        />
      )}
    </div>
  );
}
