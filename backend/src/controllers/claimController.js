import { getUserClaims } from '../models/claimModel.js';

export const getMyClaims = async (req, res) => {
  try {
    const claims = await getUserClaims(req.user.id);
    return res.json(claims);
  } catch (err) {
    console.error('Get my claims error:', err);
    return res.status(500).json({ error: 'Server error fetching user claims.' });
  }
};
