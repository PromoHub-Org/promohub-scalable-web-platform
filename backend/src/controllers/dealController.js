import { getAllDeals, getDealById, claimDealAtomic } from '../models/dealModel.js';
import { createClaimRecord } from '../models/claimModel.js';

export const getDeals = async (req, res) => {
  try {
    const deals = await getAllDeals();
    return res.json(deals);
  } catch (err) {
    console.error('Get deals error:', err);
    return res.status(500).json({ error: 'Server error fetching deals.' });
  }
};

export const getSingleDeal = async (req, res) => {
  try {
    const deal = await getDealById(req.params.id);
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found.' });
    }
    return res.json(deal);
  } catch (err) {
    console.error('Get deal error:', err);
    return res.status(500).json({ error: 'Server error fetching deal.' });
  }
};

/**
 * ATOMIC CLAIM ENDPOINT
 * Handles high-concurrency stock checks and reservations in a single safe SQL step.
 */
export const claimDeal = async (req, res) => {
  try {
    const dealId = req.params.id;
    const userId = req.user.id;

    // Execute single-step atomic stock reduction
    const updatedDeal = await claimDealAtomic(dealId);

    if (!updatedDeal) {
      return res.status(400).json({ error: 'Deal is sold out or unavailable.' });
    }

    // Generate unique alphanumeric claim code
    const randomCode = 'CLAIM-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    // Save claim voucher in database ledger
    const claimRecord = await createClaimRecord(userId, dealId, randomCode);

    return res.json({
      message: 'Voucher claimed successfully!',
      claimCode: randomCode,
      deal: updatedDeal,
      claimedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Claim deal error:', err);
    return res.status(500).json({ error: 'Server error claiming deal.' });
  }
};
