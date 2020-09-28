package com.example.familyapp.service;

import com.example.familyapp.model.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface UserService {

    User findById(long id);
    User save(User user);
    void delete(User user);
    User findByEmail(String email);
    UserDetails loadUserByEmail(String email);
    List<SimpleGrantedAuthority> getAuthority();
}
