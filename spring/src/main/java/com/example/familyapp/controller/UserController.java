package com.example.familyapp.controller;

import com.example.familyapp.model.User;
import com.example.familyapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/user")
public class UserController {

    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(value = "/")
    User saveUser(@RequestBody User user){
        return userService.save(user);
    }
    @GetMapping(value = "/")
    public User getUser(@RequestParam long id){
        return userService.findById(id);
    }
    @PutMapping(value = "/")
    User updateUser(@RequestBody User user){
        return userService.save(user);
    }

    @DeleteMapping(value = "/")
    void deleteUser(@RequestParam long id){
        userService.delete(userService.findById(id));
    }
}
