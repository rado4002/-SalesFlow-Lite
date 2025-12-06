package com.SalesFlowLite.inventory.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;

public interface AuthenticationEntryPoint {
    void commence(HttpServletRequest request,
                  HttpServletResponse response,
                  AuthenticationException authException);
}
