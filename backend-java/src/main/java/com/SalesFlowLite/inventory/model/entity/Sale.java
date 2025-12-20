package com.SalesFlowLite.inventory.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime saleDate = LocalDateTime.now();

    // Money field – already perfect with BigDecimal
    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SaleItem> items = new ArrayList<>();

    // FIXED: Back to Long to match existing DB column (bigint) – safe, no migration needed
    // Consistent with Product, easy for sync comparison
    @Column(name = "last_updated")
    private Long lastUpdated;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.lastUpdated = System.currentTimeMillis();
    }
}