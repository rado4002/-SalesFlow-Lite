package com.SalesFlowLite.inventory.model.dto.sync;

import com.SalesFlowLite.inventory.model.dto.CreateSaleRequest;
import lombok.Data;

import java.util.List;

@Data
public class SyncRequest {
    private Long userId;
    private List<CreateSaleRequest> offlineSales;
    private Long offlineTimestamp;
}