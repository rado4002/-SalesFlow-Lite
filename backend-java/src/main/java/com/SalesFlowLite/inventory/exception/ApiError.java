package com.SalesFlowLite.inventory.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApiError {

    private int status;         // HTTP status code (e.g. 400, 404)
    private String code;        // Error code (e.g. VALIDATION_ERROR)
    private String message;     // Human-readable message

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    private Map<String, Object> details;  // Extra fields (optional)
}
