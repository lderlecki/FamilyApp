package com.example.familyapp.dao;

import com.example.familyapp.model.FamilyImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface FamilyImageRepository extends JpaRepository<FamilyImage, Long> {
    List<FamilyImage> findAllByFamilyId(long familyId);
}
