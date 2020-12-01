package com.example.familyapp.service;

import com.example.familyapp.dto.InvitationDTO;
import com.example.familyapp.model.Invitation;

import java.util.List;

public interface InvitationService {

    List<Invitation> findByFamilyId(long familyId);
    List<Invitation> findByProfileId(long profileId);
    Invitation safeInvitation(InvitationDTO invitationDTO, long userId);
    void removeInvitation(long invitationId, long userId);
    void acceptInvitation(long invitationId, long userId);
}
