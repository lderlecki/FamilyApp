package com.example.familyapp.controller;

import com.example.familyapp.config.JwtToken;
import com.example.familyapp.model.Family;
import com.example.familyapp.model.Invitation;
import com.example.familyapp.model.Profile;
import com.example.familyapp.service.ProfileService;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Blob;
import java.util.ArrayList;
import java.util.Base64;
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

    @GetMapping(value = "/searchProfile")
    public List<Profile> findWhereNameOrSurnameLike(@RequestParam String searchedValue){
        return profileService.findWhereNameOrSurnameLike(searchedValue);
    }

    @RequestMapping(value = "getProfileImage")
    public void getProfileImage(HttpServletResponse response, @RequestParam long id) throws Exception {
        response.setContentType("image/jpeg");
        Blob ph = profileService.getImageById(id);
        if(ph != null)
        {
            byte[] bytes = ph.getBytes(1, (int) ph.length());
            InputStream inputStream = new ByteArrayInputStream(bytes);
            IOUtils.copy(inputStream, response.getOutputStream());
        }
    }


    @PostMapping(value = "/changeProfileImage")
    @ApiOperation(value = "change profile image for profile")
    public ResponseEntity<Profile> setNewProfileImage(@RequestBody String data,  @RequestHeader (name="Authorization") String token) {
        long userId= JwtToken.getIdFromToken(token.replaceAll("Bearer ", ""));
        Profile profile = profileService.findById(userId);
        try {
            byte[] decodedString = Base64.getDecoder().decode(data.split(",")[1].getBytes("UTF-8"));
            profile.setImage(decodedString);
            profileService.save(profile);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(
                profile,
                HttpStatus.OK);
    }


}
