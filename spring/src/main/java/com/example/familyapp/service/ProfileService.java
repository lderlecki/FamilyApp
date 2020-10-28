package com.example.familyapp.service;

import com.example.familyapp.model.Profile;

import java.util.List;

public interface ProfileService {

    Profile findById(long profileId);
    Profile save(Profile profile);
    void delete(Profile profile);
    List<Profile> getAllProfiles();
}
