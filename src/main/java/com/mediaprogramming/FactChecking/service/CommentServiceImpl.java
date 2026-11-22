package com.mediaprogramming.FactChecking.service;

import com.mediaprogramming.FactChecking.model.AppUser;
import com.mediaprogramming.FactChecking.model.Comment;
import com.mediaprogramming.FactChecking.repository.AppUserRepository;
import com.mediaprogramming.FactChecking.repository.ClaimRepository;
import com.mediaprogramming.FactChecking.repository.CommentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final ClaimRepository claimRepository;
    private final AppUserRepository userRepository;

    @Autowired
    public CommentServiceImpl(CommentRepository commentRepository, ClaimRepository claimRepository, AppUserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.claimRepository = claimRepository;
        this.userRepository = userRepository;
    }


    @Override
    @Transactional
    public Optional<Comment> create(Long claimId, String text, String username) {

        AppUser author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        return claimRepository.findById(claimId)
                .map(claim -> commentRepository.save(new Comment(claim, author, text)));
    }

    @Override
    public List<Comment> findAll() {
        return commentRepository.findAll();
    }

    @Override
    public List<Comment> findByClaimId(Long claimId) {
        return commentRepository.findByClaimId(claimId);
    }

    @Override
    public void delete(Long id) {
        commentRepository.deleteById(id);
    }
}
