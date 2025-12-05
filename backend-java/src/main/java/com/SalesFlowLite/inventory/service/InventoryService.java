package com.SalesFlowLite.inventory.service;

import com.SalesFlowLite.inventory.model.dto.inventory.InventoryRequest;
import com.SalesFlowLite.inventory.model.dto.inventory.InventoryResponse;
import com.SalesFlowLite.inventory.model.entity.InventoryItem;
import com.SalesFlowLite.inventory.repository.InventoryRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    // ============================
    // CREATE
    // ============================
    public InventoryResponse createItem(InventoryRequest request) {
        InventoryItem item = InventoryItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .price(request.getPrice())
                .cost(request.getCost())
                .category(request.getCategory())
                .build();

        InventoryItem saved = inventoryRepository.save(item);
        return mapToResponse(saved);
    }

    // ============================
    // READ - GET BY ID
    // ============================
    public InventoryResponse getItem(Long id) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with ID: " + id));
        return mapToResponse(item);
    }

    // ============================
    // READ - LIST ALL
    // ============================
    public List<InventoryResponse> getAllItems() {
        return inventoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ============================
    // UPDATE
    // ============================
    public InventoryResponse updateItem(Long id, InventoryRequest request) {

        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with ID: " + id));

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setQuantity(request.getQuantity());
        item.setPrice(request.getPrice());
        item.setCost(request.getCost());
        item.setCategory(request.getCategory());

        InventoryItem saved = inventoryRepository.save(item);
        return mapToResponse(saved);
    }

    // ============================
    // DELETE
    // ============================
    public void deleteItem(Long id) {
        if (!inventoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Item not found with ID: " + id);
        }
        inventoryRepository.deleteById(id);
    }

    // ============================
    // MAP ENTITY → DTO
    // ============================
    private InventoryResponse mapToResponse(InventoryItem item) {
        return InventoryResponse.builder()
                .id(item.getId())
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
}
