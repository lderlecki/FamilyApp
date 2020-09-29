package com.example.familyapp.service;

import com.example.familyapp.model.Address;

import java.util.List;

public interface AddressService {
    Address findById(long addressId);
    Address save(Address address);
    void delete(Address address);
    List<Address> findAll();
}
