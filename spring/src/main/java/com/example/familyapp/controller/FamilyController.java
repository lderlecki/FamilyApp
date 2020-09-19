package com.example.familyapp.controller;

import com.example.familyapp.dao.FamilyRepository;
import com.example.familyapp.model.Family;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/family")
public class FamilyController {
    @Autowired
    FamilyRepository familyRepository;

    @PostMapping(value = "/")
    Family saveProfile(@RequestBody Family family){
        return familyRepository.save(family);
    }
    @GetMapping(value = "/")
    Family getProfile(@RequestParam long id){
        return familyRepository.findById(id);
    }
    @PutMapping(value = "/")
    Family update(@RequestBody Family family){
        return familyRepository.save(family);
    }

    @DeleteMapping(value = "/")
    void deleteProfile(@RequestParam long id){
        familyRepository.delete(familyRepository.findById(id));
    }
}
