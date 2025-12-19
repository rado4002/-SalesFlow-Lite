package com.SalesFlowLite.inventory.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {

    private final ErrorCode code;

    public BusinessException(ErrorCode code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(ErrorCode code, String message, Object... args) {
        super(String.format(message, args));
        this.code = code;
    }

    public ErrorCode getCode() {
        return code;
    }
}