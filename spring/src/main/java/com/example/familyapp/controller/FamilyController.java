package com.example.familyapp.controller;

import com.example.familyapp.dao.FamilyRepository;
import com.example.familyapp.dao.ProfileRepository;
import com.example.familyapp.model.Family;
import com.example.familyapp.service.FamilyService;
import com.example.familyapp.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/family")
public class FamilyController {

    private FamilyService familyService;

    @Autowired
    public FamilyController(FamilyService familyService) {
        this.familyService = familyService;
    }

    @PostMapping(value = "/")
    Family saveFamily(@RequestBody Family family){
        return familyService.save(family);
    }
    @GetMapping(value = "/")
    Family getFamily(@RequestParam long id){
        return familyService.findById(id);
    }
    @PutMapping(value = "/")
    Family updateFamily(@RequestBody Family family){
        return familyService.save(family);
    }

    @DeleteMapping(value = "/")
    void deleteFamily(@RequestParam long id){
        familyService.delete(familyService.findById(id));
    }
}
