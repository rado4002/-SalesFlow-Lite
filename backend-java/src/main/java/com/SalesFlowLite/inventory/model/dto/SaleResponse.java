// src/main/java/com/SalesFlowLite/inventory/model/dto/SaleResponse.java
package com.SalesFlowLite.inventory.model.dto;

import java.time.LocalDateTime;
import java.util.List;

public record SaleResponse(
        Long id,
        LocalDateTime saleDate,
        Double totalAmount,
        List<SaleItemResponse> items
) {}