package com.example.familyapp.dto;

public class InvitationDTO {

    private long familyId;
    private long profileId;
    private boolean invitedByFamily;

    public long getFamilyId() {
        return familyId;
    }

    public void setFamilyId(long familyId) {
        this.familyId = familyId;
    }

    public long getProfileId() {
        return profileId;
    }

    public void setProfileId(long profileId) {
        this.profileId = profileId;
    }

    public boolean isInvitedByFamily() {
        return invitedByFamily;
    }

    public void setInvitedByFamily(boolean invitedByFamily) {
        this.invitedByFamily = invitedByFamily;
    }
}
