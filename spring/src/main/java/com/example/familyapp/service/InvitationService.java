package com.example.familyapp.service;

import com.example.familyapp.dto.InvitationDTO;
import com.example.familyapp.model.Invitation;

import java.util.List;

public interface InvitationService {

    List<Invitation> findByFamilyId(long familyId);
    List<Invitation> findByProfileId(long profileId);
    Invitation safeInvitation(InvitationDTO invitationDTO);
    void removeInvitation(long invitationId);
    void acceptInvitation(long invitationId);
}
