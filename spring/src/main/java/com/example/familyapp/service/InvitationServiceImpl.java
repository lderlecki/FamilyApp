package com.example.familyapp.service;

import com.example.familyapp.dao.FamilyRepository;
import com.example.familyapp.dao.InvitationRepository;
import com.example.familyapp.dao.ProfileRepository;
import com.example.familyapp.dto.InvitationDTO;
import com.example.familyapp.exceptions.AlreadyInThisFamilyException;
import com.example.familyapp.exceptions.AlreadyInvitedException;
import com.example.familyapp.exceptions.HasFamilyException;
import com.example.familyapp.model.Family;
import com.example.familyapp.model.Invitation;
import com.example.familyapp.model.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@Transactional
public class InvitationServiceImpl implements InvitationService {

    private InvitationRepository invitationRepository;
    private FamilyRepository familyRepository;
    private ProfileRepository profileRepository;

    @Autowired
    public InvitationServiceImpl(InvitationRepository invitationRepository,FamilyRepository familyRepository,ProfileRepository profileRepository)
    {
        this.invitationRepository=invitationRepository;
        this.familyRepository=familyRepository;
        this.profileRepository= profileRepository;
    }

    @Override
    public List<Invitation> findByFamilyId(long familyId) {
        return invitationRepository.findAllByFamilyId(familyId);
    }

    @Override
    public List<Invitation> findByProfileId(long profileId) {
        return invitationRepository.findAllByProfileId(profileId);
    }

    @Override
    public Invitation safeInvitation(InvitationDTO invitationDTO) {
        Profile profile=profileRepository.getOne(invitationDTO.getProfileId());
        for(Invitation invitation: profile.getInvitations())
            if(invitation.getFamily().getId()==invitationDTO.getFamilyId())
                throw new AlreadyInvitedException();

        for(Profile profile1: familyRepository.getOne(invitationDTO.getFamilyId()).getFamilyMembers())
            if(profile1.getId()== invitationDTO.getProfileId())
                throw new AlreadyInThisFamilyException();

        Invitation invitation=new Invitation();
        invitation.setInvitedByFamily(invitationDTO.isInvitedByFamily());
        invitation.setFamily(familyRepository.getOne(invitationDTO.getFamilyId()));
        invitation.setProfile(profileRepository.getOne(invitationDTO.getProfileId()));
        return invitationRepository.save(invitation);
    }

    @Override
    public void removeInvitation(long invitationId) {
        invitationRepository.delete(invitationRepository.getOne(invitationId));
    }

    @Override
    public void acceptInvitation(long invitationId) {
        Invitation invitation=invitationRepository.getOne(invitationId);
        Profile profile=invitation.getProfile();
        if (profile.getFamily() != null)
            throw new HasFamilyException();

        Family family=invitation.getFamily();
        profile.setFamily(family);
        Set<Profile> familyMembers= family.getFamilyMembers();
        familyMembers.add(profile);
        family.setFamilyMembers(familyMembers);
        profileRepository.save(profile);
        familyRepository.save(family);
        invitationRepository.delete(invitation);
    }
}
