package com.mediaprogramming.FactChecking.controller;

import com.mediaprogramming.FactChecking.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims/{claimId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("")
    public List<CommentResponse> getComments(@PathVariable Long claimId) {
        return commentService.findByClaimId(claimId).stream()
                .map(CommentResponse::from)
                .toList();
    }

    @PostMapping("")
    public ResponseEntity<CommentResponse> newComment(
            @PathVariable Long claimId,
            @Valid @RequestBody CreateCommentRequest request) {
        return commentService.create(claimId, request.text())
                .map(CommentResponse::from)
                .map(c -> ResponseEntity.status(HttpStatus.CREATED).body(c))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
