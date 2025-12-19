package com.SalesFlowLite.inventory.service.impl;

import com.SalesFlowLite.inventory.exception.BusinessException;
import com.SalesFlowLite.inventory.exception.ErrorCode;
import com.SalesFlowLite.inventory.model.dto.sync.SyncRequest;
import com.SalesFlowLite.inventory.model.dto.sync.SyncResponse;
import com.SalesFlowLite.inventory.model.entity.SyncLog;
import com.SalesFlowLite.inventory.repository.SyncLogRepository;
import com.SalesFlowLite.inventory.service.ProductService;
import com.SalesFlowLite.inventory.service.SaleService;
import com.SalesFlowLite.inventory.service.SyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class SyncServiceImpl implements SyncService {

    @Autowired
    private SaleService saleService;

    @Autowired
    private ProductService productService;

    @Autowired
    private SyncLogRepository syncLogRepository;

    @Override
    @Transactional
    public SyncResponse processOfflineBatch(SyncRequest syncRequest) {
        List<String> conflicts = new ArrayList<>();
        List<String> successes = new ArrayList<>();

        syncRequest.getOfflineSales().forEach(saleRequest -> {
            try {
                saleService.createSale(saleRequest);
                successes.add("Sale synced");
            } catch (BusinessException e) {
                if (e.getCode() == ErrorCode.INSUFFICIENT_STOCK) {
                    conflicts.add("Stock conflict");
                }
            }
        });

        SyncLog log = new SyncLog();
        log.setUserId(syncRequest.getUserId());
        log.setSyncTimestamp(Instant.now().toEpochMilli());
        log.setStatus(conflicts.isEmpty() ? "SUCCESS" : "PARTIAL");
        syncLogRepository.save(log);

        SyncResponse response = new SyncResponse();
        response.getSuccesses().addAll(successes);
        response.getConflicts().addAll(conflicts);
        return response;
    }

    @Override
    public SyncResponse getChangesSince(Long lastSyncTimestamp) {
        SyncResponse response = new SyncResponse();

        List<com.SalesFlowLite.inventory.model.dto.ProductDto> products =
                productService.getUpdatedProductsSince(lastSyncTimestamp);
        response.getUpdatedProducts().addAll(products);

        return response;
    }
}