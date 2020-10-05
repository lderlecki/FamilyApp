package com.example.familyapp.unit.repository;

import com.example.familyapp.dao.ProfileRepository;
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
public class ProfileRepositoryTest {


    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ProfileRepository profileRepository;

    @Test
    public void whenFindById() {

        Profile profile = new Profile();
        profile.setName("Błażej");
        entityManager.persist(profile);
        entityManager.flush();

        Profile testProfile = profileRepository.findById(profile.getId());

        assertThat(testProfile.getName()).isEqualTo(profile.getName());
    }


}
