// backend-java/src/main/java/com/SalesFlowLite/inventory/repository/SaleRepository.java
package com.SalesFlowLite.inventory.repository;

import com.SalesFlowLite.inventory.model.entity.Sale;
import com.SalesFlowLite.inventory.model.entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    // Today (range)
    @Query("SELECT s FROM Sale s WHERE s.saleDate >= :startOfDay AND s.saleDate < :startOfNextDay")
    List<Sale> findSalesToday(
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("startOfNextDay") LocalDateTime startOfNextDay
    );

    // History
    @Query("SELECT s FROM Sale s WHERE s.saleDate >= :startDate ORDER BY s.saleDate DESC")
    List<Sale> findSalesAfterDate(@Param("startDate") LocalDateTime startDate);

    // Recent
    @Query("SELECT s FROM Sale s ORDER BY s.saleDate DESC")
    List<Sale> findRecentSales();

    // Python: Product history (via SaleItem)
    @Query("""
        SELECT si FROM SaleItem si
        JOIN si.sale s
        WHERE si.product.id = :productId
          AND s.saleDate >= :startDate
        """)
    List<SaleItem> findSaleItemsByProductAndDate(
            @Param("productId") Long productId,
            @Param("startDate") LocalDateTime startDate
    );
}