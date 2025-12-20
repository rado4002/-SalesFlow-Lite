package com.SalesFlowLite.inventory.model.dto.inventory;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryUpdateRequest {

    // All fields optional for partial update – only update what's sent
    private String sku;                  // Optional
    private String name;                 // Optional
    private String description;          // Optional

    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;            // Optional, but validated if present

    @DecimalMin(value = "0.0", message = "Price cannot be negative")
    private BigDecimal price;            // Optional, validated if present

    @DecimalMin(value = "0.0", message = "Cost cannot be negative")
    private BigDecimal cost;             // Optional, validated if present

    private String category;             // Optional
}