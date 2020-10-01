package com.example.familyapp.service;

import com.example.familyapp.dao.AddressRepository;
import com.example.familyapp.model.Address;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class AddressServiceImpl implements AddressService {

    private AddressRepository addressRepository;

    @Autowired
    public AddressServiceImpl(AddressRepository addressRepository)
    {
        this.addressRepository=addressRepository;
    }

    @Override
    public Address findById(long addressId) {
        return addressRepository.findById(addressId);
    }

    @Override
    public Address save(Address address) {
        return addressRepository.save(address);
    }

    @Override
    public void delete(Address address) {
addressRepository.delete(address);
    }

    @Override
    public List<Address> findAll() {
        return addressRepository.findAll();
    }
}
