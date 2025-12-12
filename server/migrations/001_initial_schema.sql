-- Invoice Generator - Initial Database Schema
-- Created: December 2025
-- Description: Core tables for invoice generation and management

-- ============================================
-- 1. SHOPS TABLE
-- Store Shopify store credentials and settings
-- ============================================
CREATE TABLE IF NOT EXISTS shops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shop_domain VARCHAR(255) NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  scope TEXT,
  shop_name VARCHAR(255),
  shop_email VARCHAR(255),
  shop_currency VARCHAR(10) DEFAULT 'USD',
  shop_timezone VARCHAR(100),
  shop_country VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_shop_domain (shop_domain),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. INVOICES TABLE
-- Main invoice records
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shop_id INT NOT NULL,
  order_id BIGINT,
  draft_order_id BIGINT,
  invoice_number VARCHAR(50) NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE,

  -- Customer information
  customer_id BIGINT,
  customer_email VARCHAR(255),
  customer_first_name VARCHAR(100),
  customer_last_name VARCHAR(100),

  -- Billing address
  billing_address_line1 VARCHAR(255),
  billing_address_line2 VARCHAR(255),
  billing_city VARCHAR(100),
  billing_province VARCHAR(100),
  billing_country VARCHAR(100),
  billing_zip VARCHAR(20),

  -- Shipping address
  shipping_address_line1 VARCHAR(255),
  shipping_address_line2 VARCHAR(255),
  shipping_city VARCHAR(100),
  shipping_province VARCHAR(100),
  shipping_country VARCHAR(100),
  shipping_zip VARCHAR(20),

  -- Financial details
  currency VARCHAR(10) DEFAULT 'USD',
  subtotal DECIMAL(10, 2) DEFAULT 0.00,
  tax_total DECIMAL(10, 2) DEFAULT 0.00,
  shipping_total DECIMAL(10, 2) DEFAULT 0.00,
  discount_total DECIMAL(10, 2) DEFAULT 0.00,
  total DECIMAL(10, 2) NOT NULL,

  -- Status and metadata
  status ENUM('draft', 'sent', 'paid', 'cancelled', 'overdue') DEFAULT 'draft',
  payment_status ENUM('unpaid', 'partial', 'paid', 'refunded') DEFAULT 'unpaid',
  notes TEXT,
  terms TEXT,

  -- Template and generation
  template_id INT,
  pdf_url TEXT,
  pdf_generated_at TIMESTAMP NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
  UNIQUE KEY unique_invoice_number_per_shop (shop_id, invoice_number),
  INDEX idx_shop_id (shop_id),
  INDEX idx_order_id (order_id),
  INDEX idx_draft_order_id (draft_order_id),
  INDEX idx_customer_email (customer_email),
  INDEX idx_invoice_date (invoice_date),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. INVOICE ITEMS TABLE
-- Line items for each invoice
-- ============================================
CREATE TABLE IF NOT EXISTS invoice_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  product_id BIGINT,
  variant_id BIGINT,

  -- Item details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100),
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,

  -- Tax information
  tax_rate DECIMAL(5, 2) DEFAULT 0.00,
  tax_amount DECIMAL(10, 2) DEFAULT 0.00,

  -- Calculated totals
  subtotal DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,

  -- Display order
  line_order INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  INDEX idx_invoice_id (invoice_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. INVOICE TEMPLATES TABLE
-- Custom invoice PDF templates
-- ============================================
CREATE TABLE IF NOT EXISTS invoice_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shop_id INT NOT NULL,

  -- Template identification
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_type ENUM('professional', 'modern', 'minimalist', 'custom') DEFAULT 'professional',

  -- Template content (HTML for PDF generation)
  html_template LONGTEXT NOT NULL,
  css_styles LONGTEXT,

  -- Customization options
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#000000',
  secondary_color VARCHAR(7) DEFAULT '#666666',
  font_family VARCHAR(100) DEFAULT 'Arial',

  -- Company information
  company_name VARCHAR(255),
  company_address TEXT,
  company_phone VARCHAR(50),
  company_email VARCHAR(255),
  company_website VARCHAR(255),
  company_tax_id VARCHAR(100),

  -- Settings
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
  INDEX idx_shop_id (shop_id),
  INDEX idx_is_default (is_default),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. EMAIL TEMPLATES TABLE
-- Email templates for sending invoices
-- ============================================
CREATE TABLE IF NOT EXISTS email_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shop_id INT NOT NULL,

  -- Template identification
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Email content
  subject VARCHAR(255) NOT NULL,
  html_body LONGTEXT NOT NULL,
  text_body LONGTEXT,

  -- Settings
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
  INDEX idx_shop_id (shop_id),
  INDEX idx_is_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. EMAIL LOGS TABLE
-- Audit trail for sent emails
-- ============================================
CREATE TABLE IF NOT EXISTS email_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shop_id INT NOT NULL,
  invoice_id INT,

  -- Email details
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  template_id INT,

  -- Delivery information
  status ENUM('queued', 'sent', 'failed', 'bounced') DEFAULT 'queued',
  sent_at TIMESTAMP NULL,
  error_message TEXT,

  -- Tracking
  sendgrid_message_id VARCHAR(255),
  opened_at TIMESTAMP NULL,
  clicked_at TIMESTAMP NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
  FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE SET NULL,
  INDEX idx_shop_id (shop_id),
  INDEX idx_invoice_id (invoice_id),
  INDEX idx_recipient (recipient_email),
  INDEX idx_status (status),
  INDEX idx_sent_at (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. SHOP SETTINGS TABLE
-- Per-shop configuration
-- ============================================
CREATE TABLE IF NOT EXISTS shop_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shop_id INT NOT NULL UNIQUE,

  -- Invoice numbering
  invoice_prefix VARCHAR(20) DEFAULT 'INV',
  invoice_number_format VARCHAR(50) DEFAULT '{PREFIX}-{YEAR}-{NUMBER}',
  next_invoice_number INT DEFAULT 1,
  invoice_number_padding INT DEFAULT 4,

  -- Default settings
  default_invoice_template_id INT,
  default_email_template_id INT,
  default_due_days INT DEFAULT 30,
  default_currency VARCHAR(10) DEFAULT 'USD',

  -- Tax settings
  tax_enabled BOOLEAN DEFAULT TRUE,
  default_tax_rate DECIMAL(5, 2) DEFAULT 0.00,
  tax_label VARCHAR(50) DEFAULT 'Tax',

  -- Email settings
  auto_send_on_order BOOLEAN DEFAULT FALSE,
  auto_send_on_draft_order BOOLEAN DEFAULT FALSE,
  sender_name VARCHAR(255),
  sender_email VARCHAR(255),
  reply_to_email VARCHAR(255),
  bcc_email VARCHAR(255),

  -- PDF settings
  pdf_page_size VARCHAR(20) DEFAULT 'A4',
  pdf_orientation VARCHAR(20) DEFAULT 'portrait',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
  FOREIGN KEY (default_invoice_template_id) REFERENCES invoice_templates(id) ON DELETE SET NULL,
  FOREIGN KEY (default_email_template_id) REFERENCES email_templates(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. TEMPLATE ASSIGNMENT RULES TABLE
-- Auto-assign templates based on product attributes
-- ============================================
CREATE TABLE IF NOT EXISTS template_assignment_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shop_id INT NOT NULL,
  invoice_template_id INT NOT NULL,

  -- Rule conditions
  rule_type ENUM('product_tag', 'vendor', 'collection', 'price_range', 'customer_tag') NOT NULL,
  rule_value VARCHAR(255) NOT NULL,

  -- Priority (lower number = higher priority)
  priority INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
  FOREIGN KEY (invoice_template_id) REFERENCES invoice_templates(id) ON DELETE CASCADE,
  INDEX idx_shop_id (shop_id),
  INDEX idx_rule_type (rule_type),
  INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. SUBSCRIPTIONS TABLE
-- App billing and subscription management
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shop_id INT NOT NULL,

  -- Shopify subscription details
  shopify_subscription_id BIGINT,
  plan_name VARCHAR(100) NOT NULL,
  plan_price DECIMAL(10, 2) NOT NULL,
  billing_interval VARCHAR(20) DEFAULT 'monthly',

  -- Status
  status ENUM('pending', 'active', 'cancelled', 'expired', 'frozen') DEFAULT 'pending',
  trial_ends_at TIMESTAMP NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,

  -- Usage limits
  invoice_limit INT DEFAULT -1, -- -1 = unlimited
  invoices_used INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
  INDEX idx_shop_id (shop_id),
  INDEX idx_status (status),
  INDEX idx_trial_ends_at (trial_ends_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 10. GDPR REQUESTS TABLE
-- Compliance audit log
-- ============================================
CREATE TABLE IF NOT EXISTS gdpr_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shop_domain VARCHAR(255) NOT NULL,
  request_type ENUM('data_request', 'customer_redact', 'shop_redact') NOT NULL,
  customer_id BIGINT,
  customer_email VARCHAR(255),
  status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  request_data JSON,
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_shop_domain (shop_domain),
  INDEX idx_request_type (request_type),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INITIAL DATA
-- Default templates will be inserted via separate migration
-- ============================================
