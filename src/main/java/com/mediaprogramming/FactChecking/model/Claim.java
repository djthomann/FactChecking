package com.mediaprogramming.FactChecking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.hibernate.validator.constraints.URL;

@Entity
public class Claim {

     @Id @GeneratedValue
     private long id;

     private String name;

     @URL
     private String url;

     @Enumerated(EnumType.STRING)
     @Column(nullable = false)
     private ClaimStatus status = ClaimStatus.UNVERIFIED;

     public Claim() {

     }

     public String getName() {
        return name;
     }

     public void setName(String name) {
        this.name = name;
     }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public ClaimStatus getStatus() {
        return status;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
