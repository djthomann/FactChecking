package com.mediaprogramming.FactChecking.controller;

import com.mediaprogramming.FactChecking.model.Claim;
import com.mediaprogramming.FactChecking.model.ClaimCategory;
import com.mediaprogramming.FactChecking.model.ClaimStatus;

public record ClaimResponse(Long id, String title, String text, String url, ClaimStatus status, ClaimCategory category) {
    public static ClaimResponse from(Claim claim) {
        return new ClaimResponse(claim.getId(), claim.getTitle(), claim.getText(), claim.getUrl(), claim.getStatus(), claim.getCategory());
    }
}
