package com.example.familyapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name="address", schema = "public")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;

    @Column(nullable = false)
    private String territory;
    @Column(nullable = false)
    private String city;
    @Column(nullable = false)
    private String street;
    @Column(nullable = false)
    private int streetNo;
    @Column(nullable = false)
    private int flatNo;
    @Column(nullable = false)
    private String postalCode;
    @OneToOne
    @JoinColumn(name="family_id")
    @JsonIgnore
    private Family family;

    @Override
    public String toString() {
        return "Address{" +
                "id=" + id +
                ", territory='" + territory + '\'' +
                ", city='" + city + '\'' +
                ", street='" + street + '\'' +
                ", streetNo=" + streetNo +
                ", flatNo=" + flatNo +
                ", postalCode='" + postalCode + '\'' +
                ", family=" + family +
                '}';
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTerritory() {
        return territory;
    }

    public void setTerritory(String territory) {
        this.territory = territory;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public int getStreetNo() {
        return streetNo;
    }

    public void setStreetNo(int streetNo) {
        this.streetNo = streetNo;
    }

    public int getFlatNo() {
        return flatNo;
    }

    public void setFlatNo(int flatNo) {
        this.flatNo = flatNo;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public Family getFamily() {
        return family;
    }

    public void setFamily(Family family) {
        this.family = family;
    }
}
