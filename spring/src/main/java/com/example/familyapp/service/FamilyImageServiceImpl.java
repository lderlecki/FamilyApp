package com.example.familyapp.service;

import com.example.familyapp.dao.FamilyImageRepository;
import com.example.familyapp.dao.ProfileRepository;
import com.example.familyapp.exceptions.image.ForbiddenOperationException;
import com.example.familyapp.model.FamilyImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class FamilyImageServiceImpl implements FamilyImageService {

    private FamilyImageRepository familyImageRepository;
    private ProfileRepository profileRepository;
    @Autowired
    public FamilyImageServiceImpl(FamilyImageRepository familyImageRepository, ProfileRepository profileRepository)
    {
        this.familyImageRepository=familyImageRepository;
        this.profileRepository=profileRepository;
    }

    @Override
    public List<FamilyImage> findAllByFamilyId(long familyId) {
        return familyImageRepository.findAllByFamilyId(familyId);
    }

    @Override
    public FamilyImage safeFamilyImage(FamilyImage familyImage) {
        return familyImageRepository.save(familyImage);
    }

    @Override
    public void deleteFamilyImage(long familyImageId, long userId) {
        FamilyImage familyImage= familyImageRepository.getOne(familyImageId);
        if(familyImage.getFamily().getId()== profileRepository.getOne(userId).getFamily().getId())
        {
            familyImageRepository.delete(familyImage);
        } else throw new ForbiddenOperationException();
    }
}
