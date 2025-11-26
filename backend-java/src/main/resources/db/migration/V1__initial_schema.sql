-- V1__initial_schema.sql
-- Flyway migration to create core tables for SalesFlow-Lite
-- Works on H2 (dev) and PostgreSQL (production)

CREATE TABLE products (
                          id             BIGSERIAL PRIMARY KEY,
                          name           VARCHAR(100) NOT NULL,
                          sku            VARCHAR(50)  NOT NULL,
                          price          DOUBLE PRECISION NOT NULL CHECK (price >= 0),
                          stock_quantity INTEGER      NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
                          description    VARCHAR(500),
                          image_url      VARCHAR(255),
                          CONSTRAINT uk_products_sku UNIQUE (sku)
);

-- Index for fast lookup by SKU (very common in sales entry)
CREATE INDEX idx_products_sku ON products(sku);


CREATE TABLE sales (
                       id           BIGSERIAL PRIMARY KEY,
                       sale_date    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       total_amount DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (total_amount >= 0)
);


CREATE TABLE sale_items (
                            id          BIGSERIAL PRIMARY KEY,
                            sale_id     BIGINT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
                            product_id  BIGINT NOT NULL REFERENCES products(id),
                            quantity    INTEGER NOT NULL CHECK (quantity > 0),
                            unit_price  DOUBLE PRECISION NOT NULL CHECK (unit_price >= 0),
                            total_price DOUBLE PRECISION NOT NULL CHECK (total_price >= 0)
);

-- Speed up stock movement queries and analytics later
CREATE INDEX idx_sale_items_product ON sale_items(product_id);
CREATE INDEX idx_sale_items_sale    ON sale_items(sale_id);