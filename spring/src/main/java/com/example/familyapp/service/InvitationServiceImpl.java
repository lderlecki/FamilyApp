package com.example.familyapp.service;

import com.example.familyapp.dao.FamilyRepository;
import com.example.familyapp.dao.InvitationRepository;
import com.example.familyapp.dao.ProfileRepository;
import com.example.familyapp.dto.InvitationDTO;
import com.example.familyapp.exceptions.invitations.AlreadyInThisFamilyException;
import com.example.familyapp.exceptions.invitations.AlreadyInvitedException;
import com.example.familyapp.exceptions.invitations.ForbiddenOperationException;
import com.example.familyapp.exceptions.invitations.HasFamilyException;
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
    public Invitation safeInvitation(InvitationDTO invitationDTO, long userId) {
        Profile loggedProfile = profileRepository.findById(userId);
        boolean invitedByFamily = false; //assume that user send invitation request to family

        if(loggedProfile.getId() != invitationDTO.getProfileId()) //if famiily invited someone so we need to check
            //if everything is ok with invitationDTO
        {
            Family family = loggedProfile.getFamily();
            if(family != null) //inviting profile has family
            {
                if(invitationDTO.getFamilyId() != family.getId()) // and his family id is not equal to invitation family id
                {
                    throw new ForbiddenOperationException();
                } else //family id equals to invitaitionDTO.familyId so everything is ok
                {
                    invitedByFamily = true;
                }
            } else // inviting user doesnt have family so he cant invite anyone
                throw new ForbiddenOperationException();


        }
        Profile profile=profileRepository.getOne(invitationDTO.getProfileId());
        for(Invitation invitation: profile.getInvitations())
            if(invitation.getFamily().getId()==invitationDTO.getFamilyId())
                throw new AlreadyInvitedException();

        for(Profile profile1: familyRepository.getOne(invitationDTO.getFamilyId()).getFamilyMembers())
            if(profile1.getId()== invitationDTO.getProfileId())
                throw new AlreadyInThisFamilyException();

        Invitation invitation=new Invitation();
        invitation.setInvitedByFamily(invitedByFamily);
        invitation.setFamily(familyRepository.getOne(invitationDTO.getFamilyId()));
        invitation.setProfile(profileRepository.getOne(invitationDTO.getProfileId()));
        return invitationRepository.save(invitation);
    }

    @Override
    public void removeInvitation(long invitationId, long userId) {
        Invitation invitation = invitationRepository.getOne(invitationId);
        Profile profile = profileRepository.findById(userId);
        Family profileFamily = profile.getFamily();
        if(profile.getId() == invitation.getProfile().getId() || profileFamily.getId() == invitation.getFamily().getId())
        invitationRepository.delete(invitation);
        else
            throw new ForbiddenOperationException();
    }

    @Override
    public void acceptInvitation(long invitationId, long userId) {
        Invitation invitation=invitationRepository.getOne(invitationId);
        //jesli osoba probujaca akceptowac zaproszenie nie jest osoba zaproszona
        if(invitation.getProfile().getId() != userId)
        {
           Profile amIMemberOfThisFamily = invitation.getFamily().getFamilyMembers().stream().filter(member -> member.getId() == userId).findAny().orElse(null);
            //ani nie jest czlonkiem rodziny ktora wyslala zaproszenie
           if(amIMemberOfThisFamily == null)
               throw new ForbiddenOperationException();
        }
        //jesli user nie zostal zaproszony przez rodzine, i probuje akceptowac zaproszenie
        if(!invitation.isInvitedByFamily() && userId== invitation.getProfile().getId())
            throw new ForbiddenOperationException();
        //jesli user zostal zaproszony przez rodzine i ktos z tej rodziny probuje akceptowac zaproszenie
        if(invitation.isInvitedByFamily() && invitation.getFamily().getFamilyMembers().stream().filter(member -> member.getId() == userId).findAny().orElse(null) != null)
            throw new ForbiddenOperationException();

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
