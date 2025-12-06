// src/main/java/com/SalesFlowLite/inventory/model/dto/SaleItemResponse.java
package com.SalesFlowLite.inventory.model.dto;

public record SaleItemResponse(
        Long productId,
        String productName,
        String sku,
        Integer quantity,
        Double unitPrice,
        Double subtotal
) {}

