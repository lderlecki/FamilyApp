package com.example.familyapp.unit.controll;

import com.example.familyapp.config.JwtAuthenticationEntryPoint;
import com.example.familyapp.config.JwtToken;
import com.example.familyapp.controller.AddressController;
import com.example.familyapp.dao.AddressRepository;
import com.example.familyapp.model.Address;
import com.example.familyapp.service.AddressService;
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

@WebMvcTest(AddressController.class)
public class AdressControllerTest {

    @Autowired
    private MockMvc mvc;

    @InjectMocks
    AddressController addressController;

    @MockBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    @MockBean
    AddressService addressService;
    @MockBean
    AddressRepository  addressRepository;
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
    public void getAddressbyId() throws Exception {

        Address address = new Address();
        address.setCity("Łódź");

        given(addressController.getAddress(address.getId())).willReturn(address);

        mvc.perform(get("/address/?id="+address.getId())
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("city", is(address.getCity())));


    }

    @Test
    public void updateAddress() throws Exception {
        Address address = new Address();
        address.setCity("Łódź");

        mvc.perform(put("/address/")
                .contentType(APPLICATION_JSON)
                .content(toJson(address)))
                .andExpect(status().isOk());
    }

    @Test
    public void postAddress() throws Exception {
        Address address = new Address();
        address.setCity("Łódź");


        mvc.perform(post("/address/")
                .contentType(APPLICATION_JSON)
                .content(toJson(address)))
                .andExpect(status().isOk());
    }

    @Test
    public void deleteAddress() throws Exception {

        mvc.perform(delete("/address/?id="+1))
                .andExpect(status().isOk());

    }


    private String toJson(Object object) throws JsonProcessingException {
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        return ow.writeValueAsString(object);
    }

}
