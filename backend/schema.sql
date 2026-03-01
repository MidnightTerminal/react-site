-- =============================================
-- ShopVibe E-Commerce Database Schema
-- MySQL 8.0+
-- =============================================

-- Create database
CREATE DATABASE IF NOT EXISTS shopvibe
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE shopvibe;

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  role ENUM('customer', 'admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  emoji VARCHAR(10),
  gradient VARCHAR(100),
  image_url VARCHAR(500),
  product_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- PRODUCTS TABLE
-- =============================================
-- Badge Logic:
--   IF original_price IS NOT NULL AND original_price > price
--     → badge = CONCAT(ROUND((original_price - price) / original_price * 100), '% OFF')
--     → badge_color = 'bg-red-500'
--   ELSE IF is_new = TRUE
--     → badge = 'New'
--     → badge_color = 'bg-brand-600'
--   ELSE
--     → Use the manual badge / badge_color columns
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) DEFAULT NULL COMMENT 'If set and > price, shows "X% OFF" badge',
  category VARCHAR(100) NOT NULL,
  badge VARCHAR(50) DEFAULT NULL COMMENT 'Manual badge: Best Seller, Trending, Hot, etc.',
  badge_color VARCHAR(50) DEFAULT NULL COMMENT 'Tailwind color class for badge',
  rating DECIMAL(2,1) DEFAULT 0.0,
  reviews INT DEFAULT 0,
  emoji VARCHAR(10) DEFAULT '📦',
  gradient VARCHAR(100) DEFAULT 'from-gray-100 to-slate-100',
  is_new BOOLEAN DEFAULT FALSE COMMENT 'If TRUE, shows "New" badge (unless original_price overrides)',
  image_url VARCHAR(500) DEFAULT NULL,
  description TEXT,
  short_description VARCHAR(500),
  stock INT DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  weight DECIMAL(5,2) DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_price (price),
  INDEX idx_rating (rating),
  INDEX idx_is_new (is_new),
  INDEX idx_is_featured (is_featured),
  INDEX idx_is_active (is_active),
  FULLTEXT INDEX idx_search (name, description)
) ENGINE=InnoDB;

-- =============================================
-- PRODUCT IMAGES TABLE (for multiple images)
-- =============================================
CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  sort_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================
-- ADDRESSES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'US',
  phone VARCHAR(20),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================
-- CART ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (user_id, product_id)
) ENGINE=InnoDB;

-- =============================================
-- WISHLIST ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS wishlist_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wishlist_item (user_id, product_id)
) ENGINE=InnoDB;

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0.00,
  tax DECIMAL(10,2) DEFAULT 0.00,
  discount DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL,
  coupon_code VARCHAR(50),
  -- Shipping info
  shipping_first_name VARCHAR(100),
  shipping_last_name VARCHAR(100),
  shipping_address VARCHAR(255),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_zip VARCHAR(20),
  shipping_country VARCHAR(100) DEFAULT 'US',
  shipping_phone VARCHAR(20),
  -- Payment info (store only last 4 digits!)
  payment_method ENUM('card', 'paypal', 'apple_pay', 'google_pay') DEFAULT 'card',
  card_last_four VARCHAR(4),
  -- Contact
  email VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_order_number (order_number),
  INDEX idx_user_orders (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- =============================================
-- ORDER ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_emoji VARCHAR(10),
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  quantity INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================
-- COUPONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  type ENUM('percentage', 'fixed') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_uses INT DEFAULT NULL,
  used_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- REVIEWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- =============================================
-- SEED DATA: Categories
-- =============================================
INSERT INTO categories (name, slug, description, emoji, gradient, product_count, sort_order) VALUES
('Handbags', 'handbags', 'Premium ladies handbags, clutches, totes and crossbody bags', '👜', 'from-pink-500 to-rose-500', 12, 1),
('Clothing', 'clothing', 'Trendy ladies clothing - dresses, tops, skirts and outerwear', '👗', 'from-purple-500 to-violet-500', 12, 2),
('Sneakers', 'sneakers', 'Men''s sneakers - running shoes, casual, basketball and more', '👟', 'from-blue-500 to-indigo-500', 12, 3),
('Gadgets', 'gadgets', 'Latest gadgets & accessories - smartwatches, earbuds, speakers', '⌚', 'from-emerald-500 to-teal-500', 12, 4),
('Kids', 'kids', 'Fun and educational kids toys - robots, blocks, art kits', '🧸', 'from-amber-500 to-orange-500', 12, 5);


-- =============================================
-- SEED DATA: Products — Handbags
-- =============================================
INSERT INTO products (name, price, original_price, category, badge, badge_color, rating, reviews, emoji, gradient, is_new, description, stock, is_featured) VALUES
('Leather Crossbody Bag', 89.99, 129.99, 'Handbags', NULL, NULL, 4.8, 324, '👜', 'from-pink-100 to-rose-100', FALSE, 'Elegant leather crossbody bag with adjustable strap. Perfect for everyday use.', 45, TRUE),
('Designer Tote Bag', 119.99, NULL, 'Handbags', 'Best Seller', 'bg-emerald-500', 4.7, 256, '💼', 'from-rose-100 to-pink-100', FALSE, 'Spacious designer tote with premium materials and gold hardware.', 30, TRUE),
('Mini Clutch Purse', 49.99, 69.99, 'Handbags', NULL, NULL, 4.6, 189, '👛', 'from-fuchsia-100 to-pink-100', FALSE, 'Compact mini clutch perfect for evening events and parties.', 60, FALSE),
('Canvas Shoulder Bag', 65.99, NULL, 'Handbags', NULL, NULL, 4.5, 112, '🎒', 'from-amber-100 to-orange-100', TRUE, 'Casual canvas shoulder bag with multiple compartments.', 55, FALSE),
('Quilted Chain Bag', 159.99, 199.99, 'Handbags', NULL, NULL, 4.9, 478, '👜', 'from-violet-100 to-purple-100', FALSE, 'Luxurious quilted bag with gold chain strap. A timeless classic.', 20, TRUE),
('Woven Straw Tote', 42.99, NULL, 'Handbags', NULL, NULL, 4.4, 87, '🧺', 'from-yellow-100 to-amber-100', FALSE, 'Summer-ready woven straw tote. Lightweight and stylish.', 40, FALSE),
('Satin Evening Bag', 79.99, NULL, 'Handbags', 'Elegant', 'bg-purple-500', 4.7, 203, '✨', 'from-purple-100 to-violet-100', FALSE, 'Gorgeous satin evening bag with crystal clasp detail.', 25, FALSE),
('Bucket Bag Leather', 95.99, 135.99, 'Handbags', NULL, NULL, 4.6, 167, '👜', 'from-teal-100 to-emerald-100', FALSE, 'Trendy leather bucket bag with drawstring closure.', 35, FALSE),
('Hobo Slouchy Bag', 72.99, NULL, 'Handbags', NULL, NULL, 4.5, 134, '💼', 'from-indigo-100 to-blue-100', FALSE, 'Relaxed hobo bag with soft slouchy silhouette.', 50, FALSE),
('Envelope Clutch', 55.99, NULL, 'Handbags', NULL, NULL, 4.3, 78, '✉️', 'from-rose-100 to-red-100', TRUE, 'Sleek envelope clutch in premium faux leather.', 70, FALSE),
('Saddle Crossbody', 108.99, NULL, 'Handbags', 'Trending', 'bg-orange-500', 4.8, 345, '👜', 'from-orange-100 to-amber-100', FALSE, 'Western-inspired saddle crossbody with brass hardware.', 28, TRUE),
('Doctor Frame Bag', 135.99, 179.99, 'Handbags', NULL, NULL, 4.7, 212, '💼', 'from-sky-100 to-blue-100', FALSE, 'Vintage-inspired doctor frame bag with structured shape.', 22, FALSE);


-- =============================================
-- SEED DATA: Products — Clothing
-- =============================================
INSERT INTO products (name, price, original_price, category, badge, badge_color, rating, reviews, emoji, gradient, is_new, description, stock, is_featured) VALUES
('Floral Summer Dress', 54.99, NULL, 'Clothing', NULL, NULL, 4.7, 189, '👗', 'from-purple-100 to-violet-100', TRUE, 'Beautiful floral print summer dress. Light and breezy fabric.', 80, FALSE),
('Casual Linen Blazer', 74.99, NULL, 'Clothing', NULL, NULL, 4.5, 98, '🧥', 'from-violet-100 to-purple-100', TRUE, 'Relaxed-fit linen blazer perfect for smart-casual outfits.', 40, FALSE),
('Silk Blouse Top', 45.99, 65.99, 'Clothing', NULL, NULL, 4.6, 234, '👚', 'from-pink-100 to-rose-100', FALSE, 'Luxurious silk blouse with V-neckline and pearl buttons.', 55, TRUE),
('High-Waist Trousers', 62.99, NULL, 'Clothing', NULL, NULL, 4.4, 156, '👖', 'from-blue-100 to-indigo-100', FALSE, 'Tailored high-waist trousers with flattering wide leg.', 65, FALSE),
('Knit Cardigan Sweater', 58.99, 79.99, 'Clothing', NULL, NULL, 4.7, 312, '🧶', 'from-amber-100 to-orange-100', FALSE, 'Cozy knit cardigan with oversized fit and chunky buttons.', 45, FALSE),
('Maxi Wrap Skirt', 39.99, NULL, 'Clothing', 'Trending', 'bg-orange-500', 4.5, 145, '👗', 'from-emerald-100 to-teal-100', FALSE, 'Flowing maxi wrap skirt with adjustable tie waist.', 70, FALSE),
('Denim Jacket Classic', 85.99, NULL, 'Clothing', 'Best Seller', 'bg-emerald-500', 4.8, 567, '🧥', 'from-sky-100 to-blue-100', FALSE, 'Timeless classic denim jacket. A wardrobe essential.', 50, TRUE),
('Cocktail Party Dress', 99.99, 139.99, 'Clothing', NULL, NULL, 4.9, 423, '👗', 'from-fuchsia-100 to-pink-100', FALSE, 'Stunning cocktail dress with sequin detailing.', 30, TRUE),
('Cotton Palazzo Pants', 35.99, NULL, 'Clothing', NULL, NULL, 4.3, 89, '👖', 'from-lime-100 to-green-100', FALSE, 'Comfortable cotton palazzo pants with elastic waistband.', 85, FALSE),
('Off-Shoulder Blouse', 42.99, NULL, 'Clothing', NULL, NULL, 4.6, 178, '👚', 'from-rose-100 to-red-100', TRUE, 'Romantic off-shoulder blouse with ruffle details.', 60, FALSE),
('Pleated Midi Skirt', 48.99, NULL, 'Clothing', NULL, NULL, 4.5, 201, '👗', 'from-violet-100 to-indigo-100', FALSE, 'Elegant pleated midi skirt in satin finish.', 55, FALSE),
('Oversized Wool Coat', 129.99, 189.99, 'Clothing', NULL, NULL, 4.8, 389, '🧥', 'from-gray-100 to-slate-100', FALSE, 'Premium oversized wool coat for winter styling.', 25, TRUE);


-- =============================================
-- SEED DATA: Products — Sneakers
-- =============================================
INSERT INTO products (name, price, original_price, category, badge, badge_color, rating, reviews, emoji, gradient, is_new, description, stock, is_featured) VALUES
('Air Max Retro Sneakers', 129.99, 159.99, 'Sneakers', NULL, NULL, 4.9, 542, '👟', 'from-blue-100 to-indigo-100', FALSE, 'Iconic Air Max sneakers with retro colorway and max cushioning.', 60, TRUE),
('Classic Canvas Low-Top', 59.99, NULL, 'Sneakers', NULL, NULL, 4.5, 234, '👟', 'from-gray-100 to-slate-100', FALSE, 'Timeless canvas low-top sneakers for everyday wear.', 100, FALSE),
('Running Performance X', 149.99, 189.99, 'Sneakers', NULL, NULL, 4.8, 678, '🏃', 'from-emerald-100 to-teal-100', FALSE, 'High-performance running shoes with responsive cushioning.', 45, TRUE),
('High-Top Basketball', 119.99, NULL, 'Sneakers', 'Best Seller', 'bg-emerald-500', 4.7, 456, '🏀', 'from-orange-100 to-amber-100', FALSE, 'Premium basketball sneakers with ankle support and grip.', 55, TRUE),
('Slip-On Comfort Walk', 69.99, NULL, 'Sneakers', NULL, NULL, 4.4, 189, '👞', 'from-sky-100 to-blue-100', FALSE, 'Easy slip-on walking shoes with memory foam insole.', 75, FALSE),
('Suede Skater Shoes', 89.99, 109.99, 'Sneakers', NULL, NULL, 4.6, 312, '🛹', 'from-purple-100 to-violet-100', FALSE, 'Durable suede skater shoes with vulcanized sole.', 50, FALSE),
('Trail Runner Pro', 139.99, NULL, 'Sneakers', NULL, NULL, 4.8, 267, '⛰️', 'from-green-100 to-emerald-100', TRUE, 'All-terrain trail running shoes with waterproof upper.', 35, FALSE),
('Minimalist Trainer', 79.99, NULL, 'Sneakers', 'Trending', 'bg-orange-500', 4.5, 345, '👟', 'from-rose-100 to-pink-100', FALSE, 'Lightweight minimalist trainers for natural movement.', 65, FALSE),
('Retro Jordan Style', 169.99, 219.99, 'Sneakers', NULL, NULL, 4.9, 891, '👟', 'from-red-100 to-orange-100', FALSE, 'Premium retro-style basketball sneakers. Collector edition.', 25, TRUE),
('Gym CrossFit Shoes', 109.99, NULL, 'Sneakers', NULL, NULL, 4.6, 234, '💪', 'from-amber-100 to-yellow-100', FALSE, 'Versatile CrossFit training shoes with flat stable base.', 40, FALSE),
('Knit Running Boost', 159.99, NULL, 'Sneakers', 'Premium', 'bg-indigo-500', 4.8, 512, '🏃', 'from-indigo-100 to-blue-100', FALSE, 'Ultra-responsive knit running shoes with boost technology.', 30, TRUE),
('Casual Everyday White', 54.99, NULL, 'Sneakers', NULL, NULL, 4.4, 167, '👟', 'from-zinc-100 to-gray-100', TRUE, 'Clean white sneakers that go with everything.', 90, FALSE);


-- =============================================
-- SEED DATA: Products — Gadgets
-- =============================================
INSERT INTO products (name, price, original_price, category, badge, badge_color, rating, reviews, emoji, gradient, is_new, description, stock, is_featured) VALUES
('Smart Watch Pro X', 199.99, NULL, 'Gadgets', 'Best Seller', 'bg-emerald-500', 4.8, 876, '⌚', 'from-emerald-100 to-teal-100', FALSE, 'Advanced smartwatch with health tracking, GPS, and AMOLED display.', 50, TRUE),
('Wireless Earbuds Pro', 79.99, 99.99, 'Gadgets', NULL, NULL, 4.9, 1024, '🎧', 'from-cyan-100 to-blue-100', FALSE, 'Premium wireless earbuds with active noise cancellation.', 80, TRUE),
('Portable Bluetooth Speaker', 49.99, NULL, 'Gadgets', NULL, NULL, 4.6, 456, '🔊', 'from-orange-100 to-amber-100', FALSE, 'Waterproof portable speaker with 360-degree sound.', 65, FALSE),
('USB-C Power Bank 20K', 35.99, 49.99, 'Gadgets', NULL, NULL, 4.5, 678, '🔋', 'from-green-100 to-emerald-100', FALSE, '20000mAh power bank with fast charging and dual USB-C ports.', 100, FALSE),
('LED Ring Light Kit', 29.99, NULL, 'Gadgets', 'Trending', 'bg-orange-500', 4.4, 234, '💡', 'from-yellow-100 to-amber-100', FALSE, '10-inch LED ring light with tripod stand and phone holder.', 55, FALSE),
('Mechanical Keyboard RGB', 89.99, NULL, 'Gadgets', NULL, NULL, 4.7, 345, '⌨️', 'from-purple-100 to-violet-100', TRUE, 'RGB mechanical keyboard with hot-swappable switches.', 40, FALSE),
('Wireless Phone Charger', 24.99, NULL, 'Gadgets', NULL, NULL, 4.3, 567, '📱', 'from-sky-100 to-blue-100', FALSE, 'Fast wireless charging pad compatible with all Qi devices.', 120, FALSE),
('Noise-Cancel Headphones', 159.99, 219.99, 'Gadgets', NULL, NULL, 4.9, 789, '🎧', 'from-gray-100 to-slate-100', FALSE, 'Over-ear headphones with ANC, 30hr battery, premium drivers.', 35, TRUE),
('Action Camera 4K', 129.99, NULL, 'Gadgets', 'Hot', 'bg-orange-500', 4.7, 423, '📷', 'from-red-100 to-rose-100', FALSE, 'Waterproof 4K action camera with image stabilization.', 45, FALSE),
('Smart Home Mini Hub', 59.99, NULL, 'Gadgets', NULL, NULL, 4.5, 312, '🏠', 'from-indigo-100 to-blue-100', TRUE, 'Voice-controlled smart home hub with multi-device support.', 50, FALSE),
('Fitness Tracker Band', 39.99, 59.99, 'Gadgets', NULL, NULL, 4.6, 534, '⌚', 'from-lime-100 to-green-100', FALSE, 'Slim fitness tracker with heart rate, sleep, and SpO2 monitoring.', 70, FALSE),
('Tablet Stand Adjustable', 19.99, NULL, 'Gadgets', NULL, NULL, 4.4, 189, '📱', 'from-teal-100 to-cyan-100', FALSE, 'Adjustable aluminum tablet/phone stand for desk use.', 90, FALSE);


-- =============================================
-- SEED DATA: Products — Kids Toys
-- =============================================
INSERT INTO products (name, price, original_price, category, badge, badge_color, rating, reviews, emoji, gradient, is_new, description, stock, is_featured) VALUES
('Educational Robot Kit', 45.99, 59.99, 'Kids', NULL, NULL, 4.6, 213, '🤖', 'from-amber-100 to-orange-100', FALSE, 'Build and program your own robot! STEM learning for ages 8+.', 40, TRUE),
('Building Blocks Set 500pc', 34.99, NULL, 'Kids', 'Best Seller', 'bg-emerald-500', 4.8, 567, '🧱', 'from-red-100 to-orange-100', FALSE, '500-piece building blocks set compatible with major brands.', 80, TRUE),
('Plush Teddy Bear XL', 29.99, NULL, 'Kids', NULL, NULL, 4.7, 345, '🧸', 'from-amber-100 to-yellow-100', FALSE, 'Super soft XL teddy bear. 24 inches of cuddly goodness.', 60, FALSE),
('Art & Craft Supply Kit', 24.99, 39.99, 'Kids', NULL, NULL, 4.5, 234, '🎨', 'from-pink-100 to-rose-100', FALSE, 'Complete art kit with 150+ supplies. Paint, crayons, markers & more.', 55, FALSE),
('Remote Control Car', 39.99, NULL, 'Kids', 'Hot', 'bg-orange-500', 4.6, 456, '🏎️', 'from-blue-100 to-indigo-100', FALSE, 'High-speed RC car with rechargeable battery. Indoor/outdoor fun.', 50, TRUE),
('Science Experiment Set', 32.99, NULL, 'Kids', NULL, NULL, 4.4, 178, '🔬', 'from-emerald-100 to-teal-100', TRUE, '20 safe science experiments for curious young minds.', 45, FALSE),
('Musical Keyboard Piano', 49.99, 69.99, 'Kids', NULL, NULL, 4.7, 289, '🎹', 'from-violet-100 to-purple-100', FALSE, '37-key musical keyboard with recording and playback.', 35, FALSE),
('Doll House Playset', 59.99, NULL, 'Kids', 'Trending', 'bg-orange-500', 4.8, 423, '🏠', 'from-pink-100 to-fuchsia-100', FALSE, 'Deluxe dollhouse with furniture and 4 doll figures.', 30, TRUE),
('Puzzle World Map 1000pc', 18.99, NULL, 'Kids', NULL, NULL, 4.3, 156, '🧩', 'from-green-100 to-lime-100', FALSE, 'Educational world map jigsaw puzzle with country facts.', 75, FALSE),
('Water Gun Super Soaker', 15.99, NULL, 'Kids', NULL, NULL, 4.5, 312, '🔫', 'from-cyan-100 to-sky-100', TRUE, 'High-capacity water blaster for ultimate summer battles.', 90, FALSE),
('Dinosaur Figure Set', 27.99, 37.99, 'Kids', NULL, NULL, 4.6, 234, '🦕', 'from-lime-100 to-emerald-100', FALSE, '12 realistic dinosaur figures with educational fact cards.', 65, FALSE),
('Board Game Collection', 22.99, NULL, 'Kids', 'Family Fun', 'bg-indigo-500', 4.7, 389, '🎲', 'from-indigo-100 to-blue-100', FALSE, 'Collection of 10 classic board games for family game nights.', 55, FALSE);


-- =============================================
-- SEED DATA: Coupons
-- =============================================
INSERT INTO coupons (code, type, value, min_order_amount, max_uses, is_active, expires_at) VALUES
('WELCOME15', 'percentage', 15.00, 30.00, NULL, TRUE, DATE_ADD(NOW(), INTERVAL 1 YEAR)),
('SAVE10', 'fixed', 10.00, 50.00, 1000, TRUE, DATE_ADD(NOW(), INTERVAL 6 MONTH)),
('SUMMER25', 'percentage', 25.00, 75.00, 500, TRUE, DATE_ADD(NOW(), INTERVAL 3 MONTH)),
('FREESHIP', 'fixed', 5.99, 0.00, NULL, TRUE, NULL);


-- =============================================
-- SEED DATA: Demo user (password: demo123)
-- =============================================
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('demo@shopvibe.com', '$2b$10$dummyhashfordemouser12345', 'Demo', 'User', 'customer'),
('admin@shopvibe.com', '$2b$10$dummyhashforadminuser1234', 'Admin', 'User', 'admin');


-- =============================================
-- USEFUL VIEWS
-- =============================================

-- View: Products with computed badges
CREATE OR REPLACE VIEW products_with_badges AS
SELECT
  id, name, price, original_price, category,
  CASE
    WHEN original_price IS NOT NULL AND original_price > price
      THEN CONCAT(ROUND((original_price - price) / original_price * 100), '% OFF')
    WHEN is_new = TRUE
      THEN 'New'
    ELSE badge
  END AS computed_badge,
  CASE
    WHEN original_price IS NOT NULL AND original_price > price
      THEN 'bg-red-500'
    WHEN is_new = TRUE
      THEN 'bg-brand-600'
    ELSE badge_color
  END AS computed_badge_color,
  rating, reviews, emoji, gradient, is_new, image_url,
  description, stock, is_active, is_featured, created_at
FROM products
WHERE is_active = TRUE;


-- View: Category stats
CREATE OR REPLACE VIEW category_stats AS
SELECT
  category,
  COUNT(*) as total_products,
  ROUND(AVG(price), 2) as avg_price,
  MIN(price) as min_price,
  MAX(price) as max_price,
  ROUND(AVG(rating), 1) as avg_rating,
  SUM(reviews) as total_reviews
FROM products
WHERE is_active = TRUE
GROUP BY category;


-- =============================================
-- HELPFUL QUERIES
-- =============================================

-- Get products with automatic badge computation
-- SELECT * FROM products_with_badges WHERE category = 'Handbags';

-- Get featured products
-- SELECT * FROM products_with_badges WHERE is_featured = TRUE;

-- Search products
-- SELECT * FROM products WHERE MATCH(name, description) AGAINST('leather bag' IN NATURAL LANGUAGE MODE);

-- Get products on sale (have original_price)
-- SELECT *, ROUND((original_price - price) / original_price * 100) as discount_percent
-- FROM products WHERE original_price IS NOT NULL AND original_price > price;

-- Get new arrivals
-- SELECT * FROM products_with_badges WHERE is_new = TRUE;

-- Get category stats
-- SELECT * FROM category_stats;
