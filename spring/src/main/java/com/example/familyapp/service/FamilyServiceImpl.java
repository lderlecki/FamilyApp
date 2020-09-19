package com.example.familyapp.service;

import com.example.familyapp.dao.FamilyRepository;
import com.example.familyapp.model.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class FamilyServiceImpl implements FamilyService {
    @Autowired
    FamilyRepository familyRepository;
    @Override
    public Profile findFamilyHead(long id) {
        familyRepository.findById(id).getFamilyMembers().stream().filter(profile -> profile.isFamilyHead()).collect(Collectors.toSet());
        return null;
    }
}
