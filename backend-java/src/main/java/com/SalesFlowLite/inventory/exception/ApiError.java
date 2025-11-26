// src/main/java/com/SalesFlowLite/inventory/exception/ApiError.java
package com.SalesFlowLite.inventory.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Builder
public class ApiError {
    private HttpStatus status;
    private String code;
    private String message;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    private Map<String, Object> details;
}