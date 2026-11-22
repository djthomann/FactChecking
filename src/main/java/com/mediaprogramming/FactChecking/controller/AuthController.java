package com.mediaprogramming.FactChecking.controller;

import com.mediaprogramming.FactChecking.model.AppUser;
import com.mediaprogramming.FactChecking.repository.AppUserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserRepository repo;
    private final PasswordEncoder encoder;

    public AuthController(AppUserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@RequestBody @Valid RegisterRequest req) {
        if (repo.existsByUsername(req.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username taken");
        }
        AppUser user = new AppUser();
        user.setUsername(req.username());
        user.setPasswordHash(encoder.encode(req.password()));
        repo.save(user);
    }

    @GetMapping("/me")
    public Map<String, String> me(@AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return Map.of("username", user.getUsername());
    }

    @GetMapping("/csrf")
    public CsrfToken csrf(CsrfToken token) {
        return token;
    }
}

record RegisterRequest(@NotBlank String username, @NotBlank @Size(min = 8) String password) {}