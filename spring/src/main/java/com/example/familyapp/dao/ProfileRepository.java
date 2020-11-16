package com.example.familyapp.dao;

import com.example.familyapp.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface ProfileRepository extends JpaRepository<Profile,Long> {
    Profile findById(long id);


    @Query(value = "select * from profile p where " +
            "UPPER(p.name) like UPPER(concat('%', :searchedValue,'%'))" +
            "or UPPER(p.surname) like UPPER(concat('%', :searchedValue,'%'))" +
            "ORDER BY (CASE " +
            "WHEN UPPER(p.name) = UPPER(:searchedValue) or UPPER(p.surname) = UPPER(:searchedValue) THEN 1 " +
            "WHEN UPPER(p.name) LIKE UPPER(concat('', :searchedValue,'%')) or UPPER(p.surname) like UPPER(concat('', :searchedValue,'%')) THEN 2 " +
            "WHEN UPPER(p.name) LIKE UPPER(concat('%', :searchedValue,'%')) or UPPER(p.surname) like UPPER(concat('%', :searchedValue,'%')) THEN 3 " +
            "ELSE 4 END)",nativeQuery = true)
    List<Profile> findWhereNameOrSurnameLike(@Param("searchedValue") String searchedValue);
}
