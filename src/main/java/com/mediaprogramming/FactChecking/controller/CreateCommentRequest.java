package com.mediaprogramming.FactChecking.controller;

import com.mediaprogramming.FactChecking.model.CommentStance;
import jakarta.validation.constraints.NotBlank;

public record CreateCommentRequest(
        @NotBlank String text,
        CommentStance stance
) {
}
