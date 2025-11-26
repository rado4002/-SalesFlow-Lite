package com.SalesFlowLite.inventory.service.impl;

import com.SalesFlowLite.inventory.exception.InsufficientStockException;
import com.SalesFlowLite.inventory.model.dto.CreateSaleRequest;
import com.SalesFlowLite.inventory.model.dto.SaleItemResponse;
import com.SalesFlowLite.inventory.model.dto.SaleResponse;
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
import java.time.LocalDateTime;
import java.util.List;

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
