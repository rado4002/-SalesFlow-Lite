package com.SalesFlowLite.inventory.model.dto.inventory;

import jakarta.validation.constraints.Min;
import java.math.BigDecimal;

/**
 * Minimal DTO for merchant-friendly inventory adjustments.
 * Only quantity and cost – exactly what small shop owners change most often.
 * All fields optional for true partial update.
 */
public class InventoryAdjustRequest {

    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @Min(value = 0, message = "Cost cannot be negative")
    private BigDecimal cost;

    // Default constructor (required for JSON binding)
    public InventoryAdjustRequest() {}

    public InventoryAdjustRequest(Integer quantity, BigDecimal cost) {
        this.quantity = quantity;
        this.cost = cost;
    }

    // Getters and Setters
    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }
}