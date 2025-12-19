package com.SalesFlowLite.inventory.exception;

public class ProductNotFoundException extends RuntimeException {

    public ProductNotFoundException(Long id) {
        super("Product with id " + id + " not found");
    }

    public ProductNotFoundException(String field, String value) {
        super("Product with " + field + " '" + value + "' not found");
    }
}