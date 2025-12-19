// backend-java/src/main/java/com/SalesFlowLite/inventory/service/impl/SaleServiceImpl.java
package com.SalesFlowLite.inventory.service.impl;

import com.SalesFlowLite.inventory.exception.InsufficientStockException;
import com.SalesFlowLite.inventory.model.dto.CreateSaleRequest;
import com.SalesFlowLite.inventory.model.dto.SaleItemResponse;
import com.SalesFlowLite.inventory.model.dto.SaleResponse;
import com.SalesFlowLite.inventory.model.dto.SalesHistoryDto;
import com.SalesFlowLite.inventory.model.entity.Product;
import com.SalesFlowLite.inventory.model.entity.Sale;
import com.SalesFlowLite.inventory.model.entity.SaleItem;
import com.SalesFlowLite.inventory.repository.SaleRepository;
import com.SalesFlowLite.inventory.service.ProductService;
import com.SalesFlowLite.inventory.service.SaleService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final ProductService productService;

    @Override
    @Transactional
    public SaleResponse createSale(CreateSaleRequest request) {
        Sale sale = Sale.builder()
                .saleDate(LocalDateTime.now())
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (var itemReq : request.items()) {
            Product product = productService.findByIdWithPessimisticLock(itemReq.productId());
            int available = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
            if (available < itemReq.quantity()) {
                throw new InsufficientStockException("Not enough stock for product " + product.getSku());
            }

            BigDecimal unitPrice = product.getPrice();
            BigDecimal qty = BigDecimal.valueOf(itemReq.quantity());
            BigDecimal subtotal = unitPrice.multiply(qty);

            productService.reduceStock(product, itemReq.quantity());

            SaleItem item = SaleItem.builder()
                    .sale(sale)
                    .product(product)
                    .quantity(itemReq.quantity())
                    .unitPrice(unitPrice)
                    .subtotal(subtotal)
                    .build();

            sale.getItems().add(item);
            total = total.add(subtotal);
        }

        sale.setTotalAmount(total);
        Sale saved = saleRepository.save(sale);
        return toResponse(saved);
    }

    @Override
    public List<SaleResponse> getAllSales() {
        return saleRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<SaleResponse> getSalesToday() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime startOfNextDay = today.plusDays(1).atStartOfDay();
        return saleRepository.findSalesToday(startOfDay, startOfNextDay).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<SaleResponse> getSalesLastDays(int days) {
        LocalDateTime startDate = LocalDate.now().minusDays(days).atStartOfDay();
        return saleRepository.findSalesAfterDate(startDate).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<SaleResponse> getRecentSales(int limit) {
        return saleRepository.findRecentSales().stream()
                .limit(limit)
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void bulkCreateSales(List<CreateSaleRequest> requests) {
        for (CreateSaleRequest request : requests) {
            createSale(request); // Reuse safe logic
        }
    }

    @Override
    public List<SalesHistoryDto> getProductSalesHistory(Long productId, int days) {
        LocalDateTime startDate = LocalDate.now().minusDays(days).atStartOfDay();

        return saleRepository.findSaleItemsByProductAndDate(productId, startDate).stream()
                .collect(Collectors.groupingBy(
                        item -> item.getSale().getSaleDate().toLocalDate(),
                        Collectors.summingInt(SaleItem::getQuantity)
                ))
                .entrySet().stream()
                .map(entry -> new SalesHistoryDto(
                        entry.getKey().toString(),  // "yyyy-MM-dd"
                        entry.getValue()
                ))
                .sorted(Comparator.comparing(SalesHistoryDto::getDate))  // Fixed: ::getDate (matches getter)
                .toList();
    }

    private SaleResponse toResponse(Sale sale) {
        List<SaleItemResponse> items = sale.getItems().stream()
                .map(item -> new SaleItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getSku(),
                        item.getQuantity(),
                        item.getUnitPrice().doubleValue(),
                        item.getSubtotal().doubleValue()
                ))
                .toList();

        return new SaleResponse(
                sale.getId(),
                sale.getSaleDate(),
                sale.getTotalAmount().doubleValue(),
                items
        );
    }
}