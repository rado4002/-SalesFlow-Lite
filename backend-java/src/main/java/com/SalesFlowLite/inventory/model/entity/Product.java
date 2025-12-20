package com.SalesFlowLite.inventory.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String sku;

    // Money field – BigDecimal is perfect here (exact decimals, matches PostgreSQL numeric)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold;

    // FIXED: Back to Long to match existing DB column (bigint) – safe, no migration needed
    // Great for offline sync: easy numeric comparison across devices
    @Column(name = "last_updated")
    private Long lastUpdated;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.lastUpdated = System.currentTimeMillis();
    }
}