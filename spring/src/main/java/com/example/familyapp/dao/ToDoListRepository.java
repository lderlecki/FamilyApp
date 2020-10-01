package com.example.familyapp.dao;

import com.example.familyapp.model.ToDoList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Repository
public interface ToDoListRepository extends JpaRepository<ToDoList, Long> {
    List<ToDoList> findByFamily_Id(long familyId);
    ToDoList findById(long id);
}
