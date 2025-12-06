package com.SalesFlowLite.inventory.model.dto.inventory;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryResponse {
    private Long id;
    private String name;
    private String description;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal cost;
    private String category;
    private Instant createdAt;
    private Instant updatedAt;
}
