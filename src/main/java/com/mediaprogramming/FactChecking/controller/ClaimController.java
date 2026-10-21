package com.mediaprogramming.FactChecking.controller;

import com.mediaprogramming.FactChecking.model.Claim;
import com.mediaprogramming.FactChecking.model.ClaimStatus;
import com.mediaprogramming.FactChecking.repository.ClaimRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimRepository repository;
    private final ClaimEvents claimEvents;
    private final ApplicationEventPublisher events;

    @Autowired
    public ClaimController(ClaimRepository repository, ClaimEvents claimEvents, ApplicationEventPublisher events) {
        this.repository = repository;
        this.claimEvents = claimEvents;
        this.events = events;
    }

    @GetMapping("")
    public List<Claim> getAll() {
        return repository.findAll();
    }

    @GetMapping(path = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamClaims() {
        return claimEvents.subscribe();
    }

    @GetMapping("/{id}")
    public Claim getById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @PostMapping("")
    public Claim newClaim(@Valid @RequestBody CreateClaimRequest request) {
        Claim claim = new Claim();
        claim.setName(request.name());

        Claim saved = repository.save(claim);
        claimEvents.broadcast("claims-changed");

        return saved;
    }

    @PatchMapping("/{id}/url")
    @Transactional
    public ResponseEntity<Claim> updateClaimUrl(@PathVariable long id, @Valid @RequestBody UpdateUrlRequest request) {
        return repository.findById(id)
                .map(claim -> {
                    claim.setUrl(request.url());
                    return ResponseEntity.ok(claim);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    @Transactional
    public ResponseEntity<Claim> updateClaimStatus(@PathVariable long id, @RequestBody ClaimStatus newStatus) {
        return repository.findById(id)
                .map(claim -> {
                    claim.setStatus(newStatus);
                    events.publishEvent(new ClaimsChangedEvent());
                    return ResponseEntity.ok(claim);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Claim> deleteClaim(@PathVariable Long id) {
        repository.deleteById(id);
        claimEvents.broadcast("claims-changed");
        return ResponseEntity.ok().build();
    }

}
