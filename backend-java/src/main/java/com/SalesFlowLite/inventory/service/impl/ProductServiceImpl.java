package com.SalesFlowLite.inventory.service.impl;

import com.SalesFlowLite.inventory.exception.InsufficientStockException;
import com.SalesFlowLite.inventory.exception.ProductNotFoundException;
import com.SalesFlowLite.inventory.model.dto.ProductDto;
import com.SalesFlowLite.inventory.model.entity.InventoryItem;
import com.SalesFlowLite.inventory.model.entity.Product;
import com.SalesFlowLite.inventory.repository.InventoryRepository;
import com.SalesFlowLite.inventory.repository.ProductRepository;
import com.SalesFlowLite.inventory.service.ProductService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final EntityManager em;

    @Override
    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        Product product = Product.builder()
                .name(dto.getName())
                .sku(dto.getSku())
                // FIXED: direct BigDecimal assignment (dto.price is already BigDecimal)
                .price(dto.getPrice() != null ? dto.getPrice() : BigDecimal.ZERO)
                .stockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : 0)
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .lowStockThreshold(dto.getLowStockThreshold() != null ? dto.getLowStockThreshold() : 10)
                .build();

        Product saved = productRepository.save(product);
        syncProductToInventory(saved);
        return toDto(saved);
    }

    private void syncProductToInventory(Product product) {
        InventoryItem inventoryItem = inventoryRepository.findBySku(product.getSku())
                .orElseGet(() -> {
                    InventoryItem newItem = InventoryItem.builder()
                            .sku(product.getSku())
                            .name(product.getName())
                            .description(product.getDescription())
                            // FIXED: direct BigDecimal from product.price
                            .price(product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO)
                            .cost(BigDecimal.ZERO)
                            .category("Uncategorized")
                            .quantity(0)
                            .build();
                    return inventoryRepository.save(newItem);
                });

        inventoryItem.setQuantity(inventoryItem.getQuantity() + product.getStockQuantity());
        inventoryRepository.save(inventoryItem);
    }

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public ProductDto getProductById(Long id) {
        return toDto(findByIdOrThrow(id));
    }

    @Override
    public ProductDto getProductByName(String name) {
        return toDto(findByNameOrThrow(name));
    }

    @Override
    public ProductDto getProductBySku(String sku) {
        return toDto(findBySkuOrThrow(sku));
    }

    @Override
    @Transactional(readOnly = true)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    public Product findByIdWithPessimisticLock(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    @Override
    public Product findProductEntityBySku(String sku) {
        return productRepository.findBySku(sku)
                .orElseThrow(() -> new ProductNotFoundException("sku", sku));
    }

    @Override
    public Product findProductEntityByName(String name) {
        return productRepository.findByName(name)
                .orElseThrow(() -> new ProductNotFoundException("name", name));
    }

    @Override
    @Transactional(readOnly = true)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    public Product findBySkuWithPessimisticLock(String sku) {
        return productRepository.findBySku(sku)
                .orElseThrow(() -> new ProductNotFoundException("sku", sku));
    }

    @Override
    @Transactional
    public void reduceStock(Product product, int quantity) {
        int current = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
        if (current < quantity) {
            throw new InsufficientStockException("Not enough stock for product " + product.getSku());
        }
        product.setStockQuantity(current - quantity);
        productRepository.save(product);
    }

    @Override
    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = findByIdOrThrow(id);
        updateFields(product, dto);
        Product saved = productRepository.save(product);
        syncProductToInventory(saved);
        return toDto(saved);
    }

    @Override
    @Transactional
    public ProductDto updateProductByName(String name, ProductDto dto) {
        Product product = findByNameOrThrow(name);
        updateFields(product, dto);
        Product saved = productRepository.save(product);
        syncProductToInventory(saved);
        return toDto(saved);
    }

    @Override
    @Transactional
    public ProductDto updateProductBySku(String sku, ProductDto dto) {
        Product product = findBySkuOrThrow(sku);
        updateFields(product, dto);
        Product saved = productRepository.save(product);
        syncProductToInventory(saved);
        return toDto(saved);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteProductByName(String name) {
        Product product = findByNameOrThrow(name);
        productRepository.delete(product);
    }

    @Override
    @Transactional
    public void deleteProductBySku(String sku) {
        Product product = findBySkuOrThrow(sku);
        productRepository.delete(product);
    }

    @Override
    public List<ProductDto> getLowStockProducts() {
        return productRepository.findLowStockProducts().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public List<ProductDto> getUpdatedProductsSince(Long timestamp) {
        if (timestamp == null || timestamp <= 0) {
            return getAllProducts();
        }
        return productRepository.findByLastUpdatedGreaterThan(timestamp).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private Product findByIdOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    private Product findByNameOrThrow(String name) {
        return productRepository.findByName(name)
                .orElseThrow(() -> new ProductNotFoundException("name", name));
    }

    private Product findBySkuOrThrow(String sku) {
        return productRepository.findBySku(sku)
                .orElseThrow(() -> new ProductNotFoundException("sku", sku));
    }

    private void updateFields(Product product, ProductDto dto) {
        product.setName(dto.getName());
        product.setSku(dto.getSku());
        // FIXED: direct BigDecimal assignment
        product.setPrice(dto.getPrice() != null ? dto.getPrice() : BigDecimal.ZERO);
        product.setStockQuantity(dto.getStockQuantity());
        product.setDescription(dto.getDescription());
        product.setImageUrl(dto.getImageUrl());
        product.setLowStockThreshold(dto.getLowStockThreshold());
    }

    private ProductDto toDto(Product p) {
        return ProductDto.builder()
                .id(p.getId())
                .name(p.getName())
                .sku(p.getSku())
                // FIXED: direct BigDecimal (no double conversion)
                .price(p.getPrice())
                .stockQuantity(p.getStockQuantity())
                .description(p.getDescription())
                .imageUrl(p.getImageUrl())
                .lowStockThreshold(p.getLowStockThreshold())
                .build();
    }
}