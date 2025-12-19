-- V5__add_sales_summary.sql
DROP TABLE IF EXISTS sales_summary;
CREATE TABLE sales_summary (
                               product_id BIGINT PRIMARY KEY,
                               product_sku VARCHAR(255) NOT NULL,  -- Added for SKU-based tracking
                               product_name VARCHAR(255) NOT NULL,
                               total_units_sold BIGINT NOT NULL DEFAULT 0,
                               total_revenue NUMERIC(15,2) NOT NULL DEFAULT 0,
                               last_sale_date TIMESTAMP
);
INSERT INTO sales_summary (product_id, product_sku, product_name, total_units_sold, total_revenue, last_sale_date)
SELECT
    p.id,
    p.sku,  -- Added to populate SKU
    p.name,
    COALESCE(SUM(si.quantity), 0),
    COALESCE(SUM(si.subtotal), 0),
    MAX(s.sale_date)
FROM products p
         LEFT JOIN sale_items si ON si.product_id = p.id
         LEFT JOIN sales s ON s.id = si.sale_id
GROUP BY p.id, p.sku, p.name;
CREATE INDEX IF NOT EXISTS idx_sales_summary_revenue ON sales_summary(total_revenue);
CREATE INDEX IF NOT EXISTS idx_sales_summary_last_sale ON sales_summary(last_sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_summary_product_sku ON sales_summary(product_sku);  -- Added index for faster SKU queries