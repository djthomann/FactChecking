package com.mediaprogramming.FactChecking.service;

import com.mediaprogramming.FactChecking.controller.ClaimResponse;
import com.mediaprogramming.FactChecking.controller.CreateClaimRequest;
import com.mediaprogramming.FactChecking.controller.UpdateStatusRequest;
import com.mediaprogramming.FactChecking.controller.UpdateUrlRequest;
import com.mediaprogramming.FactChecking.model.AppUser;
import com.mediaprogramming.FactChecking.model.Claim;
import com.mediaprogramming.FactChecking.repository.AppUserRepository;
import com.mediaprogramming.FactChecking.repository.ClaimRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository repository;
    private final AppUserRepository userRepository;

    private final ApplicationEventPublisher events;

    @Autowired
    public ClaimServiceImpl(ClaimRepository repository, AppUserRepository userRepository, ApplicationEventPublisher events) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.events = events;
    }

    @Transactional
    public Claim createClaim(CreateClaimRequest request, String username) {
        AppUser author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Claim claim = new Claim();
        claim.setTitle(request.title());
        claim.setText(request.text());
        claim.setCategory(request.category());
        claim.setAuthor(author);

        events.publishEvent(new ClaimsChangedEvent());

        return repository.save(claim);
    }

    @Override
    public Optional<Claim> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public List<Claim> findAll() {
        return repository.findAllByOrderByIdDesc();
    }

    @Transactional
    public List<Claim> findByAuthor(String username) {
        return repository.findByAuthorUsernameOrderByIdDesc(username);
    }

    @Override
    @Transactional
    public Claim updateStatus(Long id, UpdateStatusRequest request, String username) {
        Claim claim = getOwnedClaim(id, username);
        claim.setStatus(request.status());
        events.publishEvent(new ClaimsChangedEvent());
        return claim;
    }

    @Override
    @Transactional
    public Claim updateUrl(Long id, UpdateUrlRequest request, String username) {
        Claim claim = getOwnedClaim(id, username);
        claim.setUrl(request.url());
        events.publishEvent(new ClaimsChangedEvent());
        return claim;
    }

    @Transactional
    public void deleteClaim(Long claimId, String username) {
        Claim claim = getOwnedClaim(claimId, username);
        events.publishEvent(new ClaimsChangedEvent());
        repository.delete(claim);
    }

    private Claim getOwnedClaim(Long claimId, String username) {
        Claim claim = repository.findById(claimId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!claim.getAuthor().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return claim;
    }
}
