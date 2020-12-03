package com.example.familyapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class FamilyImage implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;


    @Lob
    private byte[] image;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "family_id")
    private Family family;

    public Family getFamily() {
        return family;
    }

    public void setFamily(Family family) {
        this.family = family;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
