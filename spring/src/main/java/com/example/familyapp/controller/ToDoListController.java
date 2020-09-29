package com.example.familyapp.controller;


import com.example.familyapp.model.ToDoList;
import com.example.familyapp.service.ToDoListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/todolist")
public class ToDoListController {
    private ToDoListService toDoListService;

    @Autowired
    public ToDoListController(ToDoListService toDoListService) {
        this.toDoListService = toDoListService;
    }

    @PostMapping(value = "/")
    ToDoList saveToDoList(@RequestBody ToDoList toDoList){
        return toDoListService.save(toDoList);
    }
    @GetMapping(value = "/")
    ToDoList getToDoList(@RequestParam long id){
        return toDoListService.findById(id);
    }
    @PutMapping(value = "/")
    ToDoList updateToDoList(@RequestBody ToDoList toDoList){
        return toDoListService.save(toDoList);
    }

    @DeleteMapping(value = "/")
    void deleteToDoList(@RequestParam long id){
        toDoListService.delete(toDoListService.findById(id));
    }
}
