package com.SalesFlowLite.inventory.service.impl;

import com.SalesFlowLite.inventory.exception.InsufficientStockException;
import com.SalesFlowLite.inventory.exception.ProductNotFoundException;
import com.SalesFlowLite.inventory.model.dto.ProductDto;
import com.SalesFlowLite.inventory.model.entity.Product;
import com.SalesFlowLite.inventory.repository.ProductRepository;
import com.SalesFlowLite.inventory.service.ProductService;
import jakarta.persistence.LockModeType;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    // ----------------------------------------------------------
    // CREATE PRODUCT
    // ----------------------------------------------------------
    @Override
    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        Product product = Product.builder()
                .name(dto.getName())
                .sku(dto.getSku())
                .price(dto.getPrice())
                .stockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : 0)
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .lowStockThreshold(dto.getLowStockThreshold() != null ? dto.getLowStockThreshold() : 10)
                .build();

        return toDto(productRepository.save(product));
    }

    // ----------------------------------------------------------
    // READ PRODUCTS
    // ----------------------------------------------------------
    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public ProductDto getProductById(Long id) {
        return toDto(findByIdOrThrow(id));
    }

    // ----------------------------------------------------------
    // LOCKED READ FOR STOCK DEDUCTION
    // ----------------------------------------------------------
    @Override
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    public Product findByIdWithPessimisticLock(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    // ----------------------------------------------------------
    // UPDATE STOCK (FIXED VERSION)
    // ----------------------------------------------------------
    @Override
    @Transactional
    public void reduceStock(Product product, int quantity) {
        int current = product.getStockQuantity() != null ? product.getStockQuantity() : 0;

        if (current < quantity) {
            throw new InsufficientStockException("Not enough stock for product " + product.getSku());
        }

        int newQuantity = current - quantity;
        product.setStockQuantity(newQuantity);

        // 🔥 CRITICAL FIX: EXPLICIT SAVE (forces DB update)
        productRepository.save(product);
    }

    // ----------------------------------------------------------
    // UPDATE PRODUCT
    // ----------------------------------------------------------
    @Override
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = findByIdOrThrow(id);

        product.setName(dto.getName());
        product.setSku(dto.getSku());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setDescription(dto.getDescription());
        product.setImageUrl(dto.getImageUrl());
        product.setLowStockThreshold(dto.getLowStockThreshold());

        return toDto(productRepository.save(product));
    }

    // ----------------------------------------------------------
    // DELETE PRODUCT
    // ----------------------------------------------------------
    @Override
    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // ----------------------------------------------------------
    // LOW STOCK DETECTION
    // ----------------------------------------------------------
    @Override
    public List<ProductDto> getLowStockProducts() {
        return productRepository.findLowStockProducts()
                .stream()
                .map(this::toDto)
                .toList();
    }

    // ----------------------------------------------------------
    // INTERNAL HELPERS
    // ----------------------------------------------------------
    private Product findByIdOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    private ProductDto toDto(Product p) {
        return ProductDto.builder()
                .id(p.getId())
                .name(p.getName())
                .sku(p.getSku())
                .price(p.getPrice())
                .stockQuantity(p.getStockQuantity())
                .description(p.getDescription())
                .imageUrl(p.getImageUrl())
                .lowStockThreshold(p.getLowStockThreshold())
                .build();
    }
}
