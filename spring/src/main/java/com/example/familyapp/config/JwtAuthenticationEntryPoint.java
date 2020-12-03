package com.example.familyapp.config;

import java.io.IOException;
import java.io.Serializable;
import java.nio.file.AccessDeniedException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        // 401
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, authException.getMessage());
    }

//    @ExceptionHandler (value = {AccessDeniedException.class})
//    public void commence403(HttpServletRequest request, HttpServletResponse response,
//                         AccessDeniedException accessDeniedException) throws IOException {
//        // 403
//        response.sendError(HttpServletResponse.SC_FORBIDDEN, "Authorization Failed : " + accessDeniedException.getMessage());
//    }

}


