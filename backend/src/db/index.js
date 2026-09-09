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

// Construct PostgreSQL connection string from DATABASE_URL or individual DB_* variables
const pgConnectionString = process.env.DATABASE_URL || (
  process.env.DB_HOST && process.env.DB_USER
    ? `postgres://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD || '')}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'promohub'}`
    : null
);

// Default Admin Seeding Password (configurable via ADMIN_PASSWORD env var)
const DEFAULT_ADMIN_PW = process.env.ADMIN_PASSWORD || 'admin123';

if (pgConnectionString) {
  console.log('🔗 Connecting to PostgreSQL Database...');
  const pool = new Pool({
    connectionString: pgConnectionString,
    ssl: process.env.NODE_ENV === 'production' && !process.env.DB_HOST ? { rejectUnauthorized: false } : false
  });

  queryFn = (text, params) => pool.query(text, params);
  isPostgres = true;

  // Initialize PostgreSQL Schema & Seed Data asynchronously
  (async () => {
    try {
      // 1. Create Tables
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          is_admin BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS deals (
          id SERIAL PRIMARY KEY,
          brand VARCHAR(100) NOT NULL,
          title VARCHAR(200) NOT NULL,
          description TEXT NOT NULL,
          category VARCHAR(50) DEFAULT 'Flash Sale',
          price DECIMAL(10, 2) NOT NULL,
          original_price DECIMAL(10, 2),
          total_stock INT NOT NULL,
          stock_remaining INT NOT NULL,
          start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          end_time TIMESTAMP NOT NULL,
          is_featured BOOLEAN DEFAULT FALSE,
          interested_count INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS claims (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          deal_id INT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
          claim_code VARCHAR(50) UNIQUE NOT NULL,
          claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 2. Seed Default Admin User if not exists
      const adminCheck = await pool.query(`SELECT * FROM users WHERE email = $1`, ['admin@promohub.com']);
      if (adminCheck.rows.length === 0) {
        const hashedAdminPw = await bcrypt.hash(DEFAULT_ADMIN_PW, 10);
        await pool.query(
          `INSERT INTO users (name, email, password, is_admin) VALUES ($1, $2, $3, $4)`,
          ['System Admin', 'admin@promohub.com', hashedAdminPw, true]
        );
        console.log('✅ PostgreSQL: Seeded default Admin user (admin@promohub.com)');
      }

      // 3. Seed Default Deals catalog if empty
      const dealsCheck = await pool.query(`SELECT COUNT(*) as count FROM deals`);
      if (parseInt(dealsCheck.rows[0].count, 10) === 0) {
        const eventEndTime = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
        const sampleDeals = [
          ['Sony', 'Sony WH-1000XM5 Wireless Headphones', 'Industry-leading noise canceling headphones with 30h battery.', 'Audio', 149.99, 399.99, 50, 3, eventEndTime, true, 2480],
          ['Apple', 'Apple Watch Series 9 GPS 45mm', 'Always-on Retina display with S9 chip and health tracking.', 'Wearables', 199.00, 429.00, 30, 5, eventEndTime, true, 4120],
          ['Keychron', 'Keychron Q1 Pro Wireless Keyboard', 'Full-aluminum mechanical keyboard with RGB backlight.', 'Peripherals', 69.50, 199.00, 100, 42, eventEndTime, true, 1890],
          ['Anker', 'Anker 737 Power Bank (PowerCore 24K)', '24,000mAh 140W fast portable charger with display.', 'Accessories', 49.99, 149.99, 80, 18, eventEndTime, false, 3210],
          ['Samsung', 'Samsung T7 Shield 2TB Portable SSD', 'Rugged external SSD with 1,050MB/s read speeds.', 'Storage', 79.99, 219.99, 40, 2, eventEndTime, true, 1560]
        ];

        for (const d of sampleDeals) {
          await pool.query(`
            INSERT INTO deals (brand, title, description, category, price, original_price, total_stock, stock_remaining, end_time, is_featured, interested_count)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, d);
        }
        console.log('✅ PostgreSQL: Seeded 5 initial product deals catalog');
      }
    } catch (err) {
      console.error('❌ PostgreSQL Schema Initialization Error:', err);
    }
  })();

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
    const hashedAdminPw = await bcrypt.hash(DEFAULT_ADMIN_PW, 10);
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
