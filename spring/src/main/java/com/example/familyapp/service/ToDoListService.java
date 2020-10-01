package com.example.familyapp.service;

import com.example.familyapp.model.ToDoList;

import java.util.List;

public interface ToDoListService {
    ToDoList findById(long toDoListId);
    ToDoList save(ToDoList task);
    List<ToDoList> findByFamilyId(long familyId);
    void delete(ToDoList toDoList);
}
