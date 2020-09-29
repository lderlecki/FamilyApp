package com.example.familyapp.dao;

import com.example.familyapp.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Transactional
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Task findById(long id);
}
