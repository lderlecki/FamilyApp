package com.example.familyapp.controller;


import com.example.familyapp.MyCorsFilter;
import com.example.familyapp.config.JwtToken;
import com.example.familyapp.dto.InvitationDTO;
import com.example.familyapp.model.Invitation;
import com.example.familyapp.service.InvitationService;
import com.example.familyapp.service.ProfileService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/invitation")
@CrossOrigin(value = MyCorsFilter.FRONTEND_URL)
public class InvitationController {

    private InvitationService invitationService;
    private ProfileService profileService;

    @Autowired
    public InvitationController(InvitationService invitationService, ProfileService profileService) {
        this.invitationService = invitationService;
        this.profileService = profileService;
    }

    @GetMapping(value = "/family")
    @ApiOperation(value = "get all invitation requests for specific family")
    List<Invitation> getInvitationsForFamily(@RequestHeader (name="Authorization") String token){
        long userId= JwtToken.getIdFromToken(token.replaceAll("Bearer ", ""));
        return invitationService.findByFamilyId(profileService.findById(userId).getFamily().getId());
    }
    @GetMapping(value = "/profile")
    @ApiOperation(value = "get all invitations to family for specific profile")
    List<Invitation> getInvitationsForProfile(@RequestHeader (name="Authorization") String token){
        long userId= JwtToken.getIdFromToken(token.replaceAll("Bearer ", ""));
        return invitationService.findByProfileId(userId);
    }
    @PostMapping(value = "/")
    @ApiOperation(value = "safe invitation, return 409 http status (conflict) if profile has invitation from this family, return 406 http status (not acceptable) if profile is member of this family")
    Invitation safeInvitation(@RequestBody InvitationDTO invitationDTO, @RequestHeader (name="Authorization") String token){
        long userId= JwtToken.getIdFromToken(token.replaceAll("Bearer ", ""));
        return invitationService.safeInvitation(invitationDTO, userId);
    }
    @DeleteMapping(value = "/")
    void deleteInvitation(@RequestParam long id, @RequestHeader (name="Authorization") String token){
        long userId= JwtToken.getIdFromToken(token.replaceAll("Bearer ", ""));
      invitationService.removeInvitation(id, userId);
    }
    @DeleteMapping(value = "/accept/")
    @ApiOperation(value = "accept and delete invitation, return http status 409 (conflict) if user has family and cant accept invitation")
    void acceptAndDeleteInvitation(@RequestParam long id){
        invitationService.acceptInvitation(id, 3);
    }
}
