package com.SalesFlowLite.inventory.service;

import com.SalesFlowLite.inventory.model.dto.sync.SyncRequest;
import com.SalesFlowLite.inventory.model.dto.sync.SyncResponse;

public interface SyncService {
    SyncResponse processOfflineBatch(SyncRequest syncRequest);
    SyncResponse getChangesSince(Long lastSyncTimestamp);
}