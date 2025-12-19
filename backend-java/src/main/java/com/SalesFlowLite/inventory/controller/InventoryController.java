package com.SalesFlowLite.inventory.controller;

import com.SalesFlowLite.inventory.model.dto.inventory.InventoryAdjustRequest; // NEW
import com.SalesFlowLite.inventory.model.dto.inventory.InventoryRequest;
import com.SalesFlowLite.inventory.model.dto.inventory.InventoryResponse;
import com.SalesFlowLite.inventory.model.dto.inventory.InventoryUpdateRequest;
import com.SalesFlowLite.inventory.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory", description = "CRUD operations for inventory items")
public class InventoryController {

    private final InventoryService inventoryService;

    // CREATE (unchanged – still requires full data)
    @Operation(summary = "Create a new inventory item")
    @PostMapping
    public ResponseEntity<InventoryResponse> create(@Valid @RequestBody InventoryRequest request) {
        return ResponseEntity.ok(inventoryService.createItem(request));
    }

    // GET ALL (unchanged)
    @Operation(summary = "Get all inventory items")
    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAll() {
        return ResponseEntity.ok(inventoryService.getAllItems());
    }

    // GET BY ID (unchanged)
    @Operation(summary = "Get inventory item by ID")
    @GetMapping("/by-id/{id}")
    public ResponseEntity<InventoryResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getItem(id));
    }

    // GET BY SKU (unchanged)
    @Operation(summary = "Get inventory item by SKU")
    @GetMapping("/by-sku/{sku}")
    public ResponseEntity<InventoryResponse> getBySku(@PathVariable String sku) {
        return ResponseEntity.ok(inventoryService.getItemBySku(sku));
    }

    // GET BY NAME (unchanged)
    @Operation(summary = "Get inventory item by name")
    @GetMapping("/by-name/{name}")
    public ResponseEntity<InventoryResponse> getByName(@PathVariable String name) {
        return ResponseEntity.ok(inventoryService.getItemByName(name));
    }

    // === EXISTING FULL/PARTIAL UPDATES – KEPT FOR BACKWARD COMPATIBILITY ===
    @Operation(summary = "Update inventory item by ID (partial update allowed)")
    @PutMapping("/by-id/{id}")
    public ResponseEntity<InventoryResponse> updateById(
            @PathVariable Long id,
            @Valid @RequestBody InventoryUpdateRequest request) {
        return ResponseEntity.ok(inventoryService.updateItemPartial(id, request));
    }

    @Operation(summary = "Update inventory item by SKU (partial update – all fields)")
    @PutMapping("/by-sku/{sku}")
    public ResponseEntity<InventoryResponse> updateBySku(
            @PathVariable String sku,
            @Valid @RequestBody InventoryUpdateRequest request) {
        return ResponseEntity.ok(inventoryService.updateItemBySkuPartial(sku, request));
    }

    @Operation(summary = "Update inventory item by name (partial update – all fields)")
    @PutMapping("/by-name/{name}")
    public ResponseEntity<InventoryResponse> updateByName(
            @PathVariable String name,
            @Valid @RequestBody InventoryUpdateRequest request) {
        return ResponseEntity.ok(inventoryService.updateItemByNamePartial(name, request));
    }

    // === NEW MERCHANT-FRIENDLY PARTIAL ADJUST ENDPOINTS (PATCH + minimal body) ===
    @Operation(summary = "Adjust stock quantity/cost by ID (only quantity & cost – merchant favorite)")
    @PatchMapping("/adjust/by-id/{id}")
    public ResponseEntity<InventoryResponse> adjustById(
            @PathVariable Long id,
            @Valid @RequestBody InventoryAdjustRequest request) {
        return ResponseEntity.ok(inventoryService.adjustItemPartial(id, request));
    }

    @Operation(summary = "Adjust stock quantity/cost by SKU (only quantity & cost – super clean)")
    @PatchMapping("/adjust/by-sku/{sku}")
    public ResponseEntity<InventoryResponse> adjustBySku(
            @PathVariable String sku,
            @Valid @RequestBody InventoryAdjustRequest request) {
        return ResponseEntity.ok(inventoryService.adjustItemBySkuPartial(sku, request));
    }

    @Operation(summary = "Adjust stock quantity/cost by name (only quantity & cost)")
    @PatchMapping("/adjust/by-name/{name}")
    public ResponseEntity<InventoryResponse> adjustByName(
            @PathVariable String name,
            @Valid @RequestBody InventoryAdjustRequest request) {
        return ResponseEntity.ok(inventoryService.adjustItemByNamePartial(name, request));
    }

    // DELETE methods unchanged
    @Operation(summary = "Delete inventory item by ID")
    @DeleteMapping("/by-id/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.ok("Item deleted successfully.");
    }

    @Operation(summary = "Delete inventory item by SKU")
    @DeleteMapping("/by-sku/{sku}")
    public ResponseEntity<String> deleteBySku(@PathVariable String sku) {
        inventoryService.deleteItemBySku(sku);
        return ResponseEntity.ok("Item deleted successfully.");
    }

    @Operation(summary = "Delete inventory item by name")
    @DeleteMapping("/by-name/{name}")
    public ResponseEntity<String> deleteByName(@PathVariable String name) {
        inventoryService.deleteItemByName(name);
        return ResponseEntity.ok("Item deleted successfully.");
    }
}