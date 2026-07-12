-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- PRODUCTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  sale_price NUMERIC(10, 2),
  discount_percent NUMERIC(5, 2),
  compare_at_price NUMERIC(10, 2),
  stock_quantity INTEGER DEFAULT 0,
  sku TEXT,
  barcode TEXT,
  product_images JSONB DEFAULT '[]',
  product_videos JSONB DEFAULT '[]',
  thumbnail TEXT,
  categories TEXT[] DEFAULT '{}',
  collections TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  brand TEXT,
  status TEXT DEFAULT 'active', -- active, draft, archived
  featured BOOLEAN DEFAULT FALSE,
  new_arrival BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  best_seller BOOLEAN DEFAULT FALSE,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  material TEXT,
  shipping_weight NUMERIC(10, 2),
  estimated_delivery TEXT,
  visibility BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- INVENTORY HISTORY TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS inventory_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  change_amount INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- SHOP SETTINGS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS shop_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  store_name TEXT DEFAULT 'INEFFABLE',
  store_logo TEXT,
  store_banner TEXT,
  shipping_charges NUMERIC(10, 2) DEFAULT 0,
  free_shipping_limit NUMERIC(10, 2),
  tax_percentage NUMERIC(5, 2) DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  coupons JSONB DEFAULT '[]',
  promo_codes JSONB DEFAULT '[]',
  offer_banners JSONB DEFAULT '[]',
  featured_collections TEXT[] DEFAULT '{}',
  homepage_products JSONB DEFAULT '[]',
  trending_products JSONB DEFAULT '[]',
  new_arrivals JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- WEBSITE CONTENT TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS website_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- MEDIA LIBRARY TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS media_library (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  optimized_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- ORDERS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID,
  customer_id UUID,
  order_number TEXT UNIQUE NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  tax_amount NUMERIC(10, 2),
  shipping_amount NUMERIC(10, 2),
  status TEXT DEFAULT 'pending',
  items JSONB NOT NULL,
  shipping_address JSONB,
  billing_address JSONB,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'unpaid',
  discord_username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- ORDER ITEMS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- CUSTOMERS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PROFILES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- WISHLIST TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ===========================================
-- ADDRESSES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  zip_code TEXT NOT NULL,
  country TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- DISCORD SETTINGS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS discord_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invite_link TEXT,
  support_channel TEXT,
  ticket_channel TEXT,
  logs_channel TEXT,
  bot_status TEXT DEFAULT 'offline',
  support_roles TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- SOCIAL LINKS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  platform TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- SEO SETTINGS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  website_title TEXT,
  meta_description TEXT,
  keywords TEXT[] DEFAULT '{}',
  og_image TEXT,
  favicon TEXT,
  google_analytics_id TEXT,
  google_search_console_id TEXT,
  meta_pixel_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PAYMENTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  user_id UUID,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_session_id TEXT,
  status TEXT DEFAULT 'PENDING',
  transaction_id TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- CART TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS cart (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- ANNOUNCEMENTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT DEFAULT 'general',
  is_popup BOOLEAN DEFAULT FALSE,
  scheduled_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- INSERT INITIAL DATA
-- ===========================================
-- Insert default shop settings
INSERT INTO shop_settings (id, store_name) VALUES (uuid_generate_v4(), 'INEFFABLE') ON CONFLICT DO NOTHING;

-- Insert default social links
INSERT INTO social_links (platform, url) VALUES
('discord', ''),
('instagram', ''),
('youtube', ''),
('twitter', ''),
('tiktok', ''),
('github', ''),
('email', ''),
('phone', '')
ON CONFLICT (platform) DO NOTHING;

-- Insert default SEO settings
INSERT INTO seo_settings (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

-- Insert default Discord settings
INSERT INTO discord_settings (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;
