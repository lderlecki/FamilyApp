package com.example.familyapp.dao;

import com.example.familyapp.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends JpaRepository<Profile,Long> {
    Profile findById(long id);
    Profile findByFamilyHeadIsTrue();
}
