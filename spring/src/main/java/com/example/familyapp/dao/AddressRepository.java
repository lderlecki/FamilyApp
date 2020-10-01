package com.example.familyapp.dao;

import com.example.familyapp.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    Address findById(long id);
}
