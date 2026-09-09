import { query } from '../db/index.js';
import bcrypt from 'bcryptjs';

export const createUser = async ({ name, email, password, is_admin = false }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = `
    INSERT INTO users (name, email, password, is_admin)
    VALUES ($1, $2, $3, $4)
  `;
  const result = await query(sql, [name, email.toLowerCase(), hashedPassword, is_admin ? 1 : 0]);
  return { id: result.lastID || result.rows[0]?.id, name, email: email.toLowerCase(), is_admin };
};

export const findUserByEmail = async (email) => {
  const sql = `SELECT * FROM users WHERE email = $1`;
  const result = await query(sql, [email.toLowerCase()]);
  return result.rows[0] || null;
};

export const findUserById = async (id) => {
  const sql = `SELECT id, name, email, is_admin, created_at FROM users WHERE id = $1`;
  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

export const getAllUsers = async () => {
  const sql = `SELECT id, name, email, is_admin, created_at FROM users ORDER BY id DESC`;
  const result = await query(sql);
  return result.rows;
};

export const getUserCount = async () => {
  const sql = `SELECT COUNT(*) as count FROM users`;
  const result = await query(sql);
  return parseInt(result.rows[0]?.count || 0, 10);
};
