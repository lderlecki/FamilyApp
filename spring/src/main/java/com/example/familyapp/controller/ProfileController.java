package com.example.familyapp.controller;

import com.example.familyapp.dao.ProfileRepository;
import com.example.familyapp.model.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(value = "/profile")
public class ProfileController {

    @Autowired
    ProfileRepository profileRepository;

    @PostMapping(value = "/")
    Profile saveProfile(@RequestBody Profile profile){
        return profileRepository.save(profile);
    }
    @GetMapping(value = "/")
    Profile getProfile(@RequestParam long id){

        System.out.println(profileRepository.findById(id).getFamily());
        profileRepository.findById(id).getFamily().getFamilyMembers().forEach(profile -> System.out.println(profile.getName()));

        return profileRepository.findById(id);
    }
    @PutMapping(value = "/")
    Profile update(@RequestBody Profile profile){
        return profileRepository.save(profile);
    }

    @DeleteMapping(value = "/")
    void deleteProfile(@RequestParam long id){
        profileRepository.delete(profileRepository.findById(id));
    }
}
