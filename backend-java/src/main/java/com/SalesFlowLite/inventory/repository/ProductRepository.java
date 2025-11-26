package com.SalesFlowLite.inventory.repository;

import com.SalesFlowLite.inventory.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Product findBySku(String sku);

    @Query("""
        SELECT p FROM Product p
        WHERE p.stockQuantity <= p.lowStockThreshold
    """)
    List<Product> findLowStockProducts();
}
