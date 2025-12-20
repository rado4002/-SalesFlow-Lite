package com.SalesFlowLite.inventory.service;

import com.SalesFlowLite.inventory.model.dto.*;

import java.util.List;

public interface SaleService {

    SaleResponse createSale(CreateSaleRequest request);

    SaleResponse createSingleSale(CreateSingleSaleRequest request);

    List<SaleResponse> getAllSales();

    List<SaleResponse> getSalesToday();

    List<SaleResponse> getSalesLastDays(int days);

    List<SaleResponse> getRecentSales(int limit);

    void bulkCreateSales(List<CreateSaleRequest> requests);

    List<SalesHistoryDto> getProductSalesHistoryBySku(String sku, int days);

    List<SalesHistoryDto> getProductSalesHistoryByName(String name, int days);
}