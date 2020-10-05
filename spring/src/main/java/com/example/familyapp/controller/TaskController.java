package com.example.familyapp.controller;

import com.example.familyapp.model.Task;
import com.example.familyapp.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/task")
public class TaskController {
    private TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping(value = "/")
    Task saveTask(@RequestBody Task task){
        return taskService.save(task);
    }
    @GetMapping(value = "/")
    public Task getTask(@RequestParam long id){
        return taskService.findById(id);
    }
    @PutMapping(value = "/")
    Task updateTask(@RequestBody Task task){
        return taskService.save(task);
    }

    @DeleteMapping(value = "/")
    void deleteTask(@RequestParam long id){
        taskService.delete(taskService.findById(id));
    }
}
