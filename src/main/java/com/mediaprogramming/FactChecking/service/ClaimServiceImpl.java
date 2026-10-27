package com.mediaprogramming.FactChecking.service;

import com.mediaprogramming.FactChecking.controller.CreateClaimRequest;
import com.mediaprogramming.FactChecking.controller.UpdateStatusRequest;
import com.mediaprogramming.FactChecking.controller.UpdateUrlRequest;
import com.mediaprogramming.FactChecking.model.Claim;
import com.mediaprogramming.FactChecking.repository.ClaimRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository repository;
    private final ApplicationEventPublisher events;

    @Autowired
    public ClaimServiceImpl(ClaimRepository repository, ApplicationEventPublisher events) {
        this.repository = repository;
        this.events = events;
    }

    @Override
    public Claim create(CreateClaimRequest request) {
        Claim claim = new Claim();
        claim.setName(request.name());
        events.publishEvent(new ClaimsChangedEvent());
        return repository.save(claim);
    }

    @Override
    public Optional<Claim> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<Claim> findAll() {
        return repository.findAll();
    }

    @Override
    @Transactional
    public Optional<Claim> updateStatus(Long id, UpdateStatusRequest request) {
        return findById(id)
                .map(claim -> {
                    claim.setStatus(request.status());
                    events.publishEvent(new ClaimsChangedEvent());
                    return claim;
                });
    }

    @Override
    @Transactional
    public Optional<Claim> updateUrl(Long id, UpdateUrlRequest request) {
        return findById(id)
                .map(claim -> {
                    claim.setUrl(request.url());
                    events.publishEvent(new ClaimsChangedEvent());
                    return claim;
                });
    }

    @Override
    public void delete(Long id) {
        events.publishEvent(new ClaimsChangedEvent());
        repository.deleteById(id);
    }
}
