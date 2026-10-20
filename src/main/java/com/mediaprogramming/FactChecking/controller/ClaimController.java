package com.mediaprogramming.FactChecking.controller;

import com.mediaprogramming.FactChecking.model.Claim;
import com.mediaprogramming.FactChecking.model.ClaimStatus;
import com.mediaprogramming.FactChecking.repository.ClaimRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimRepository repository;

    @Autowired
    public ClaimController(ClaimRepository repository) {
        this.repository = repository;
    }

    @GetMapping("")
    public List<Claim> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Claim getById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @PostMapping("")
    public Claim newClaim(@RequestBody Claim claim) {
        claim.setStatus(ClaimStatus.UNVERIFIED);
        return repository.save(claim);
    }

    @PatchMapping("/{id}/status")
    @Transactional
    public Claim updateClaimStatus(@PathVariable long id, @RequestBody ClaimStatus newStatus) {
        Claim claim = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Claim not found"));

        claim.setStatus(newStatus);
        return repository.save(claim);
    }
}
