package com.mediaprogramming.FactChecking.service;

import com.mediaprogramming.FactChecking.controller.ClaimResponse;
import com.mediaprogramming.FactChecking.controller.CreateClaimRequest;
import com.mediaprogramming.FactChecking.controller.UpdateStatusRequest;
import com.mediaprogramming.FactChecking.controller.UpdateUrlRequest;
import com.mediaprogramming.FactChecking.model.Claim;
import com.mediaprogramming.FactChecking.model.ClaimStatus;

import java.util.List;
import java.util.Optional;

public interface ClaimService {

    Claim createClaim(CreateClaimRequest request, String username);

    Optional<Claim> findById(Long id);

    List<Claim> findAll();

    Claim updateStatus(Long id, UpdateStatusRequest request, String username);

    Claim updateUrl(Long id, UpdateUrlRequest request, String username);

    void deleteClaim(Long claimId, String username);

}
