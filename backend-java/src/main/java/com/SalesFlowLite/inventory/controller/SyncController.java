package com.SalesFlowLite.inventory.controller;

import com.SalesFlowLite.inventory.model.dto.sync.SyncRequest;
import com.SalesFlowLite.inventory.model.dto.sync.SyncResponse;
import com.SalesFlowLite.inventory.service.SyncService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sync")
public class SyncController {

    @Autowired
    private SyncService syncService;

    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SyncResponse> uploadOfflineData(@Valid @RequestBody SyncRequest syncRequest) {
        SyncResponse response = syncService.processOfflineBatch(syncRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/download")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SyncResponse> downloadChanges(@RequestParam("lastSyncTimestamp") Long lastSyncTimestamp) {
        SyncResponse response = syncService.getChangesSince(lastSyncTimestamp);
        return ResponseEntity.ok(response);
    }
}