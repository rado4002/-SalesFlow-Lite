package com.SalesFlowLite.inventory.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;  // ← changed to BigDecimal (money = BigDecimal always)

    @Column(nullable = false)
    @Builder.Default
    private Integer stockQuantity = 0;

    private String description;

    private String imageUrl;

    @Column(nullable = false)
    @Builder.Default
    private Integer lowStockThreshold = 10;
}