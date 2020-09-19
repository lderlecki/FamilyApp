package com.example.familyapp.dao;

import com.example.familyapp.model.Family;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyRepository extends JpaRepository<Family,Long> {
    Family findById(long id);
}
