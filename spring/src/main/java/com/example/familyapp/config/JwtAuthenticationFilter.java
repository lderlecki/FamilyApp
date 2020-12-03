package com.example.familyapp.config;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.example.familyapp.model.User;
import com.example.familyapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.ProviderNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static RequestMatcher requestMatcher;
    private HttpServletResponse response;
    @Autowired
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    @Autowired
    private UserService userDetailsService;

    @Autowired
    private JwtToken jwtToken;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        String authToken = req.getHeader(JwtToken.HEADER_STRING);
        if (authToken != null) {
            authToken = authToken.replace("Bearer ", "");
            Integer id = null;
            try {
                id = jwtToken.getIdFromToken(authToken);
            } catch (Exception ex) {
                if (ex instanceof TokenExpiredException) {
                    logger.error(ex.getMessage());
                    jwtAuthenticationEntryPoint.commence(req, res, new AuthenticationException(ex.getMessage() + " current date is "+ new Date() ) {
                    });
                } else if (ex instanceof SignatureVerificationException) {
                    logger.error(ex.getMessage());
                    jwtAuthenticationEntryPoint.commence(req, res, new AuthenticationException(ex.getMessage()) {
                    });
                }
            }
            if (id != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                User user = userDetailsService.findById(id);
                UserDetails userDetails = userDetailsService.loadUserByEmail(user.getEmail());
                //zmiana
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null,
                                //INSERT GET ROLE HERE
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                SecurityContextHolder.getContext().setAuthentication(authentication);

                logger.info("User: " + id + " authenticated");
                chain.doFilter(req, res);
            }

        } else {
            String msg="JWT Token not found";
            logger.error(msg);
            jwtAuthenticationEntryPoint.commence(req, res, new AuthenticationException(msg) {
            });
        }


    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return requestMatcher.matches(request);
    }


    public static void ignorePatterns(String... antPatterns) {
        List<RequestMatcher> matchers = new ArrayList<>();
        for (String pattern : antPatterns) {
            matchers.add(new AntPathRequestMatcher(pattern, null));
        }
        requestMatcher = new OrRequestMatcher(matchers);
    }

    static {
        final String[] publicEndPoints = {"/token/generate-token", "/.~~spring-boot!~/restart"};
        ignorePatterns(publicEndPoints);
    }


}
