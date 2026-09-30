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

      // 3. Seed Default Deals catalog (20 deals)
      const dealsCheck = await pool.query(`SELECT COUNT(*) as count FROM deals`);
      const eventEndTime = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

      // Ensure any existing deals have active future countdowns
      await pool.query(`UPDATE deals SET end_time = $1 WHERE end_time <= CURRENT_TIMESTAMP`, [eventEndTime]);

      if (parseInt(dealsCheck.rows[0].count, 10) < 20) {
        // Clear previous partial seeds if fewer than 20
        await pool.query(`DELETE FROM deals`);
        const sampleDeals = [
          ['Sony', 'Sony WH-1000XM5 Wireless Headphones', 'Industry-leading noise canceling headphones with dual processors, 8 microphones, and 30-hour battery.', 'Audio', 149.99, 399.99, 50, 50, eventEndTime, true, 1080],
          ['Apple', 'Apple Watch Series 9 GPS 45mm', 'Always-on Retina display, S9 SiP chip, double tap gesture, and comprehensive health monitoring.', 'Wearables', 199.00, 429.00, 30, 30, eventEndTime, true, 420],
          ['Keychron', 'Keychron Q1 Pro Wireless Mechanical Keyboard', 'Custom QMK/VIA full-aluminum hot-swappable keyboard with double-gasket design and RGB backlight.', 'Peripherals', 69.50, 199.00, 100, 100, eventEndTime, true, 890],
          ['Anker', 'Anker 737 Power Bank (PowerCore 24K)', '24,000mAh 140W 3-port ultra-fast portable charger with smart digital display.', 'Accessories', 49.99, 149.99, 80, 80, eventEndTime, false, 510],
          ['Samsung', 'Samsung T7 Shield 2TB Portable SSD', 'Rugged external solid state drive with IP65 water/dust resistance and up to 1,050MB/s read speeds.', 'Storage', 79.99, 219.99, 40, 40, eventEndTime, true, 360],
          ['Bose', 'Bose QuietComfort Ultra Wireless Earbuds', 'Spatial audio with world-class noise cancellation and custom-tuned sound profile.', 'Audio', 129.00, 299.00, 45, 45, eventEndTime, true, 620],
          ['Logitech', 'Logitech MX Master 3S Performance Mouse', '8K DPI track-on-glass sensor, Quiet Clicks, and electromagnetic MagSpeed scrolling wheel.', 'Peripherals', 39.99, 99.99, 60, 60, eventEndTime, false, 750],
          ['Dyson', 'Dyson Supersonic Airwrap Multi-Styler Complete', 'Engineered for multiple hair types with Coanda airflow control and intelligent heat regulation.', 'Lifestyle', 249.00, 599.00, 15, 15, eventEndTime, true, 240],
          ['Nintendo', 'Nintendo Switch OLED Model Special Edition', 'Vibrant 7-inch OLED screen, wide adjustable stand, wired LAN port dock, and 64GB storage.', 'Gaming', 179.99, 349.99, 35, 35, eventEndTime, true, 420],
          ['LG', 'LG UltraGear 27" QHD Gaming Monitor 165Hz', 'Nano IPS 1ms G-SYNC compatible display with HDR400 and ultra-thin bezel design.', 'Displays', 159.00, 379.00, 20, 20, eventEndTime, false, 180],
          ['DJI', 'DJI Mini 3 Lightweight Camera Drone 4K', 'Under 249g ultra-compact drone with 4K HDR video, true vertical shooting, and 38-min flight time.', 'Cameras', 249.00, 559.00, 25, 25, eventEndTime, true, 640],
          ['PlayStation', 'Sony PlayStation 5 Slim Digital Console', 'Next-gen gaming powerhouse with ultra-high speed 1TB SSD, ray tracing, and Tempest 3D Audio.', 'Gaming', 289.99, 449.99, 18, 18, eventEndTime, true, 1420],
          ['Marshall', 'Marshall Stanmore III Bluetooth Speaker', 'Legendary iconic room-filling acoustic soundstage with analog brass knobs and Bluetooth 5.2.', 'Audio', 169.00, 379.99, 30, 30, eventEndTime, false, 480],
          ['Kindle', 'Amazon Kindle Paperwhite Signature Edition', '32GB storage, wireless charging, auto-adjusting front light, and glare-free 6.8" 300 ppi display.', 'Lifestyle', 89.99, 189.99, 50, 50, eventEndTime, false, 310],
          ['GoPro', 'GoPro HERO12 Black 5.3K Action Camera', 'HyperSmooth 6.0 video stabilization, HDR video, dual LCD screens, and waterproof to 33ft.', 'Cameras', 219.00, 399.99, 35, 35, eventEndTime, true, 530],
          ['Razer', 'Razer DeathAdder V3 Pro Wireless Mouse', '63g ultra-lightweight esports ergonomic mouse with Focus Pro 30K optical sensor and Gen-3 switches.', 'Peripherals', 69.00, 149.99, 45, 45, eventEndTime, false, 390],
          ['Google', 'Google Pixel Watch 2 WiFi + LTE', 'Advanced heart rate tracking, stress detection, Fitbit health integration, and all-day battery.', 'Wearables', 149.00, 399.00, 22, 22, eventEndTime, false, 410],
          ['Sennheiser', 'Sennheiser Momentum 4 Wireless Headphones', 'Audiophile-inspired 42mm transducer system, adaptive ANC, and unmatched 60-hour battery life.', 'Audio', 179.99, 379.95, 28, 28, eventEndTime, true, 560],
          ['Garmin', 'Garmin Forerunner 265 GPS Running Watch', 'Colorful AMOLED touchscreen display, training readiness metrics, and multi-band GNSS accuracy.', 'Wearables', 249.00, 449.99, 15, 15, eventEndTime, false, 340],
          ['Asus', 'ASUS ROG Ally Handheld Gaming Z1 Extreme', '120Hz FHD display, AMD Ryzen Z1 Extreme processor, 512GB NVMe SSD, and Windows 11 gaming.', 'Gaming', 399.00, 699.99, 12, 12, eventEndTime, true, 980]
        ];

        for (const d of sampleDeals) {
          await pool.query(`
            INSERT INTO deals (brand, title, description, category, price, original_price, total_stock, stock_remaining, end_time, is_featured, interested_count)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, d);
        }
        console.log('✅ PostgreSQL: Seeded full 20 product deals catalog');
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

    // Seed/Update Deals catalog to 20 deals with active countdowns
    sqliteDb.get(`SELECT COUNT(*) as count FROM deals`, [], async (err, row) => {
      const eventEndTime = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

      // Refresh any expired end_times so active deals never lock up as SOLD OUT
      sqliteDb.run(`UPDATE deals SET end_time = ? WHERE end_time <= datetime('now')`, [eventEndTime]);

      if (!err && (row?.count < 20 || row?.count === 0)) {
        // Clear previous partial seeds if fewer than 20
        sqliteDb.run(`DELETE FROM deals`);

        const sampleDeals = [
          ['Sony', 'Sony WH-1000XM5 Wireless Headphones', 'Industry-leading noise canceling headphones with dual processors, 8 microphones, and 30-hour battery.', 'Audio', 149.99, 399.99, 50, 50, eventEndTime, 1, 1080],
          ['Apple', 'Apple Watch Series 9 GPS 45mm', 'Always-on Retina display, S9 SiP chip, double tap gesture, and comprehensive health monitoring.', 'Wearables', 199.00, 429.00, 30, 30, eventEndTime, 1, 420],
          ['Keychron', 'Keychron Q1 Pro Wireless Mechanical Keyboard', 'Custom QMK/VIA full-aluminum hot-swappable keyboard with double-gasket design and RGB backlight.', 'Peripherals', 69.50, 199.00, 100, 100, eventEndTime, 1, 890],
          ['Anker', 'Anker 737 Power Bank (PowerCore 24K)', '24,000mAh 140W 3-port ultra-fast portable charger with smart digital display.', 'Accessories', 49.99, 149.99, 80, 80, eventEndTime, 0, 510],
          ['Samsung', 'Samsung T7 Shield 2TB Portable SSD', 'Rugged external solid state drive with IP65 water/dust resistance and up to 1,050MB/s read speeds.', 'Storage', 79.99, 219.99, 40, 40, eventEndTime, 1, 360],
          ['Bose', 'Bose QuietComfort Ultra Wireless Earbuds', 'Spatial audio with world-class noise cancellation and custom-tuned sound profile.', 'Audio', 129.00, 299.00, 45, 45, eventEndTime, 1, 620],
          ['Logitech', 'Logitech MX Master 3S Performance Mouse', '8K DPI track-on-glass sensor, Quiet Clicks, and electromagnetic MagSpeed scrolling wheel.', 'Peripherals', 39.99, 99.99, 60, 60, eventEndTime, 0, 750],
          ['Dyson', 'Dyson Supersonic Airwrap Multi-Styler Complete', 'Engineered for multiple hair types with Coanda airflow control and intelligent heat regulation.', 'Lifestyle', 249.00, 599.00, 15, 15, eventEndTime, 1, 240],
          ['Nintendo', 'Nintendo Switch OLED Model Special Edition', 'Vibrant 7-inch OLED screen, wide adjustable stand, wired LAN port dock, and 64GB storage.', 'Gaming', 179.99, 349.99, 35, 35, eventEndTime, 1, 420],
          ['LG', 'LG UltraGear 27" QHD Gaming Monitor 165Hz', 'Nano IPS 1ms G-SYNC compatible display with HDR400 and ultra-thin bezel design.', 'Displays', 159.00, 379.00, 20, 20, eventEndTime, 0, 180],
          ['DJI', 'DJI Mini 3 Lightweight Camera Drone 4K', 'Under 249g ultra-compact drone with 4K HDR video, true vertical shooting, and 38-min flight time.', 'Cameras', 249.00, 559.00, 25, 25, eventEndTime, 1, 640],
          ['PlayStation', 'Sony PlayStation 5 Slim Digital Console', 'Next-gen gaming powerhouse with ultra-high speed 1TB SSD, ray tracing, and Tempest 3D Audio.', 'Gaming', 289.99, 449.99, 18, 18, eventEndTime, 1, 1420],
          ['Marshall', 'Marshall Stanmore III Bluetooth Speaker', 'Legendary iconic room-filling acoustic soundstage with analog brass knobs and Bluetooth 5.2.', 'Audio', 169.00, 379.99, 30, 30, eventEndTime, 0, 480],
          ['Kindle', 'Amazon Kindle Paperwhite Signature Edition', '32GB storage, wireless charging, auto-adjusting front light, and glare-free 6.8" 300 ppi display.', 'Lifestyle', 89.99, 189.99, 50, 50, eventEndTime, 0, 310],
          ['GoPro', 'GoPro HERO12 Black 5.3K Action Camera', 'HyperSmooth 6.0 video stabilization, HDR video, dual LCD screens, and waterproof to 33ft.', 'Cameras', 219.00, 399.99, 35, 35, eventEndTime, 1, 530],
          ['Razer', 'Razer DeathAdder V3 Pro Wireless Mouse', '63g ultra-lightweight esports ergonomic mouse with Focus Pro 30K optical sensor and Gen-3 switches.', 'Peripherals', 69.00, 149.99, 45, 45, eventEndTime, 0, 390],
          ['Google', 'Google Pixel Watch 2 WiFi + LTE', 'Advanced heart rate tracking, stress detection, Fitbit health integration, and all-day battery.', 'Wearables', 149.00, 399.00, 22, 22, eventEndTime, 0, 410],
          ['Sennheiser', 'Sennheiser Momentum 4 Wireless Headphones', 'Audiophile-inspired 42mm transducer system, adaptive ANC, and unmatched 60-hour battery life.', 'Audio', 179.99, 379.95, 28, 28, eventEndTime, true, 560],
          ['Garmin', 'Garmin Forerunner 265 GPS Running Watch', 'Colorful AMOLED touchscreen display, training readiness metrics, and multi-band GNSS accuracy.', 'Wearables', 249.00, 449.99, 15, 15, eventEndTime, 0, 340],
          ['Asus', 'ASUS ROG Ally Handheld Gaming Z1 Extreme', '120Hz FHD display, AMD Ryzen Z1 Extreme processor, 512GB NVMe SSD, and Windows 11 gaming.', 'Gaming', 399.00, 699.99, 12, 12, eventEndTime, 1, 980]
        ];

        const stmt = sqliteDb.prepare(`
          INSERT INTO deals (brand, title, description, category, price, original_price, total_stock, stock_remaining, end_time, is_featured, interested_count)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        sampleDeals.forEach(d => stmt.run(d));
        stmt.finalize();
        console.log('✅ SQLite: Seeded full 20 product deals catalog');
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
