package com.SalesFlowLite.inventory.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SaleItemRequest(
        Long productId,          // Preferred – exact match
        String sku,              // Alternative – if frontend has SKU
        @Min(1) Integer quantity // Required
) {}