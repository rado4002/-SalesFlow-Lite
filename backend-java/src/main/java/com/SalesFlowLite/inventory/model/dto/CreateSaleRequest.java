// src/main/java/com/SalesFlowLite/inventory/model/dto/CreateSaleRequest.java
package com.SalesFlowLite.inventory.model.dto;

import java.util.List;

public record CreateSaleRequest(
        List<SaleItemRequest> items
) {}