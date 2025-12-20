package com.SalesFlowLite.inventory.repository;

import com.SalesFlowLite.inventory.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySku(String sku);

    Optional<Product> findByName(String name);

    /**
     * Finds products where current stock is below the product's own low-stock threshold.
     * Why custom @Query? JPA derived queries can't compare two fields on the same entity easily.
     */
    @Query("SELECT p FROM Product p WHERE p.stockQuantity < p.lowStockThreshold")
    List<Product> findLowStockProducts();

    /**
     * For future offline sync – finds products updated after given timestamp (epoch milli).
     * Safe, optional – won't break anything now.
     */
    @Query("SELECT p FROM Product p WHERE p.lastUpdated > :timestamp")
    List<Product> findByLastUpdatedGreaterThan(@Param("timestamp") Long timestamp);
}