package com.SalesFlowLite.inventory.service;

import com.SalesFlowLite.inventory.model.dto.ProductDto;
import com.SalesFlowLite.inventory.model.entity.Product;
import java.util.List;

public interface ProductService {

    ProductDto createProduct(ProductDto dto);

    List<ProductDto> getAllProducts();

    ProductDto getProductById(Long id);

    Product findByIdWithPessimisticLock(Long id);  // ← for safe stock deduction

    ProductDto updateProduct(Long id, ProductDto dto);

    void deleteProduct(Long id);

    List<ProductDto> getLowStockProducts();

    void reduceStock(Product product, int quantity);  // ← safe stock reduction
}