package com.SalesFlowLite.inventory.controller;

import com.SalesFlowLite.inventory.model.dto.ProductDto;
import com.SalesFlowLite.inventory.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // === CREATE ===
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ProductDto> create(@Valid @RequestBody ProductDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(dto));
    }

    // === READ ALL ===
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public ResponseEntity<List<ProductDto>> getAll() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // === BY ID (rétrocompatibilité) ===
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/by-id/{id}")
    public ResponseEntity<ProductDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // === BY NAME ===
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/by-name/{name}")
    public ResponseEntity<ProductDto> getByName(@PathVariable String name) {
        return ResponseEntity.ok(productService.getProductByName(name));
    }

    // === BY SKU (remplace by-id comme principal) ===
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/by-sku/{sku}")
    public ResponseEntity<ProductDto> getBySku(@PathVariable String sku) {
        return ResponseEntity.ok(productService.getProductBySku(sku));
    }

    // === LOW STOCK ===
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductDto>> lowStock() {
        return ResponseEntity.ok(productService.getLowStockProducts());
    }

    // === UPDATE BY NAME ===
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/by-name/{name}")
    public ResponseEntity<ProductDto> updateByName(@PathVariable String name, @Valid @RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.updateProductByName(name, dto));
    }

    // === UPDATE BY SKU (remplace by-id) ===
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/by-sku/{sku}")
    public ResponseEntity<ProductDto> updateBySku(@PathVariable String sku, @Valid @RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.updateProductBySku(sku, dto));
    }

    // === DELETE BY NAME ===
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/by-name/{name}")
    public ResponseEntity<Void> deleteByName(@PathVariable String name) {
        productService.deleteProductByName(name);
        return ResponseEntity.noContent().build();
    }

    // === DELETE BY SKU (remplace by-id) ===
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/by-sku/{sku}")
    public ResponseEntity<Void> deleteBySku(@PathVariable String sku) {
        productService.deleteProductBySku(sku);
        return ResponseEntity.noContent().build();
    }
}