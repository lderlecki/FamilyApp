package com.example.familyapp.dao;

import com.example.familyapp.model.Family;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface FamilyRepository extends JpaRepository<Family,Long> {
    Family findById(long id);

    @Query(value = "select * from family f where " +
            "UPPER(f.family_name) like UPPER(concat('%', :searchedValue,'%'))" +
            "ORDER BY (CASE " +
            "WHEN UPPER(f.family_name) = UPPER(:searchedValue) THEN 1 " +
            "WHEN UPPER(f.family_name) LIKE UPPER(concat('', :searchedValue,'%')) THEN 2 " +
            "WHEN UPPER(f.family_name) LIKE UPPER(concat('%', :searchedValue,'%')) THEN 3 " +
            "ELSE 4 END)",nativeQuery = true)
    List<Family> findWhereFamilyNameLike(@Param("searchedValue") String searchedValue);
}
