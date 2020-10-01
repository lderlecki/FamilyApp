package com.example.familyapp.service;

import com.example.familyapp.dao.TaskRepository;
import com.example.familyapp.model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class TaskServiceImpl implements TaskService {
    private TaskRepository taskRepository;

    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository)
    {
        this.taskRepository=taskRepository;
    }

    @Override
    public Task findById(long taskId) {
        return taskRepository.findById(taskId);
    }

    @Override
    public Task save(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public void delete(Task task) {
    taskRepository.delete(task);
    }
}
