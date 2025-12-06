package com.SalesFlowLite.inventory.controller;

import com.SalesFlowLite.inventory.model.dto.inventory.InventoryRequest;
import com.SalesFlowLite.inventory.model.dto.inventory.InventoryResponse;
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

    // ============================
    // CREATE ITEM
    // ============================
    @Operation(summary = "Create a new inventory item")
    @PostMapping
    public ResponseEntity<InventoryResponse> create(@Valid @RequestBody InventoryRequest request) {
        return ResponseEntity.ok(inventoryService.createItem(request));
    }

    // ============================
    // GET ITEM BY ID
    // ============================
    @Operation(summary = "Get inventory item by ID")
    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getItem(id));
    }

    // ============================
    // GET ALL ITEMS
    // ============================
    @Operation(summary = "Get all inventory items")
    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAll() {
        return ResponseEntity.ok(inventoryService.getAllItems());
    }

    // ============================
    // UPDATE ITEM
    // ============================
    @Operation(summary = "Update inventory item by ID")
    @PutMapping("/{id}")
    public ResponseEntity<InventoryResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody InventoryRequest request
    ) {
        return ResponseEntity.ok(inventoryService.updateItem(id, request));
    }

    // ============================
    // DELETE ITEM
    // ============================
    @Operation(summary = "Delete inventory item by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.ok("Item deleted successfully.");
    }
}
