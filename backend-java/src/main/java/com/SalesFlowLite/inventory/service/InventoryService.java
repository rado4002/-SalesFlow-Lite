package com.SalesFlowLite.inventory.service;

import com.SalesFlowLite.inventory.model.dto.inventory.InventoryAdjustRequest;
import com.SalesFlowLite.inventory.model.dto.inventory.InventoryRequest;
import com.SalesFlowLite.inventory.model.dto.inventory.InventoryResponse;
import com.SalesFlowLite.inventory.model.dto.inventory.InventoryUpdateRequest;
import com.SalesFlowLite.inventory.model.entity.InventoryItem;
import com.SalesFlowLite.inventory.model.entity.Product;
import com.SalesFlowLite.inventory.repository.InventoryRepository;
import com.SalesFlowLite.inventory.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

    @Transactional
    public InventoryResponse createItem(InventoryRequest request) {
        InventoryItem item = InventoryItem.builder()
                .sku(request.getSku())
                .name(request.getName())
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .price(request.getPrice())
                .cost(request.getCost())
                .category(request.getCategory())
                .build();

        InventoryItem saved = inventoryRepository.save(item);
        syncInventoryToProduct(saved);
        return mapToResponse(saved);
    }

    private void syncInventoryToProduct(InventoryItem item) {
        Product product = productRepository.findBySku(item.getSku())
                .orElseGet(() -> {
                    Product newProduct = Product.builder()
                            .sku(item.getSku())
                            .name(item.getName())
                            .description(item.getDescription())
                            // FIXED: direct BigDecimal from inventory price
                            .price(item.getPrice() != null ? item.getPrice() : BigDecimal.ZERO)
                            .stockQuantity(0)
                            .lowStockThreshold(10)
                            .build();
                    return productRepository.save(newProduct);
                });

        product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
        productRepository.save(product);
    }

    public InventoryResponse getItem(Long id) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with ID: " + id));
        return mapToResponse(item);
    }

    public InventoryResponse getItemBySku(String sku) {
        InventoryItem item = inventoryRepository.findBySku(sku)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with SKU: " + sku));
        return mapToResponse(item);
    }

    public InventoryResponse getItemByName(String name) {
        InventoryItem item = inventoryRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with name: " + name));
        return mapToResponse(item);
    }

    public List<InventoryResponse> getAllItems() {
        return inventoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public InventoryResponse updateItem(Long id, InventoryRequest request) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with ID: " + id));
        updateFields(item, request);
        InventoryItem saved = inventoryRepository.save(item);
        syncInventoryToProduct(saved);
        return mapToResponse(saved);
    }

    @Transactional
    public InventoryResponse updateItemBySku(String sku, InventoryRequest request) {
        InventoryItem item = inventoryRepository.findBySku(sku)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with SKU: " + sku));
        updateFields(item, request);
        InventoryItem saved = inventoryRepository.save(item);
        syncInventoryToProduct(saved);
        return mapToResponse(saved);
    }

    @Transactional
    public InventoryResponse updateItemByName(String name, InventoryRequest request) {
        InventoryItem item = inventoryRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with name: " + name));
        updateFields(item, request);
        InventoryItem saved = inventoryRepository.save(item);
        syncInventoryToProduct(saved);
        return mapToResponse(saved);
    }

    @Transactional
    public InventoryResponse updateItemPartial(Long id, InventoryUpdateRequest request) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with ID: " + id));
        applyPartialUpdates(item, request);
        InventoryItem saved = inventoryRepository.save(item);
        syncInventoryToProduct(saved);
        return mapToResponse(saved);
    }

    @Transactional
    public InventoryResponse updateItemBySkuPartial(String sku, InventoryUpdateRequest request) {
        InventoryItem item = inventoryRepository.findBySku(sku)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with SKU: " + sku));
        applyPartialUpdates(item, request);
        InventoryItem saved = inventoryRepository.save(item);
        syncInventoryToProduct(saved);
        return mapToResponse(saved);
    }

    @Transactional
    public InventoryResponse updateItemByNamePartial(String name, InventoryUpdateRequest request) {
        InventoryItem item = inventoryRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with name: " + name));
        applyPartialUpdates(item, request);
        InventoryItem saved = inventoryRepository.save(item);
        syncInventoryToProduct(saved);
        return mapToResponse(saved);
    }

    @Transactional
    public InventoryResponse adjustItemPartial(Long id, InventoryAdjustRequest request) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with ID: " + id));
        applyAdjustUpdates(item, request);
        InventoryItem saved = inventoryRepository.save(item);
        syncInventoryToProduct(saved);
        return mapToResponse(saved);
    }

    @Transactional
    public InventoryResponse adjustItemBySkuPartial(String sku, InventoryAdjustRequest request) {
        InventoryItem item = inventoryRepository.findBySku(sku)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with SKU: " + sku));
        applyAdjustUpdates(item, request);
        InventoryItem saved = inventoryRepository.save(item);
        syncInventoryToProduct(saved);
        return mapToResponse(saved);
    }

    @Transactional
    public InventoryResponse adjustItemByNamePartial(String name, InventoryAdjustRequest request) {
        InventoryItem item = inventoryRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with name: " + name));
        applyAdjustUpdates(item, request);
        InventoryItem saved = inventoryRepository.save(item);
        syncInventoryToProduct(saved);
        return mapToResponse(saved);
    }

    private void applyAdjustUpdates(InventoryItem item, InventoryAdjustRequest request) {
        if (request.getQuantity() != null) {
            item.setQuantity(request.getQuantity());
        }
        if (request.getCost() != null) {
            item.setCost(request.getCost());
        }
    }

    private void applyPartialUpdates(InventoryItem item, InventoryUpdateRequest request) {
        if (request.getSku() != null) item.setSku(request.getSku());
        if (request.getName() != null) item.setName(request.getName());
        if (request.getDescription() != null) item.setDescription(request.getDescription());
        if (request.getQuantity() != null) item.setQuantity(request.getQuantity());
        if (request.getPrice() != null) item.setPrice(request.getPrice());
        if (request.getCost() != null) item.setCost(request.getCost());
        if (request.getCategory() != null) item.setCategory(request.getCategory());
    }

    public void deleteItem(Long id) {
        if (!inventoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Item not found with ID: " + id);
        }
        inventoryRepository.deleteById(id);
    }

    public void deleteItemBySku(String sku) {
        InventoryItem item = inventoryRepository.findBySku(sku)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with SKU: " + sku));
        inventoryRepository.delete(item);
    }

    public void deleteItemByName(String name) {
        InventoryItem item = inventoryRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with name: " + name));
        inventoryRepository.delete(item);
    }

    private InventoryResponse mapToResponse(InventoryItem item) {
        return InventoryResponse.builder()
                .id(item.getId())
                .sku(item.getSku())
                .name(item.getName())
                .description(item.getDescription())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .cost(item.getCost())
                .category(item.getCategory())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }

    private void updateFields(InventoryItem item, InventoryRequest request) {
        item.setSku(request.getSku());
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setQuantity(request.getQuantity());
        item.setPrice(request.getPrice());
        item.setCost(request.getCost());
        item.setCategory(request.getCategory());
    }
}