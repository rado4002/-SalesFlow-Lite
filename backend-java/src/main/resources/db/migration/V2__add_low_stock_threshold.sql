-- src/main/resources/db/migration/V2__add_low_stock_threshold.sql
-- Drop column if exists (safe), then add
ALTER TABLE IF EXISTS products DROP COLUMN IF EXISTS low_stock_threshold;
ALTER TABLE products ADD COLUMN low_stock_threshold INTEGER DEFAULT 10;