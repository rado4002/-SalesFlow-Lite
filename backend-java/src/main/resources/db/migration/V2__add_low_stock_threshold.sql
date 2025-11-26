-- V2__add_low_stock_threshold.sql
ALTER TABLE products
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER NOT NULL DEFAULT 10;