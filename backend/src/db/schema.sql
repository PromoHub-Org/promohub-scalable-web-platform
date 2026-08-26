-- PromoHub Relational Database Schema (PostgreSQL / SQLite Compatible)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Deals Table
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

-- 3. Claims Ledger Table
CREATE TABLE IF NOT EXISTS claims (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  deal_id INT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  claim_code VARCHAR(50) UNIQUE NOT NULL,
  claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_deals_stock ON deals(stock_remaining);
CREATE INDEX IF NOT EXISTS idx_claims_user ON claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_deal ON claims(deal_id);
