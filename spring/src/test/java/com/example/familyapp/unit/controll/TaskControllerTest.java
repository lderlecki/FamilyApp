//package com.example.familyapp.unit.controll;
//
//import com.example.familyapp.config.JwtAuthenticationEntryPoint;
//import com.example.familyapp.config.JwtToken;
//import com.example.familyapp.controller.TaskController;
//import com.example.familyapp.dao.TaskRepository;
//import com.example.familyapp.model.Task;
//import com.example.familyapp.service.TaskService;
//import com.example.familyapp.service.UserService;
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.databind.ObjectWriter;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.MockitoAnnotations;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.test.web.servlet.MockMvc;
//
//import static org.hamcrest.core.Is.is;
//import static org.mockito.BDDMockito.given;
//import static org.springframework.http.MediaType.APPLICATION_JSON;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@WebMvcTest(TaskController.class)
//public class TaskControllerTest {
//
//        @Autowired
//        private MockMvc mvc;
//
//        @InjectMocks
//        TaskController taskController;
//
//        @MockBean
//        JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
//        @MockBean
//        TaskService taskService;
//        @MockBean
//        TaskRepository taskRepository;
//        @MockBean
//        UserDetailsService userDetailsService;
//        @MockBean
//        UserService userService;
//        @MockBean
//        JwtToken jwtToken;
//
//        @BeforeEach
//        public void setup(){
//            MockitoAnnotations.initMocks(this); //without this you will get NPE
//        }
//
//
//        @Test
//        public void getTaskbyId() throws Exception {
//
//            Task task=new Task();
//            task.setName("wyrzuć śmieci");
//
//            given(taskController.getTask(task.getId())).willReturn(task);
//
//            mvc.perform(get("/task/?id="+task.getId())
//                    .contentType(APPLICATION_JSON))
//                    .andExpect(status().isOk())
//                    .andExpect(jsonPath("name", is(task.getName())));
//
//
//        }
//
//        @Test
//        public void updateTask() throws Exception {
//            Task task=new Task();
//            task.setName("wyrzuć śmieci");
//
//            mvc.perform(put("/task/")
//                    .contentType(APPLICATION_JSON)
//                    .content(toJson(task)))
//                    .andExpect(status().isOk());
//        }
//
//        @Test
//        public void postTask() throws Exception {
//            Task task=new Task();
//            task.setName("wyrzuć śmieci");
//
//
//            mvc.perform(post("/task/")
//                    .contentType(APPLICATION_JSON)
//                    .content(toJson(task)))
//                    .andExpect(status().isOk());
//        }
//
//        @Test
//        public void deleteTask() throws Exception {
//
//            mvc.perform(delete("/task/?id="+1))
//                    .andExpect(status().isOk());
//
//        }
//
//
//        private String toJson(Object object) throws JsonProcessingException {
//            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
//            return ow.writeValueAsString(object);
//        }
//}
