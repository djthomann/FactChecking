package com.mediaprogramming.FactChecking.model;

import jakarta.persistence.*;

@Entity
public class Claim {

     @Id @GeneratedValue
     private long id;

     private String name;

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
}
