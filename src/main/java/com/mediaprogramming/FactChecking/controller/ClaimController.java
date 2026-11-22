package com.mediaprogramming.FactChecking.controller;

import com.mediaprogramming.FactChecking.model.ClaimCategory;
import com.mediaprogramming.FactChecking.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService service;
    private final ClaimSseBroadcaster claimSseBroadcaster;

    @Autowired
    public ClaimController(ClaimService service, ClaimSseBroadcaster claimSseBroadcaster) {
        this.service = service;
        this.claimSseBroadcaster = claimSseBroadcaster;
    }

    @GetMapping("")
    public List<ClaimResponse> getAll() {
        return service.findAll().stream()
                .map(ClaimResponse::from)
                .toList();
    }

    @GetMapping("/categories")
    public List<ClaimCategory> getCategories() {
        return List.of(ClaimCategory.values());
    }

    @GetMapping(path = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamClaims() {
        return claimSseBroadcaster.subscribe();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClaimResponse> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ClaimResponse::from)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClaimResponse createClaim(@RequestBody @Valid CreateClaimRequest request,
                                @AuthenticationPrincipal UserDetails user) {
        return service.createClaim(request, user.getUsername());
    }

    @PatchMapping("/{id}/url")
    public ResponseEntity<ClaimResponse> updateClaimUrl(@PathVariable long id, @Valid @RequestBody UpdateUrlRequest request) {
        return service.updateUrl(id, request)
                .map(ClaimResponse::from)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ClaimResponse> updateClaimStatus(@PathVariable long id, @RequestBody UpdateStatusRequest request) {
        return service.updateStatus(id, request)
                .map(ClaimResponse::from)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClaim(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

}
