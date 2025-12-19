package com.SalesFlowLite.inventory.model.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

/**
 * New DTO for single sale creation – the main merchant flow.
 * Why object? Allows future fields (customer, notes, discount) without breaking array clients.
 * Items list required + at least one.
 */
public record CreateSingleSaleRequest(
        // Optional future fields
        Long customerId,

        @NotEmpty(message = "Sale must have at least one item")
        @Size(min = 1, message = "Sale must have at least one item")
        @Valid
        List<SaleItemRequest> items
) {
    // Defensive copy + default
    public List<SaleItemRequest> items() {
        return items == null ? new ArrayList<>() : List.copyOf(items);
    }
}