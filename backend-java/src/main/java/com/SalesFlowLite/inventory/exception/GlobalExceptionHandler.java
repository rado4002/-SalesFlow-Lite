package com.SalesFlowLite.inventory.exception;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // =========================================================
    // Product Not Found
    // =========================================================
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ApiError> handleProductNotFound(ProductNotFoundException ex, HttpServletRequest req) {

        ApiError error = ApiError.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .code("NOT_FOUND")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    // =========================================================
    // Insufficient Stock
    // =========================================================
    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<ApiError> handleInsufficientStock(InsufficientStockException ex, HttpServletRequest req) {

        ApiError error = ApiError.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .code("INSUFFICIENT_STOCK")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // =========================================================
    // Validation Errors (@Valid)
    // =========================================================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {

        Map<String, Object> validationDetails = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            validationDetails.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        ApiError error = ApiError.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .code("VALIDATION_ERROR")
                .message("Please fix the errors in your request")
                .details(validationDetails)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // =========================================================
    // Incorrect Login (Bad Credentials)
    // =========================================================
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsException ex, HttpServletRequest req) {

        ApiError error = ApiError.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .code("INVALID_CREDENTIALS")
                .message("Wrong phone number or password")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    // =========================================================
    // Authentication Errors
    // =========================================================
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handleAuth(AuthenticationException ex, HttpServletRequest req) {

        ApiError error = ApiError.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .code("AUTH_FAILED")
                .message("Authentication failed")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    // =========================================================
    // Access Denied (Role Permissions)
    // =========================================================
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex, HttpServletRequest req) {

        ApiError error = ApiError.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .code("ACCESS_DENIED")
                .message("You do not have permission to perform this action")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    // =========================================================
    // JWT Errors
    // =========================================================
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiError> handleExpiredJwt(ExpiredJwtException ex, HttpServletRequest req) {

        ApiError error = ApiError.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .code("TOKEN_EXPIRED")
                .message("Access token expired")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<ApiError> handleInvalidSignature(SignatureException ex, HttpServletRequest req) {

        ApiError error = ApiError.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .code("INVALID_SIGNATURE")
                .message("Invalid token signature")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    // =========================================================
    // Runtime Exception (Refresh token errors, etc.)
    // =========================================================
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiError> handleRuntime(RuntimeException ex, HttpServletRequest req) {

        ApiError error = ApiError.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .code("RUNTIME_ERROR")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // =========================================================
    // Catch-All Internal Server Error
    // =========================================================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleException(Exception ex, HttpServletRequest req) {

        ApiError error = ApiError.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .code("INTERNAL_ERROR")
                .message("Something went wrong. Try again later.")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
