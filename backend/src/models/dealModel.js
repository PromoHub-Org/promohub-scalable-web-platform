import { query } from '../db/index.js';

export const getAllDeals = async () => {
  const sql = `SELECT * FROM deals ORDER BY is_featured DESC, id DESC`;
  const result = await query(sql);
  return result.rows;
};

export const getDealById = async (id) => {
  const sql = `SELECT * FROM deals WHERE id = $1`;
  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

/**
 * ATOMIC CONCURRENCY STOCK REDUCTION
 * Atomically validates and decrements stock in a single SQL operation.
 * Guarantees zero over-selling under high concurrent load.
 */
export const claimDealAtomic = async (dealId) => {
  const sql = `
    UPDATE deals
    SET stock_remaining = stock_remaining - 1
    WHERE id = $1 AND stock_remaining > 0
  `;
  const result = await query(sql, [dealId]);
  
  // Check if stock was successfully decremented (rowCount > 0)
  if (result.rowCount === 0) {
    return null; // Sold out or invalid deal
  }

  // Fetch updated deal state
  return await getDealById(dealId);
};

export const createDeal = async (deal) => {
  const sql = `
    INSERT INTO deals (brand, title, description, category, price, original_price, total_stock, stock_remaining, end_time, is_featured, interested_count)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  `;
  const params = [
    deal.brand,
    deal.title,
    deal.description,
    deal.category || 'Flash Sale',
    deal.price,
    deal.original_price || deal.price * 2,
    deal.total_stock,
    deal.total_stock, // Initial remaining stock equals total
    deal.end_time,
    deal.is_featured ? 1 : 0,
    deal.interested_count || 0
  ];

  const result = await query(sql, params);
  const newId = result.lastID || result.rows[0]?.id;
  return await getDealById(newId);
};

export const updateDeal = async (id, deal) => {
  const sql = `
    UPDATE deals
    SET brand = $1, title = $2, description = $3, category = $4, price = $5, original_price = $6, total_stock = $7, is_featured = $8
    WHERE id = $9
  `;
  const params = [
    deal.brand,
    deal.title,
    deal.description,
    deal.category,
    deal.price,
    deal.original_price,
    deal.total_stock,
    deal.is_featured ? 1 : 0,
    id
  ];

  await query(sql, params);
  return await getDealById(id);
};

export const deleteDeal = async (id) => {
  const sql = `DELETE FROM deals WHERE id = $1`;
  const result = await query(sql, [id]);
  return result.rowCount > 0;
};
