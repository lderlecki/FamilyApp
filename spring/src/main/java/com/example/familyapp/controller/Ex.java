package com.example.familyapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Ex {

    @GetMapping(value= "/")
    public String msg()
    {
        return "new message";
    }
}
