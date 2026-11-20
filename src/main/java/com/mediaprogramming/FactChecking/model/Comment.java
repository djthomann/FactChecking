package com.mediaprogramming.FactChecking.model;

import jakarta.persistence.*;

@Entity
public class Comment {

    @Id
    @GeneratedValue
    private Long id;

    private String text;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "claim_id")
    private Claim claim;

    public Comment() {
    }

    public Comment(Claim claim, String text) {
        this.claim = claim;
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Claim getClaim() {
        return claim;
    }

    public void setClaim(Claim claim) {
        this.claim = claim;
    }
}
