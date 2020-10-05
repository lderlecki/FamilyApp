package com.example.familyapp.unit.repository;

import com.example.familyapp.dao.AddressRepository;
import com.example.familyapp.dao.TaskRepository;
import com.example.familyapp.model.*;
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
public class AddressRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private AddressRepository addressRepository;

    @Test
    public void whenFindById() {

        Address address=new Address();
        address.setCity("Łódź");
        address.setStreet("Zgierska");
        address.setTerritory("Polska");
        address.setPostalCode("90-100");
        entityManager.persist(address);
        entityManager.flush();

        Address testAddress = addressRepository.findById(address.getId());
        assertThat(testAddress.getCity()).isEqualTo(address.getCity());
    }
}
