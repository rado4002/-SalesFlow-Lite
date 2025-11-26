package com.SalesFlowLite.inventory.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SalesFlow-Lite API")
                        .description("Lightweight sales and inventory management for small merchants. CRUD products, enter sales, track stock.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("BackendBuddy Team")
                                .email("dev@salesflow-lite.com")  // Placeholder — update later
                        )
                );
    }
}
