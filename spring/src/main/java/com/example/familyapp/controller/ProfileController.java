package com.example.familyapp.controller;

import com.example.familyapp.dao.ProfileRepository;
import com.example.familyapp.model.Profile;
import com.example.familyapp.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(value = "/profile")
public class ProfileController {

    ProfileService profileService;

    @Autowired
    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping(value = "/")
    Profile saveProfile(@RequestBody Profile profile){
        return profileService.save(profile);
    }
    @GetMapping(value = "/")
    Profile getProfile(@RequestParam long id){

        //System.out.println(profileService.findById(id).getFamily());
       // profileService.findById(id).getFamily().getFamilyMembers().forEach(profile -> System.out.println(profile.getName()));

        return profileService.findById(id);
    }

    @PutMapping(value = "/")
    Profile update(@RequestBody Profile profile){
        return profileService.save(profile);
    }

    @DeleteMapping(value = "/")
    void deleteProfile(@RequestParam long id){
        profileService.delete(profileService.findById(id));
    }
}
