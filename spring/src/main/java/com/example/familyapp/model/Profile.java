package com.example.familyapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;
    private String Name;
    private String Surname;
    private String email;
    private String phone;
    @JsonIgnore
    @ManyToOne
    private Family family;
    private boolean familyHead;

    public long getId() { return id; }
    public String getName() { return Name; }
    public void setName(String name) { Name = name; }
    public String getSurname() { return Surname; }
    public void setSurname(String surname) { Surname = surname; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Family getFamily() { return family; }
    public void setFamily(Family family) { this.family = family; }
    public boolean isFamilyHead() { return familyHead; }
    public void setFamilyHead(boolean familyHead) { this.familyHead = familyHead; }


}
