package com.mediaprogramming.FactChecking.repository;

import com.mediaprogramming.FactChecking.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
}