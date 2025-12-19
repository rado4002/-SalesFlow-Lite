package com.SalesFlowLite.inventory.repository;

import com.SalesFlowLite.inventory.model.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
}
