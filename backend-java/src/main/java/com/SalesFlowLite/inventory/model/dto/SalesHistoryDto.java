// backend-java/src/main/java/com/SalesFlowLite/inventory/model/dto/SalesHistoryDto.java
package com.SalesFlowLite.inventory.model.dto;

public class SalesHistoryDto {
    private String date;      // Format: "yyyy-MM-dd"
    private Integer quantity;

    // Constructors
    public SalesHistoryDto() {}

    public SalesHistoryDto(String date, Integer quantity) {
        this.date = date;
        this.quantity = quantity;
    }

    // Getters and Setters
    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}