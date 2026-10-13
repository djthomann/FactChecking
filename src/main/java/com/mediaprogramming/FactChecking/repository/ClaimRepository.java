package com.mediaprogramming.FactChecking.repository;

import com.mediaprogramming.FactChecking.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
}
