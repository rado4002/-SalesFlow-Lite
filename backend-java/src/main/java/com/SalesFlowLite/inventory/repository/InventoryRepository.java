package com.SalesFlowLite.inventory.repository;

import com.SalesFlowLite.inventory.model.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {

    Optional<InventoryItem> findBySku(String sku);

    Optional<InventoryItem> findByName(String name);
}