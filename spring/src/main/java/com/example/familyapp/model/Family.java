package com.example.familyapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
public class Family {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;

    private String familyName;
    private double budget;
    @OneToMany(mappedBy = "family")
    private Set<Profile> familyMembers;

    @Column(unique = true)
    private UUID groupId = UUID.randomUUID();

    @OneToOne
    @JoinColumn(name="family_head_id")
    private Profile familyHead;

    public Profile getFamilyHead() {
        return familyHead;
    }

    public void setFamilyHead(Profile familyHead) {
        this.familyHead = familyHead;
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
