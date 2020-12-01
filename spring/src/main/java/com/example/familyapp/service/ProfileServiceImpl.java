package com.example.familyapp.service;

import com.example.familyapp.dao.ProfileRepository;
import com.example.familyapp.model.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.sql.Blob;
import java.util.List;

@Transactional
@Service
public class ProfileServiceImpl implements ProfileService {

    ProfileRepository profileRepository;
    private JdbcTemplate jdbcTemp;


    @Autowired
    public ProfileServiceImpl(ProfileRepository profileRepository, DataSource dataSource) {
        this.profileRepository = profileRepository;
        this.jdbcTemp = new JdbcTemplate(dataSource);
    }

    @Override
    public Profile findById(long profileId) {
        return profileRepository.findById(profileId);
    }

    @Override
    public Profile save(Profile profile) {
        return profileRepository.save(profile);
    }

    @Override
    public void delete(Profile profile) {
        profileRepository.delete(profile);
    }

    @Override
    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }

    @Override
    public Blob getImageById(long id) {
        String query = "select p.image from profile p where p.id=?";
        Blob photo = jdbcTemp.queryForObject(query, new Object[]{id}, Blob.class);
        return photo;
    }

    @Override
    public List<Profile> findWhereNameOrSurnameLike(String searchedValue) {
        return profileRepository.findWhereNameOrSurnameLike(searchedValue);
    }
}
