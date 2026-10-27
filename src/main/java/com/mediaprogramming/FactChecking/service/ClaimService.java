package com.mediaprogramming.FactChecking.service;

import com.mediaprogramming.FactChecking.controller.CreateClaimRequest;
import com.mediaprogramming.FactChecking.controller.UpdateStatusRequest;
import com.mediaprogramming.FactChecking.controller.UpdateUrlRequest;
import com.mediaprogramming.FactChecking.model.Claim;
import com.mediaprogramming.FactChecking.model.ClaimStatus;

import java.util.List;
import java.util.Optional;

public interface ClaimService {

    Claim create(CreateClaimRequest request);

    Optional<Claim> findById(Long id);

    List<Claim> findAll();

    Optional<Claim> updateStatus(Long id, UpdateStatusRequest request);

    Optional<Claim> updateUrl(Long id, UpdateUrlRequest request);

    void delete(Long id);

}
