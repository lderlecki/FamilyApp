package com.example.familyapp.service;

import com.example.familyapp.model.Family;
import com.example.familyapp.model.Profile;

public interface FamilyService {
    Profile findFamilyHead(long id);
    Family findById(long familyId);
    Family save(Family family);
    void delete(Family family);
}
