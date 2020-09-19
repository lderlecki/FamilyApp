package com.example.familyapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Family {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;
    private String familyName;
    private float budget;
    @OneToMany(mappedBy = "family")
    private Set<Profile> familyMembers;

    public long getId() { return id; }
    public String getFamilyName() { return familyName; }
    public void setFamilyName(String familyName) { this.familyName = familyName; }
    public float getBudget() { return budget; }
    public void setBudget(float budget) { this.budget = budget; }
    public Set<Profile> getFamilyMembers() { return familyMembers; }
    public void setFamilyMembers(Set<Profile> familyMembers) { this.familyMembers = familyMembers; }

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
