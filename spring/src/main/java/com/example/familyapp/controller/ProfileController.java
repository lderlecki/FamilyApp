package com.example.familyapp.controller;

import com.example.familyapp.model.Family;
import com.example.familyapp.model.Invitation;
import com.example.familyapp.model.Profile;
import com.example.familyapp.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(value = "/profile")
public class ProfileController {

    private ProfileService profileService;

    @Autowired
    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping(value = "/")
    Profile saveProfile(@RequestBody Profile profile){
        return profileService.save(profile);
    }
    @GetMapping(value = "/")
    public Profile getProfile(@RequestParam long id){
        return profileService.findById(id);
    }

    @GetMapping(value = "/family")
    public Family getFamilyForProfile(@RequestParam long id){
        return profileService.findById(id).getFamily();
    }

    @PutMapping(value = "/")
    Profile update(@RequestBody Profile profile){
        return profileService.save(profile);
    }

    @DeleteMapping(value = "/")
    void deleteProfile(@RequestParam long id){
        profileService.delete(profileService.findById(id));
    }

    @GetMapping(value = "/all")
    public List<Profile> getAllProfiles(){
        return profileService.getAllProfiles();
    }


}
