package com.SalesFlowLite.inventory.service;

import com.SalesFlowLite.inventory.model.dto.CreateSaleRequest;
import com.SalesFlowLite.inventory.model.dto.SaleResponse;

import java.util.List;

public interface SaleService {
    SaleResponse createSale(CreateSaleRequest request);
    List<SaleResponse> getAllSales();
}
