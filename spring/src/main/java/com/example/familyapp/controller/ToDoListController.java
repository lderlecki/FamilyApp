package com.example.familyapp.controller;


import com.example.familyapp.config.JwtToken;
import com.example.familyapp.model.ToDoList;
import com.example.familyapp.service.ProfileService;
import com.example.familyapp.service.ToDoListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/todolist")
public class ToDoListController {
    private ToDoListService toDoListService;
    private ProfileService profileService;

    @Autowired
    public ToDoListController(ToDoListService toDoListService, ProfileService profileService
    ) {
        this.toDoListService = toDoListService;
        this.profileService = profileService;
    }

    @PostMapping(value = "/")
    ToDoList saveToDoList(@RequestBody ToDoList toDoList){
        return toDoListService.save(toDoList);
    }
    @GetMapping(value = "/")
    public ToDoList getToDoList(@RequestParam long id){
        return toDoListService.findById(id);
    }
    @PutMapping(value = "/")
    ToDoList updateToDoList(@RequestBody ToDoList toDoList){
        return toDoListService.save(toDoList);
    }


    @GetMapping(value = "/forFamily")
    List<ToDoList> getTasksForFamily(@RequestHeader (name="Authorization") String token){
        long userId= JwtToken.getIdFromToken(token.replaceAll("Bearer ", ""));
        return toDoListService.findByFamilyId(profileService.findById(userId).getFamily().getId());
    }
}
