package com.example.familyapp.service;

import com.example.familyapp.model.FamilyImage;

import java.util.List;

public interface FamilyImageService {

    List<FamilyImage> findAllByFamilyId(long familyId);
    FamilyImage safeFamilyImage(FamilyImage familyImage);
    void deleteFamilyImage(long familyImageId, long userId);
}
