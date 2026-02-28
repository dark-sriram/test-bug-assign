package com.example.bugAssign.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Bug Tracker API")
                .version("1.0.0")
                .description("REST API for bug tracking system with strict workflow enforcement")
                .termsOfService("http://swagger.io/terms/")
                .contact(new Contact()
                    .name("Bug Tracker Team")
                    .email("support@bugtracker.com")
                    .url("https://bugtracker.com"))
                .license(new License()
                    .name("MIT License")
                    .url("https://opensource.org/licenses/MIT")));
    }
}

//adsda