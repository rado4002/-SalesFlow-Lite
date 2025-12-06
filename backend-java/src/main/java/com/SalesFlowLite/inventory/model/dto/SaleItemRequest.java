// src/main/java/com/SalesFlowLite/inventory/model/dto/SaleItemRequest.java
package com.SalesFlowLite.inventory.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SaleItemRequest(
        @NotNull Long productId,
        @Min(1) Integer quantity
) {}