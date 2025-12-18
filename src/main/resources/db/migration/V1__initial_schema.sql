-- V1__initial_schema.sql
-- ========================================
-- V1 — Schema complet (PostgreSQL 14+)
-- ========================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
                                     id BIGSERIAL PRIMARY KEY,
                                     username VARCHAR(100),
    email VARCHAR(150),
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('USER','ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
                                        id BIGSERIAL PRIMARY KEY,
                                        sku VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255),
    image_url VARCHAR(255),
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 10,
    last_updated BIGINT
    );
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_low_stock ON products(stock_quantity, low_stock_threshold);

-- SALES
CREATE TABLE IF NOT EXISTS sales (
                                     id BIGSERIAL PRIMARY KEY,
                                     sale_date TIMESTAMP(6) NOT NULL DEFAULT NOW(),
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    last_updated BIGINT
    );
CREATE INDEX IF NOT EXISTS idx_sales_sale_date ON sales(sale_date);

-- SALE ITEMS
CREATE TABLE IF NOT EXISTS sale_items (
                                          id BIGSERIAL PRIMARY KEY,
                                          sale_id BIGINT NOT NULL,
                                          product_id BIGINT NOT NULL,
                                          product_sku VARCHAR(255) NOT NULL,  -- Added for SKU-based tracking
    product_name VARCHAR(255) NOT NULL, -- Added for name-based tracking
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    subtotal NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
    );
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_sku ON sale_items(product_sku);  -- Added index for faster SKU queries
CREATE INDEX IF NOT EXISTS idx_sale_items_product_name ON sale_items(product_name); -- Added index for faster name queries

-- REFRESH TOKENS
CREATE TABLE IF NOT EXISTS refresh_tokens (
                                              id VARCHAR(36) PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                             revoked BOOLEAN NOT NULL DEFAULT FALSE,
                             device VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
CREATE INDEX IF NOT EXISTS idx_refresh_token_token ON refresh_tokens(token);

-- INVENTORY ITEMS
CREATE TABLE IF NOT EXISTS inventory_items (
                                               id BIGSERIAL PRIMARY KEY,
                                               sku VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    category VARCHAR(255) NOT NULL,
    price NUMERIC(15,2) NOT NULL,
    cost NUMERIC(15,2) NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );

-- SALES SUMMARY
DROP TABLE IF EXISTS sales_summary;
CREATE TABLE sales_summary (
                               product_id BIGINT PRIMARY KEY,
                               product_name VARCHAR(255) NOT NULL,
                               total_units_sold BIGINT NOT NULL DEFAULT 0,
                               total_revenue NUMERIC(15,2) NOT NULL DEFAULT 0,
                               last_sale_date TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sales_summary_revenue ON sales_summary(total_revenue);
CREATE INDEX IF NOT EXISTS idx_sales_summary_last_sale ON sales_summary(last_sale_date);

-- SYNC LOGS
CREATE TABLE IF NOT EXISTS sync_logs (
                                         id BIGSERIAL PRIMARY KEY,
                                         user_id BIGINT,
                                         sync_timestamp BIGINT,
                                         status VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
    );