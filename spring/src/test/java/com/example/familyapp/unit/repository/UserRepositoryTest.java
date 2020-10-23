package com.example.familyapp.unit.repository;

import com.example.familyapp.dao.UserRepository;
import com.example.familyapp.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;

import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;
import static org.assertj.core.api.Assertions.assertThat;


@ActiveProfiles("test")
@DataJpaTest
@AutoConfigureTestDatabase(replace = NONE)
public class UserRepositoryTest {


    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void whenFindById() {

        User user= new User();
        user.setEmail("tomkiewicz@o2.pl");
        user.setPassword("****");
        user.setLast_login(LocalDateTime.now());

        entityManager.persist(user);
        entityManager.flush();


        User testUser = userRepository.findById(user.getId());

        assertThat(testUser.getEmail()).isEqualTo(user.getEmail());

    }


}
