import { createDeal, updateDeal, deleteDeal, getAllDeals } from '../models/dealModel.js';
import { getAllClaimsLedger } from '../models/claimModel.js';

export const adminAddDeal = async (req, res) => {
  try {
    const { brand, title, description, category, price, original_price, total_stock, end_time, is_featured } = req.body;

    if (!brand || !title || !description || !price || !total_stock || !end_time) {
      return res.status(400).json({ error: 'Brand, title, description, price, total_stock, and end_time are required.' });
    }

    const deal = await createDeal({
      brand,
      title,
      description,
      category,
      price: parseFloat(price),
      original_price: original_price ? parseFloat(original_price) : parseFloat(price) * 2,
      total_stock: parseInt(total_stock, 10),
      end_time,
      is_featured
    });

    return res.status(201).json({ message: 'Deal created successfully', deal });
  } catch (err) {
    console.error('Admin add deal error:', err);
    return res.status(500).json({ error: 'Server error creating deal.' });
  }
};

export const adminUpdateDeal = async (req, res) => {
  try {
    const dealId = req.params.id;
    const deal = await updateDeal(dealId, req.body);
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found.' });
    }
    return res.json({ message: 'Deal updated successfully', deal });
  } catch (err) {
    console.error('Admin update deal error:', err);
    return res.status(500).json({ error: 'Server error updating deal.' });
  }
};

export const adminDeleteDeal = async (req, res) => {
  try {
    const dealId = req.params.id;
    const success = await deleteDeal(dealId);
    if (!success) {
      return res.status(404).json({ error: 'Deal not found.' });
    }
    return res.json({ message: 'Deal deleted successfully' });
  } catch (err) {
    console.error('Admin delete deal error:', err);
    return res.status(500).json({ error: 'Server error deleting deal.' });
  }
};

export const adminGetClaims = async (req, res) => {
  try {
    const claims = await getAllClaimsLedger();
    return res.json(claims);
  } catch (err) {
    console.error('Admin get claims error:', err);
    return res.status(500).json({ error: 'Server error fetching claims audit log.' });
  }
};

export const adminGetStats = async (req, res) => {
  try {
    const deals = await getAllDeals();
    const claims = await getAllClaimsLedger();

    const lowStockCount = deals.filter(d => d.stock_remaining > 0 && d.stock_remaining <= 5).length;
    const mostPopular = deals.reduce((max, d) => (d.interested_count > (max?.interested_count || 0) ? d : max), deals[0]);

    return res.json({
      totalDeals: deals.length,
      totalClaims: claims.length,
      lowStockWarnings: lowStockCount,
      mostPopularDeal: mostPopular ? { brand: mostPopular.brand, title: mostPopular.title, interested: mostPopular.interested_count } : null
    });
  } catch (err) {
    console.error('Admin get stats error:', err);
    return res.status(500).json({ error: 'Server error fetching admin stats.' });
  }
};
