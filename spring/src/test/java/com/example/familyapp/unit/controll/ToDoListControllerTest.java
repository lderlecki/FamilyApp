package com.example.familyapp.unit.controll;

import com.example.familyapp.config.JwtAuthenticationEntryPoint;
import com.example.familyapp.config.JwtToken;
import com.example.familyapp.controller.ToDoListController;
import com.example.familyapp.dao.ToDoListRepository;
import com.example.familyapp.model.ToDoList;
import com.example.familyapp.service.ProfileService;
import com.example.familyapp.service.ToDoListService;
import com.example.familyapp.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.core.Is.is;
import static org.mockito.BDDMockito.given;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ToDoListController.class)
public class ToDoListControllerTest {


    @Autowired
    MockMvc mvc;

    @InjectMocks
    ToDoListController toDoListController;

    @MockBean
    ToDoListService toDoListService;
    @MockBean
    ProfileService profileService;
    @MockBean
    ToDoListRepository toDoListRepository;

    @MockBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    @MockBean
    UserDetailsService userDetailsService;
    @MockBean
    UserService userService;
    @MockBean
    JwtToken jwtToken;

    @BeforeEach
    public void setup(){
        MockitoAnnotations.initMocks(this); //without this you will get NPE
    }

    @Test
    public void getToDoListbyId() throws Exception {

        ToDoList toDoList=new ToDoList();
        toDoList.setName("lista na dziś");

        given(toDoListController.getToDoList(toDoList.getId())).willReturn(toDoList);

        mvc.perform(get("/todolist/?id="+toDoList.getId())
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("name", is(toDoList.getName())));


    }

    @Test
    public void updateToDoList() throws Exception {
        ToDoList toDoList=new ToDoList();
        toDoList.setName("lista na dziś");

        mvc.perform(put("/todolist/")
                .contentType(APPLICATION_JSON)
                .content(toJson(toDoList)))
                .andExpect(status().isOk());
    }

    @Test
    public void postToDOList() throws Exception {
        ToDoList toDoList=new ToDoList();
        toDoList.setName("lista na dziś");


        mvc.perform(post("/todolist/")
                .contentType(APPLICATION_JSON)
                .content(toJson(toDoList)))
                .andExpect(status().isOk());
    }

    //DELETING NEEDS FULL AUTHORIZATION OTHERWISE STATUS 405 IS RETURNED
    @Test
    public void deleteToDoList() throws Exception {

        mvc.perform(delete("/todolist/?id="+1))
                .andExpect(status().is(405));

    }


    private String toJson(Object object) throws JsonProcessingException {
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        return ow.writeValueAsString(object);
    }

}
