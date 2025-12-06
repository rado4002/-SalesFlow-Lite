// backend-java/src/main/java/com/SalesFlowLite/inventory/controller/SaleController.java
package com.SalesFlowLite.inventory.controller;

import com.SalesFlowLite.inventory.model.dto.*;
import com.SalesFlowLite.inventory.service.SaleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    // === EXISTING: React UI Endpoints ===
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<SaleResponse> create(@Valid @RequestBody CreateSaleRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saleService.createSale(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<SaleResponse>> getAll() {
        return ResponseEntity.ok(saleService.getAllSales());
    }

    // === NEW: Python Analytics Endpoints ===
    @PreAuthorize("hasAnyRole('ADMIN','PYTHON_SERVICE')")
    @GetMapping("/today")
    public ResponseEntity<List<SaleResponse>> getSalesToday() {
        return ResponseEntity.ok(saleService.getSalesToday());
    }

    @PreAuthorize("hasAnyRole('ADMIN','PYTHON_SERVICE')")
    @GetMapping("/history")
    public ResponseEntity<List<SaleResponse>> getSalesHistory(@RequestParam(defaultValue = "90") int days) {
        return ResponseEntity.ok(saleService.getSalesLastDays(days));
    }

    @PreAuthorize("hasAnyRole('ADMIN','PYTHON_SERVICE')")
    @GetMapping("/recent")
    public ResponseEntity<List<SaleResponse>> getRecentSales(@RequestParam(defaultValue = "100") int limit) {
        return ResponseEntity.ok(saleService.getRecentSales(limit));
    }

    @PreAuthorize("hasAnyRole('ADMIN','PYTHON_SERVICE')")
    @PostMapping("/bulk")
    public ResponseEntity<String> bulkCreate(@Valid @RequestBody List<CreateSaleRequest> requests) {
        saleService.bulkCreateSales(requests);
        return ResponseEntity.ok("Bulk sales imported successfully");
    }

    // === CRITICAL: Python-Specific Product History ===
    @PreAuthorize("hasAnyRole('ADMIN','PYTHON_SERVICE')")
    @GetMapping("/history/{productId}")
    public ResponseEntity<List<SalesHistoryDto>> getProductSalesHistory(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(saleService.getProductSalesHistory(productId, days));
    }
}