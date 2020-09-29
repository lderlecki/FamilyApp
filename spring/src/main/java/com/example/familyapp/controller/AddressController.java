package com.example.familyapp.controller;

import com.example.familyapp.model.Address;
import com.example.familyapp.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/address")
public class AddressController {
    private AddressService addressService;

    @Autowired
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping(value = "/")
    Address saveAddress(@RequestBody Address address){
        return addressService.save(address);
    }
    @GetMapping(value = "/")
    Address getAddress(@RequestParam long id){
        return addressService.findById(id);
    }
    @GetMapping(value = "/")
    List<Address> all() { return addressService.findAll();}
    @PutMapping(value = "/")
    Address updateAddress(@RequestBody Address address){
        return addressService.save(address);
    }

    @DeleteMapping(value = "/")
    void deleteAddress(@RequestParam long id){
        addressService.delete(addressService.findById(id));
    }
}
