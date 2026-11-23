package com.mediaprogramming.FactChecking.model;

import jakarta.persistence.*;

@Entity
public class Comment {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id")
    private AppUser author;

    private String text;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "claim_id")
    private Claim claim;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommentStance stance;

    public Comment() {
    }

    public Comment(Claim claim, AppUser author, String text, CommentStance stance) {
        this.claim = claim;
        this.author = author;
        this.text = text;
        this.stance = stance;
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

    public AppUser getAuthor() {
        return author;
    }

    public void setAuthor(AppUser author) {
        this.author = author;
    }

    public CommentStance getStance() {
        return stance;
    }

    public void setStance(CommentStance stance) {
        this.stance = stance;
    }
}
