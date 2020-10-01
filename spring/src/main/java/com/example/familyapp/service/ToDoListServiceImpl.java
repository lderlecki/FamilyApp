package com.example.familyapp.service;

import com.example.familyapp.dao.ToDoListRepository;

import com.example.familyapp.model.ToDoList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class ToDoListServiceImpl implements ToDoListService{

    private ToDoListRepository toDoListRepository;

    @Autowired
    public ToDoListServiceImpl(ToDoListRepository toDoListRepository)
    {
        this.toDoListRepository=toDoListRepository;
    }

    @Override
    public ToDoList findById(long toDoListId) {
        return toDoListRepository.findById(toDoListId);
    }

    @Override
    public ToDoList save(ToDoList task) {
        return toDoListRepository.save(task);
    }

    @Override
    public List<ToDoList> findByFamilyId(long familyId) {
        return toDoListRepository.findByFamily_Id(familyId);
    }

    @Override
    public void delete(ToDoList toDoList) {
        toDoListRepository.delete(toDoList);
    }
}
