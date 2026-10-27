package com.mediaprogramming.FactChecking.controller;

import com.mediaprogramming.FactChecking.model.ClaimStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(
        @NotNull ClaimStatus status
){
}
