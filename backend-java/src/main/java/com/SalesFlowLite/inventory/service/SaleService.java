// backend-java/src/main/java/com/SalesFlowLite/inventory/service/SaleService.java
package com.SalesFlowLite.inventory.service;

import com.SalesFlowLite.inventory.model.dto.*;

import java.util.List;

public interface SaleService {
    SaleResponse createSale(CreateSaleRequest request);
    List<SaleResponse> getAllSales();

    List<SaleResponse> getSalesToday();
    List<SaleResponse> getSalesLastDays(int days);
    List<SaleResponse> getRecentSales(int limit);
    void bulkCreateSales(List<CreateSaleRequest> requests);

    List<SalesHistoryDto> getProductSalesHistory(Long productId, int days);
}