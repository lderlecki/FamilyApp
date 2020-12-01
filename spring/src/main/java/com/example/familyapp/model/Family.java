package com.example.familyapp.model;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;

@Entity
public class Family implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;

    private String familyName;
    private double budget;
    @OneToMany(mappedBy = "family")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Set<Profile> familyMembers;

    @OneToMany(mappedBy = "family")
    @JsonIgnore
    private List<Invitation> invitations;

   @OneToMany(mappedBy = "family", fetch = FetchType.LAZY)
    private List<FamilyImage> images = new ArrayList<>();

    @OneToOne(mappedBy = "family")
    private Address address;

    @Column(unique = true)
    private UUID groupId = UUID.randomUUID();

    @OneToOne
    @JoinColumn(name="family_head_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Profile familyHead;

    public Profile getFamilyHead() {
        return familyHead;
    }

    public void setFamilyHead(Profile familyHead) {
        this.familyHead = familyHead;
    }


    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public long getId() { return id; }
    public String getFamilyName() { return familyName; }
    public void setFamilyName(String familyName) { this.familyName = familyName; }
    public double getBudget() { return budget; }
    public void setBudget(double budget) { this.budget = budget; }
    public Set<Profile> getFamilyMembers() { return familyMembers; }
    public void setFamilyMembers(Set<Profile> familyMembers) { this.familyMembers = familyMembers; }

    public void setId(long id) {
        this.id = id;
    }

    public UUID getGroupId() {
        return groupId;
    }

    public List<Invitation> getInvitations() {
        return invitations;
    }

    public void setInvitations(List<Invitation> invitations) {
        this.invitations = invitations;
    }


    @Override
    public String toString() {
        return "Family{" +
                "id=" + id +
                ", familyName='" + familyName + '\'' +
                ", budget=" + budget +
                ", familyMembers=" + familyMembers +
                '}';
    }
}
