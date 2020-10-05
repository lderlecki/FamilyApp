package com.example.familyapp.unit.repository;

import com.example.familyapp.dao.FamilyRepository;
import com.example.familyapp.model.Family;
import com.example.familyapp.model.Profile;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;
import static org.assertj.core.api.Assertions.assertThat;


@ActiveProfiles("test")
@DataJpaTest
@AutoConfigureTestDatabase(replace = NONE)
public class FamilyRepositoryTest {


    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private FamilyRepository familyRepository;

    @Test
    public void whenFindById() {

        Profile profile = new Profile();
        profile.setName("Stanisław");
        entityManager.persist(profile);
        Family family = new Family();
        family.setFamilyName("Kowalscy");
        family.setFamilyHead(profile);

        entityManager.persist(family);
        entityManager.flush();

        Family testFamily = familyRepository.findById(family.getId());

        assertThat(testFamily.getFamilyName()).isEqualTo(family.getFamilyName());
        assertThat(testFamily.getFamilyHead()).isEqualTo(profile);
    }


}
