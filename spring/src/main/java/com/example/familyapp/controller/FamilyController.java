package com.example.familyapp.controller;

import com.example.familyapp.MyCorsFilter;
import com.example.familyapp.config.JwtToken;
import com.example.familyapp.dao.FamilyRepository;
import com.example.familyapp.dao.ProfileRepository;
import com.example.familyapp.dto.FamilyImageDTO;
import com.example.familyapp.model.Family;
import com.example.familyapp.model.FamilyImage;
import com.example.familyapp.service.FamilyImageService;
import com.example.familyapp.service.FamilyService;
import com.example.familyapp.service.ProfileService;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLConnection;
import java.sql.Blob;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(value = "/family")
@CrossOrigin(value = MyCorsFilter.FRONTEND_URL)
public class FamilyController {

    private FamilyService familyService;
    private FamilyImageService familyImageService;
    private ProfileService profileService;

    @Autowired
    public FamilyController(FamilyService familyService, ProfileService profileService, FamilyImageService familyImageService) {
        this.familyService = familyService;
        this.profileService = profileService;
        this.familyImageService = familyImageService;
    }

    @PostMapping(value = "/")
    Family saveFamily(@RequestBody Family family){
        return familyService.save(family);
    }
    @GetMapping(value = "/all")
    public List<Family> getAllFamilies() { return familyService.getAll();}
    @GetMapping(value = "/")
    public Family getFamily(@RequestParam long id){
        return familyService.findById(id);
    }
    @PutMapping(value = "/")
    Family updateFamily(@RequestBody Family family){
        return familyService.save(family);
    }

    @DeleteMapping(value = "/")
    void deleteFamily(@RequestParam long id){
        familyService.delete(familyService.findById(id));
    }

    @GetMapping(value = "/searchFamily")
    public List<Family> findWhereFamilyNameLike(@RequestParam String searchedValue){
        return familyService.findWhereFamilyNameLike(searchedValue);
    }
    @RequestMapping(value = "getFamilyImages")
    public List<FamilyImage> getFamilyImages(@RequestHeader (name="Authorization") String token){
        long userId= JwtToken.getIdFromToken(token.replaceAll("Bearer ", ""));
        return familyImageService.findAllByFamilyId(profileService.findById(userId).getFamily().getId());
    }

    @PostMapping(value = "/addFamilyImage")
    public ResponseEntity<FamilyImage> addNewFamilyImage(@RequestBody FamilyImageDTO data, @RequestHeader (name="Authorization") String token) {
        if(data.getDescription() == null) return new ResponseEntity<>(
                null,
                HttpStatus.NOT_ACCEPTABLE);
        FamilyImage familyImage= new FamilyImage();
        try {
            byte[] decodedString = Base64.getDecoder().decode(data.getData().split(",")[1].getBytes("UTF-8"));
            long userId= JwtToken.getIdFromToken(token.replaceAll("Bearer ", ""));
            familyImage.setFamily(familyService.findById(profileService.findById(userId).getFamily().getId()));
            familyImage.setImage(decodedString);
            familyImage.setDescription(data.getDescription());
            familyImageService.safeFamilyImage(familyImage);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(
                familyImage,
                HttpStatus.OK);
    }

    @DeleteMapping(value = "/deleteFamilyImage")
    void deleteFamilyImage(@RequestParam long id,  @RequestHeader (name="Authorization") String token)
    {
        long userId= JwtToken.getIdFromToken(token.replaceAll("Bearer ", ""));
        familyImageService.deleteFamilyImage(id, userId);
    }

}
