package com.example.familyapp.controller;


import com.example.familyapp.MyCorsFilter;
import com.example.familyapp.config.JwtToken;
import com.example.familyapp.dto.LoginUser;
import com.example.familyapp.dto.Token;
import com.example.familyapp.model.User;
import com.example.familyapp.service.UserService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/token")
@CrossOrigin(value = "*")
public class AuthenticationController {

    @Autowired
    private JwtToken jwtToken;

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/generate-token", method = RequestMethod.POST)
    @ApiOperation(value = "login method, returns DTO with token, email, password, role")
    public LoginUser register(@RequestBody LoginUser loginUser) {
        final User user = userService.findByEmail(loginUser.getEmail());
        final String token = jwtToken.generateToken(user);
        LoginUser userLogged = new LoginUser();
        userLogged.setToken(new Token(token));
        userLogged.setEmail(user.getEmail());
        userLogged.setRole("ROLE_ADMIN");//user.getUserRole().getName()
        return userLogged;
    }

}
