package com.mediaprogramming.FactChecking.service;

import com.mediaprogramming.FactChecking.controller.CreateClaimRequest;
import com.mediaprogramming.FactChecking.model.AppUser;
import com.mediaprogramming.FactChecking.model.Claim;
import com.mediaprogramming.FactChecking.model.Comment;
import com.mediaprogramming.FactChecking.model.CommentStance;
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
    public Comment createComment(Long claimId, String text, String username, CommentStance stance) {
        AppUser author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return commentRepository.save(new Comment(claim, author, text, stance));
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
    public void deleteComment(Long id, String username) {
        Comment comment = getOwnedComment(id, username);
        // TODO() SSE for Comments
        commentRepository.delete(comment);
    }

    private Comment getOwnedComment(Long commentId, String username) {
       Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!comment.getAuthor().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return comment;
    }
}
