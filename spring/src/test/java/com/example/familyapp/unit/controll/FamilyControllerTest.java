package com.example.familyapp.unit.controll;

import com.example.familyapp.config.JwtAuthenticationEntryPoint;
import com.example.familyapp.config.JwtToken;
import com.example.familyapp.controller.FamilyController;
import com.example.familyapp.dao.FamilyRepository;
import com.example.familyapp.model.Family;
import com.example.familyapp.service.FamilyService;
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

import static org.mockito.BDDMockito.given;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.hamcrest.core.Is.is;


@WebMvcTest(FamilyController.class)
public class FamilyControllerTest {

    @Autowired
    private MockMvc mvc;

    @InjectMocks
    FamilyController familyController;

    @MockBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    @MockBean
    FamilyService familyService;
    @MockBean
    FamilyRepository familyRepository;
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
    public void getFamilybyId() throws Exception {

        Family family = new Family();
        family.setFamilyName("Grabowscy");
        family.setBudget(555);

        given(familyController.getFamily(family.getId())).willReturn(family);

        mvc.perform(get("/family/?id="+family.getId())
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("familyName", is(family.getFamilyName())))
                .andExpect(jsonPath("budget", is(family.getBudget())));


    }

    @Test
    public void updateFamily() throws Exception {
        Family family = new Family();
        family.setFamilyName("Grabowscy");

        mvc.perform(put("/family/")
                .contentType(APPLICATION_JSON)
                .content(toJson(family)))
                .andExpect(status().isOk());
    }

    @Test
    public void postFamily() throws Exception {
        Family family = new Family();
        family.setFamilyName("Grabowscy");


        mvc.perform(post("/family/")
                .contentType(APPLICATION_JSON)
                .content(toJson(family)))
                .andExpect(status().isOk());
    }

    @Test
    public void deleteProfile() throws Exception {

        mvc.perform(delete("/family/?id="+1))
                .andExpect(status().isOk());

    }


    private String toJson(Object object) throws JsonProcessingException {
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        return ow.writeValueAsString(object);
    }

}
