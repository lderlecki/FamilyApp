package com.example.familyapp.dto;

import java.sql.Blob;

public class BlobWrapper {

    private byte[] image;

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public BlobWrapper(byte[] image) {
        this.image = image;
    }
}
