package com.SalesFlowLite.inventory.model.entity;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(nullable = false)
    private Double price;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold;

    // NEW: For offline sync
    @Column(name = "last_updated")
    private Long lastUpdated;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.lastUpdated = System.currentTimeMillis();
    }
}