package com.mediaprogramming.FactChecking.controller;

import com.mediaprogramming.FactChecking.model.ClaimCategory;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;

public record CreateClaimRequest(
        @NotBlank
        String title,
        String text,
        ClaimCategory category,
        @URL
        String url
) {}