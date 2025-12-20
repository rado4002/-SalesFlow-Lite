package com.SalesFlowLite.inventory.model.dto.sync;

import com.SalesFlowLite.inventory.model.dto.ProductDto;
import com.SalesFlowLite.inventory.model.dto.SaleResponse;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class SyncResponse {
    private List<String> successes = new ArrayList<>();
    private List<String> conflicts = new ArrayList<>();
    private Long newSyncTimestamp;
    private List<ProductDto> updatedProducts = new ArrayList<>();
    private List<SaleResponse> updatedSales = new ArrayList<>();

    public SyncResponse() {
        this.newSyncTimestamp = System.currentTimeMillis();
    }
}