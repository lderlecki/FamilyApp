package com.example.familyapp.service;

import com.example.familyapp.dao.FamilyRepository;
import com.example.familyapp.model.Family;
import com.example.familyapp.model.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FamilyServiceImpl implements FamilyService {

    FamilyRepository familyRepository;

    @Autowired
    public FamilyServiceImpl(FamilyRepository familyRepository)
    {
        this.familyRepository=familyRepository;
    }
    @Override
    public Profile findFamilyHead(long id) {
        return familyRepository.findById(id).getFamilyHead();
    }

    @Override
    public Family findById(long familyId) {
        return familyRepository.findById(familyId);
    }

    @Override
    public Family save(Family family) {
        return familyRepository.save(family);
    }

    @Override
    public void delete(Family family) {
        familyRepository.delete(family);
    }

    @Override
    public List<Family> getAll() {
        return familyRepository.findAll();
    }
}
