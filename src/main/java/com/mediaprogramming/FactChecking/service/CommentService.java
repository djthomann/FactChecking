package com.mediaprogramming.FactChecking.service;

import com.mediaprogramming.FactChecking.model.Comment;

import java.util.List;
import java.util.Optional;

public interface CommentService {

    Optional<Comment> create(Long claimId, String text, String username);

    List<Comment> findAll();

    List<Comment> findByClaimId(Long claimId);

    void delete(Long id);

}
