import pg from 'pg';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let queryFn;
let isPostgres = false;

// Check if PostgreSQL connection URL is provided
if (process.env.DATABASE_URL) {
  console.log('🔗 Connecting to PostgreSQL Database...');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  queryFn = (text, params) => pool.query(text, params);
  isPostgres = true;
} else {
  console.log('⚡ Using Local SQLite Fallback Database (backend/promohub.db)');
  const dbPath = path.join(__dirname, '../../promohub.db');
  const sqliteDb = new sqlite3.Database(dbPath);

  // Initialize SQLite tables & seed data asynchronously
  sqliteDb.serialize(async () => {
    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS deals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT DEFAULT 'Flash Sale',
        price REAL NOT NULL,
        original_price REAL,
        total_stock INTEGER NOT NULL,
        stock_remaining INTEGER NOT NULL,
        start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        end_time DATETIME NOT NULL,
        is_featured INTEGER DEFAULT 0,
        interested_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS claims (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        deal_id INTEGER NOT NULL,
        claim_code TEXT UNIQUE NOT NULL,
        claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (deal_id) REFERENCES deals(id)
      )
    `);

    // Seed default Admin User if not exists
    const hashedAdminPw = await bcrypt.hash('admin123', 10);
    sqliteDb.run(
      `INSERT OR IGNORE INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)`,
      ['System Admin', 'admin@promohub.com', hashedAdminPw, 1]
    );

    // Seed default Deals catalog if empty
    sqliteDb.get(`SELECT COUNT(*) as count FROM deals`, [], async (err, row) => {
      if (!err && row.count === 0) {
        const eventEndTime = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
        const sampleDeals = [
          ['Sony', 'Sony WH-1000XM5 Wireless Headphones', 'Industry-leading noise canceling headphones with 30h battery.', 'Audio', 149.99, 399.99, 50, 3, eventEndTime, 1, 2480],
          ['Apple', 'Apple Watch Series 9 GPS 45mm', 'Always-on Retina display with S9 chip and health tracking.', 'Wearables', 199.00, 429.00, 30, 5, eventEndTime, 1, 4120],
          ['Keychron', 'Keychron Q1 Pro Wireless Keyboard', 'Full-aluminum mechanical keyboard with RGB backlight.', 'Peripherals', 69.50, 199.00, 100, 42, eventEndTime, 1, 1890],
          ['Anker', 'Anker 737 Power Bank (PowerCore 24K)', '24,000mAh 140W fast portable charger with display.', 'Accessories', 49.99, 149.99, 80, 18, eventEndTime, 0, 3210],
          ['Samsung', 'Samsung T7 Shield 2TB Portable SSD', 'Rugged external SSD with 1,050MB/s read speeds.', 'Storage', 79.99, 219.99, 40, 2, eventEndTime, 1, 1560]
        ];

        const stmt = sqliteDb.prepare(`
          INSERT INTO deals (brand, title, description, category, price, original_price, total_stock, stock_remaining, end_time, is_featured, interested_count)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        sampleDeals.forEach(d => stmt.run(d));
        stmt.finalize();
      }
    });
  });

  queryFn = (text, params = []) => {
    return new Promise((resolve, reject) => {
      // Convert $1, $2 Postgres placeholders to ? for SQLite
      let sqliteText = text;
      let paramIdx = 1;
      while (sqliteText.includes(`$${paramIdx}`)) {
        sqliteText = sqliteText.replace(`$${paramIdx}`, '?');
        paramIdx++;
      }

      if (sqliteText.trim().toUpperCase().startsWith('SELECT')) {
        sqliteDb.all(sqliteText, params, (err, rows) => {
          if (err) reject(err);
          else resolve({ rows, rowCount: rows.length });
        });
      } else {
        sqliteDb.run(sqliteText, params, function(err) {
          if (err) reject(err);
          else resolve({ rows: [{ id: this.lastID }], rowCount: this.changes, lastID: this.lastID });
        });
      }
    });
  };
}

export const query = (text, params) => queryFn(text, params);
export const isPostgresDb = isPostgres;
