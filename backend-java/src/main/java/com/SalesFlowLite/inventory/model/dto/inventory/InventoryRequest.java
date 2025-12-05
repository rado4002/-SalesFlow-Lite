package com.SalesFlowLite.inventory.model.dto.inventory;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryRequest {

    @NotBlank
    private String name;

    private String description;

    @NotNull
    @Min(0)
    private Integer quantity;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal cost;

    @NotBlank
    private String category;
}
