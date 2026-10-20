package com.mediaprogramming.FactChecking.controller;

import com.mediaprogramming.FactChecking.model.Claim;
import com.mediaprogramming.FactChecking.model.ClaimStatus;
import com.mediaprogramming.FactChecking.repository.ClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

}
