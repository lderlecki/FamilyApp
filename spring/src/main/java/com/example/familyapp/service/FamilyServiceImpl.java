package com.example.familyapp.service;

import com.example.familyapp.dao.FamilyRepository;
import com.example.familyapp.model.Family;
import com.example.familyapp.model.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Blob;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FamilyServiceImpl implements FamilyService {

    FamilyRepository familyRepository;
    private JdbcTemplate jdbcTemp;

    @Autowired
    public FamilyServiceImpl(FamilyRepository familyRepository, JdbcTemplate jdbcTemp)
    {
        this.jdbcTemp= jdbcTemp;
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

    @Override
    public List<Family> findWhereFamilyNameLike(String searchedValue) {
        return familyRepository.findWhereFamilyNameLike(searchedValue);
    }

//    @Override
//    public List<Blob> getFamilyImagesByFamilyId(long familyId) {
//        String query = "select fi.images from family_images fi where fi.family_id=?";
//        List<Blob> images = jdbcTemp.queryForList(query, new Object[]{familyId}, Blob.class);
//        return images;
//    }
}
