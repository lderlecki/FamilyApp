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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

@ActiveProfiles("test")
@DataJpaTest
@AutoConfigureTestDatabase(replace = NONE)
public class ToDoListRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ToDoListRepository toDoListRepository;

    public ToDoList prepareToDoList(String imie,String nazwisko,String opis,String nazwa){
        Profile profile = new Profile();
        profile.setName(imie);
        entityManager.persist(profile);
        entityManager.flush();
        Family family=new Family();
        family.setFamilyName(nazwisko);
        family.setFamilyHead(profile);
        entityManager.persist(family);
        entityManager.flush();
        ToDoList toDoList=new ToDoList();
        toDoList.setDescription(opis);
        toDoList.setName(nazwa);
        toDoList.setFamily(family);
        toDoList.setDueDate(LocalDateTime.now());
        return toDoList;
    }
    @Test
    public void whenFindById() {

        ToDoList toDoList=prepareToDoList("wojtek","Kowalscy","wyrzuć śmieci","lista na dziś");
        entityManager.persist(toDoList);
        entityManager.flush();


        ToDoList testToDoList= toDoListRepository.findById(toDoList.getId());
        assertThat(testToDoList.getName()).isEqualTo(testToDoList.getName());
    }

    @Test
    public void whenFindByFamily(){
        ToDoList toDoList=prepareToDoList("wojtek","Kowalscy","wyrzuć śmieci","lista na dziś");
        entityManager.persist(toDoList);
        entityManager.flush();
        ToDoList toDoList2=prepareToDoList("Maciek","Kowalscy","ser,szynka","lista zakupów");
        toDoList2.setFamily(toDoList.getFamily());
        entityManager.persist(toDoList2);
        entityManager.flush();


        List<ToDoList> testListToDoList= toDoListRepository.findByFamily_Id(toDoList.getFamily().getId());
        assertThat(testListToDoList.size()).isEqualTo(2);
    }
}
