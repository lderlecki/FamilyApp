//package com.example.familyapp.unit.controll;
//
//import com.example.familyapp.config.JwtToken;
//import com.example.familyapp.config.WebSecurityConfig;
//import com.example.familyapp.controller.AuthenticationController;
//import com.example.familyapp.controller.ProfileController;
//import com.example.familyapp.dao.ProfileRepository;
//import com.example.familyapp.dto.LoginUser;
//import com.example.familyapp.model.Profile;
//import com.example.familyapp.model.User;
//import com.example.familyapp.service.ProfileService;
//import com.example.familyapp.service.ProfileServiceImpl;
//import com.example.familyapp.service.UserService;
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.example.familyapp.config.JwtAuthenticationEntryPoint;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.databind.ObjectWriter;
//import org.aspectj.lang.annotation.Before;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.context.annotation.ComponentScan;
//import org.springframework.context.annotation.Import;
//import org.springframework.http.ResponseEntity;
//import org.springframework.mock.web.MockHttpServletRequest;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.MvcResult;
//import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
//import org.springframework.web.context.request.RequestContextHolder;
//import org.springframework.web.context.request.ServletRequestAttributes;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.BDDMockito.given;
//import static org.mockito.Mockito.when;
//import static org.springframework.http.MediaType.APPLICATION_JSON;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.hamcrest.core.Is.is;
//
//
//@WebMvcTest(ProfileController.class)
//public class ProfileControllerTest {
//
//   @Autowired
//    private MockMvc mvc;
//    @InjectMocks
//    ProfileController profileController;
//    @MockBean
//    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
//    @MockBean
//    ProfileService profileService;
//    @MockBean
//    ProfileRepository profileRepository;
//    @MockBean
//    UserDetailsService userDetailsService;
//    @MockBean
//    UserService userService;
//    @MockBean
//    JwtToken jwtToken;
//
//    @BeforeEach
//    public void setup(){
//        MockitoAnnotations.initMocks(this); //without this you will get NPE
//    }
//
//    @Test
//    public void getProfilebyId() throws Exception {
//
//        Profile profile = new Profile();
//        profile.setId(1);
//        profile.setName("Stanisław");
//        User user=new  User();
//        user.setEmail("test1@gmail.com");
//
//        given(userService.findById(1)).willReturn(user);
//        given(profileController.getProfile(profile.getId())).willReturn(profile);
//
//        mvc.perform(get("/profile/?id="+profile.getId())
//                .contentType(APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("name", is(profile.getName())))
//                .andExpect(jsonPath("surname", is(profile.getSurname())));
//
//    }
//
//    @Test
//    public void updateProfile() throws Exception {
//        Profile profile = new Profile();
//        profile.setName("Stanisław");
//
//        mvc.perform(put("/profile/")
//                .contentType(APPLICATION_JSON)
//                .content(toJson(profile)))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    public void postProfile() throws Exception {
//        Profile profile = new Profile();
//        profile.setName("Stanisław");
//
//        mvc.perform(post("/profile/")
//                .contentType(APPLICATION_JSON)
//                .content(toJson(profile)))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    public void deleteProfile() throws Exception {
//
//        mvc.perform(delete("/profile/?id="+1))
//                .andExpect(status().isOk());
//
//    }
//
//
//    private String toJson(Object object) throws JsonProcessingException {
//        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
//        return ow.writeValueAsString(object);
//    }
//
//}
