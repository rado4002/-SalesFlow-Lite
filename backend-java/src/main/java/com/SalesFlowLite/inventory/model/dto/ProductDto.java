package com.SalesFlowLite.inventory.model.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {

    private Long id;

    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "SKU is required")
    @Size(max = 50, message = "SKU cannot exceed 50 characters")
    private String sku;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price must be zero or positive")
    private BigDecimal price;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    @Builder.Default
    private Integer stockQuantity = 0;

    private String description;      // optional

    private String imageUrl;         // optional

    @Min(value = 1, message = "Low stock threshold must be at least 1")
    @Builder.Default
    private Integer lowStockThreshold = 10;  // sensible default
}