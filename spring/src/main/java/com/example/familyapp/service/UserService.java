package com.example.familyapp.service;

import com.example.familyapp.model.User;

public interface UserService {

    User findById(long id);
    User save(User user);
    void delete(User user);
}
