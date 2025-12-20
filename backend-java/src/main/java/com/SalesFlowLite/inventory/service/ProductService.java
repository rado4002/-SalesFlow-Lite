package com.SalesFlowLite.inventory.service;

import com.SalesFlowLite.inventory.model.dto.ProductDto;
import com.SalesFlowLite.inventory.model.entity.Product;

import java.util.List;

public interface ProductService {

    ProductDto createProduct(ProductDto dto);

    List<ProductDto> getAllProducts();

    ProductDto getProductById(Long id);

    ProductDto getProductByName(String name);

    ProductDto getProductBySku(String sku);

    Product findByIdWithPessimisticLock(Long id);

    Product findProductEntityBySku(String sku);

    Product findProductEntityByName(String name);

    ProductDto updateProduct(Long id, ProductDto dto);

    ProductDto updateProductByName(String name, ProductDto dto);

    ProductDto updateProductBySku(String sku, ProductDto dto);

    void deleteProduct(Long id);

    void deleteProductByName(String name);

    void deleteProductBySku(String sku);

    List<ProductDto> getLowStockProducts();

    void reduceStock(Product product, int quantity);

    List<ProductDto> getUpdatedProductsSince(Long timestamp);

    // === NEW: SKU with pessimistic lock (fixes compilation in SaleServiceImpl) ===
    Product findBySkuWithPessimisticLock(String sku);
}