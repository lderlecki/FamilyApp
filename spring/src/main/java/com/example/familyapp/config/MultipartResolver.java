package com.example.familyapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

public class MultipartResolver {

    @Configuration
    public class Config {


        @Bean(name = "multipartResolver")
        public CommonsMultipartResolver getCommonsMultipartResolver() {
            CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
            multipartResolver.setMaxUploadSize(20971520);   // 20MB
            multipartResolver.setMaxInMemorySize(1048576);  // 1MB
            return multipartResolver;
        }

    }
}
