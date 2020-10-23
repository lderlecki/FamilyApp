package com.example.familyapp.unit.controll;


import com.example.familyapp.config.JwtAuthenticationEntryPoint;
import com.example.familyapp.config.JwtToken;
import com.example.familyapp.controller.UserController;
import com.example.familyapp.dao.UserRepository;
import com.example.familyapp.model.User;

import com.example.familyapp.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.hamcrest.core.Is.is;


@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mvc;

    @InjectMocks
    UserController userController;
    @MockBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    @MockBean
    UserDetailsService userDetailsService;
    @MockBean
    UserService userService;
    @MockBean
    UserRepository userRepository;
    @MockBean
    JwtToken jwtToken;

    @BeforeEach
    public void setup(){
        MockitoAnnotations.initMocks(this); //without this you will get NPE
    }

    @Test
    public void getUserbyId() throws Exception {

        User user = new User();
        user.setEmail("tomek@tlen.pl");

        given(userController.getUser(user.getId())).willReturn(user);

        mvc.perform(get("/user/?id="+user.getId())
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("email", is(user.getEmail())));

    }

    @Test
    public void updateUser() throws Exception {

        mvc.perform(put("/user/")
                .contentType(APPLICATION_JSON)
                .content("{\n" +
                        "    \"id\": 1,\n" +
                        "    \"email\": \"testtest@gmail.com\",\n" +
                        "    \"password\": \"null\",\n" +
                        "    \"date_joined\": \"2020-09-27T21:06:27.893656\",\n" +
                        "    \"last_login\": \"2020-09-27T21:06:27.893656\",\n" +
                        "    \"profile\": null,\n" +
                        "    \"is_admin\": true,\n" +
                        "    \"is_active\": true,\n" +
                        "    \"is_staff\": true,\n" +
                        "    \"is_superuser\": true\n" +
                        "}"))
                .andExpect(status().isOk());
    }

    @Test
    public void postUser() throws Exception {
        mvc.perform(put("/user/")
                .contentType(APPLICATION_JSON)
                .content("{\n" +
                        "    \"id\": 1,\n" +
                        "    \"email\": \"testtest@gmail.com\",\n" +
                        "    \"password\": \"null\",\n" +
                        "    \"date_joined\": \"2020-09-27T21:06:27.893656\",\n" +
                        "    \"last_login\": \"2020-09-27T21:06:27.893656\",\n" +
                        "    \"profile\": null,\n" +
                        "    \"is_admin\": true,\n" +
                        "    \"is_active\": true,\n" +
                        "    \"is_staff\": true,\n" +
                        "    \"is_superuser\": true\n" +
                        "}"))
                .andExpect(status().isOk());
    }

    @Test
    public void deleteUser() throws Exception {

        mvc.perform(delete("/user/?id="+1))
                .andExpect(status().isOk());

    }


}
