package com.example.familyapp.config;

import java.io.IOException;
import java.util.Collections;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.example.familyapp.model.User;
import com.example.familyapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

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
            Integer id = jwtToken.getIdFromToken(authToken);
            if (id != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                User user = userDetailsService.findById(id);

                if (jwtToken.validateToken(authToken)) { // check expiration date here  , user
                    UserDetails userDetails=userDetailsService.loadUserByEmail(user.getEmail());
                    //zmiana
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null,
                                    //INSERT GET ROLE HERE
                                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    logger.info("User: " + id + " authenticated");
                }
                else {
                    logger.error("Wrong token!!!");
                }
            }
        }
        else {
            logger.warn("Couldn't find token");
        }

        chain.doFilter(req, res);
    }


}
