import { query } from '../db/index.js';

export const createClaimRecord = async (userId, dealId, claimCode) => {
  const sql = `
    INSERT INTO claims (user_id, deal_id, claim_code)
    VALUES ($1, $2, $3)
  `;
  const result = await query(sql, [userId, dealId, claimCode]);
  return { id: result.lastID || result.rows[0]?.id, user_id: userId, deal_id: dealId, claim_code: claimCode };
};

export const getUserClaims = async (userId) => {
  const sql = `
    SELECT c.id, c.claim_code, c.claimed_at, d.title as deal_title, d.brand, d.price, d.original_price, d.category
    FROM claims c
    JOIN deals d ON c.deal_id = d.id
    WHERE c.user_id = $1
    ORDER BY c.claimed_at DESC
  `;
  const result = await query(sql, [userId]);
  return result.rows;
};

export const getAllClaimsLedger = async () => {
  const sql = `
    SELECT c.id, c.claim_code, c.claimed_at, u.name as user_name, u.email as user_email, d.title as deal_title, d.brand
    FROM claims c
    JOIN users u ON c.user_id = u.id
    JOIN deals d ON c.deal_id = d.id
    ORDER BY c.claimed_at DESC
  `;
  const result = await query(sql);
  return result.rows;
};
