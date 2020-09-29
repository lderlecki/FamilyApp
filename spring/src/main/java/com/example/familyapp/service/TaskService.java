package com.example.familyapp.service;

import com.example.familyapp.model.Task;

public interface TaskService {
    Task findById(long taskId);
    Task save(Task task);
    void delete(Task task);
}
