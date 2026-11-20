package com.mediaprogramming.FactChecking.model;

import jakarta.persistence.*;
import org.hibernate.validator.constraints.URL;

import java.util.List;

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

     @Enumerated(EnumType.STRING)
     @Column(nullable = false)
     private ClaimCategory category = ClaimCategory.GENERAL;

     @OneToMany
     @JoinColumn(name = "claim_id") // TODO() Is this column correct?
     private List<Comment> comments;

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

    public ClaimCategory getCategory() {
        return category;
    }

    public void setCategory(ClaimCategory category) {
        this.category = category;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }
}
