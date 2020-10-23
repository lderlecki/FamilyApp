package com.example.familyapp.unit.repository;


import com.example.familyapp.dao.TaskRepository;
import com.example.familyapp.dao.ToDoListRepository;
import com.example.familyapp.model.Family;
import com.example.familyapp.model.Profile;
import com.example.familyapp.model.Task;
import com.example.familyapp.model.ToDoList;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

@ActiveProfiles("test")
@DataJpaTest
@AutoConfigureTestDatabase(replace = NONE)
public class TaskRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TaskRepository taskRepository;

    @Test
    public void whenFindById() {

        Profile profile = new Profile();
        profile.setName("Błażej");
        entityManager.persist(profile);
        entityManager.flush();
        Family family=new Family();
        family.setFamilyName("Kowalscy");
        family.setFamilyHead(profile);
        entityManager.persist(family);
        entityManager.flush();
        ToDoList toDoList=new ToDoList();
        toDoList.setDescription("Wojtek");
        toDoList.setName("lista na dziś");
        toDoList.setFamily(family);
        toDoList.setDueDate(LocalDateTime.now());
        entityManager.persist(toDoList);
        entityManager.flush();
        Task task = new Task();
        task.setName("zrób zakupy");
        task.setDescription("chleb i szynka");
        task.setDone(false);
        task.setToDoList(toDoList);
        task.setResponsiblePerson(profile);
        entityManager.persist(task);
        entityManager.flush();

        Task testTask = taskRepository.findById(task.getId());
        assertThat(testTask.getName()).isEqualTo(task.getName());
    }
}
