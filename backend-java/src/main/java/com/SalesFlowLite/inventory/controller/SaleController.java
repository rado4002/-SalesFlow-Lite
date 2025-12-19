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

    // ============================ CREATE SALE (BULK – KEPT FOR BACKWARD COMPAT) ============================
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PostMapping
    public ResponseEntity<SaleResponse> createSale(@Valid @RequestBody CreateSaleRequest request) {
        SaleResponse response = saleService.createSale(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // === NEW: SINGLE SALE CREATION – MERCHANT MAIN FLOW (object body) ===
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PostMapping("/single")
    public ResponseEntity<SaleResponse> createSingleSale(@Valid @RequestBody CreateSingleSaleRequest request) {
        SaleResponse response = saleService.createSingleSale(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ============================ GET ALL SALES ============================
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public ResponseEntity<List<SaleResponse>> getAll() {
        return ResponseEntity.ok(saleService.getAllSales());
    }

    // ============================ SALES TODAY ============================
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/today")
    public ResponseEntity<List<SaleResponse>> getSalesToday() {
        return ResponseEntity.ok(saleService.getSalesToday());
    }

    // ============================ SALES HISTORY (LAST X DAYS) ============================
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/history")
    public ResponseEntity<List<SaleResponse>> getSalesHistory(@RequestParam(defaultValue = "90") int days) {
        return ResponseEntity.ok(saleService.getSalesLastDays(days));
    }

    // ============================ RECENT SALES ============================
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/recent")
    public ResponseEntity<List<SaleResponse>> getRecentSales(@RequestParam(defaultValue = "100") int limit) {
        return ResponseEntity.ok(saleService.getRecentSales(limit));
    }

    // ============================ BULK IMPORT SALES (ADMIN ONLY) ============================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/bulk")
    public ResponseEntity<String> bulkCreate(@Valid @RequestBody List<CreateSaleRequest> requests) {
        saleService.bulkCreateSales(requests);
        return ResponseEntity.ok("Bulk sales imported successfully");
    }

    // ============================ PRODUCT SALES HISTORY BY SKU ============================
    @PreAuthorize("hasAnyRole('ADMIN','PYTHON_SERVICE')")
    @GetMapping("/history/by-sku/{sku}")
    public ResponseEntity<List<SalesHistoryDto>> getProductSalesHistoryBySku(
            @PathVariable String sku,
            @RequestParam(defaultValue = "90") int days) {
        return ResponseEntity.ok(saleService.getProductSalesHistoryBySku(sku, days));
    }

    // ============================ PRODUCT SALES HISTORY BY NAME ============================
    @PreAuthorize("hasAnyRole('ADMIN','PYTHON_SERVICE')")
    @GetMapping("/history/by-name/{name}")
    public ResponseEntity<List<SalesHistoryDto>> getProductSalesHistoryByName(
            @PathVariable String name,
            @RequestParam(defaultValue = "90") int days) {
        return ResponseEntity.ok(saleService.getProductSalesHistoryByName(name, days));
    }
}