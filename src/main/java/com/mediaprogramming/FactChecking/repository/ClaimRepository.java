package com.mediaprogramming.FactChecking.repository;

import com.mediaprogramming.FactChecking.model.Claim;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    @EntityGraph(attributePaths = "author")
    List<Claim> findByAuthorUsernameOrderByIdDesc(String username);

    @EntityGraph(attributePaths = "author")
    List<Claim> findAllByOrderByIdDesc();

}
