package com.SalesFlowLite.inventory.service.impl;

import com.SalesFlowLite.inventory.exception.InsufficientStockException;
import com.SalesFlowLite.inventory.model.dto.*;
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
        return processSaleItems(request.items());
    }

    @Override
    @Transactional
    public SaleResponse createSingleSale(CreateSingleSaleRequest request) {
        return processSaleItems(request.items());
    }

    private SaleResponse processSaleItems(List<SaleItemRequest> itemRequests) {
        Sale sale = Sale.builder()
                .saleDate(LocalDateTime.now())
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (SaleItemRequest itemReq : itemRequests) {
            Product product = itemReq.productId() != null
                    ? productService.findByIdWithPessimisticLock(itemReq.productId())
                    : productService.findBySkuWithPessimisticLock(itemReq.sku());

            int available = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
            if (available < itemReq.quantity()) {
                throw new InsufficientStockException(
                        "Not enough stock for product " + product.getSku());
            }

            // FIXED: direct BigDecimal from product.price
            BigDecimal unitPrice = product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO;
            BigDecimal quantity = BigDecimal.valueOf(itemReq.quantity());
            BigDecimal subtotal = unitPrice.multiply(quantity);

            productService.reduceStock(product, itemReq.quantity());

            SaleItem item = SaleItem.builder()
                    .sale(sale)
                    .product(product)
                    .productSku(product.getSku())
                    .productName(product.getName())
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
        return saleRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<SaleResponse> getSalesToday() {
        LocalDate today = LocalDate.now();
        return saleRepository
                .findSalesToday(today.atStartOfDay(), today.plusDays(1).atStartOfDay())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<SaleResponse> getSalesLastDays(int days) {
        return saleRepository
                .findSalesAfterDate(LocalDate.now().minusDays(days).atStartOfDay())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<SaleResponse> getRecentSales(int limit) {
        return saleRepository.findRecentSales()
                .stream()
                .limit(limit)
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void bulkCreateSales(List<CreateSaleRequest> requests) {
        requests.forEach(this::createSale);
    }

    @Override
    public List<SalesHistoryDto> getProductSalesHistoryBySku(String sku, int days) {
        Product product = productService.findProductEntityBySku(sku);
        return getSalesHistoryForProduct(product.getId(), days);
    }

    @Override
    public List<SalesHistoryDto> getProductSalesHistoryByName(String name, int days) {
        Product product = productService.findProductEntityByName(name);
        return getSalesHistoryForProduct(product.getId(), days);
    }

    private List<SalesHistoryDto> getSalesHistoryForProduct(Long productId, int days) {
        return saleRepository
                .findSaleItemsByProductAndDate(
                        productId, LocalDate.now().minusDays(days).atStartOfDay())
                .stream()
                .collect(Collectors.groupingBy(
                        item -> item.getSale().getSaleDate().toLocalDate(),
                        Collectors.summingInt(SaleItem::getQuantity)))
                .entrySet()
                .stream()
                .map(e -> new SalesHistoryDto(e.getKey().toString(), e.getValue()))
                .sorted(Comparator.comparing(SalesHistoryDto::getDate))
                .toList();
    }

    private SaleResponse toResponse(Sale sale) {
        List<SaleItemResponse> items = sale.getItems().stream()
                .map(item -> new SaleItemResponse(
                        item.getProduct().getId(),
                        item.getProductName(),
                        item.getProductSku(),
                        item.getQuantity(),
                        // These DTOs expect double – safe conversion only here at boundary
                        item.getUnitPrice() != null ? item.getUnitPrice().doubleValue() : 0.0,
                        item.getSubtotal() != null ? item.getSubtotal().doubleValue() : 0.0
                ))
                .toList();

        return new SaleResponse(
                sale.getId(),
                sale.getSaleDate(),
                sale.getTotalAmount() != null ? sale.getTotalAmount().doubleValue() : 0.0,
                items
        );
    }
}