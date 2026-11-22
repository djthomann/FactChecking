package com.mediaprogramming.FactChecking.controller;

import com.mediaprogramming.FactChecking.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/claims/{claimId}/comments")
    public List<CommentResponse> getComments(@PathVariable Long claimId) {
        return commentService.findByClaimId(claimId).stream()
                .map(CommentResponse::from)
                .toList();
    }

    @PostMapping("/claims/{claimId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<CommentResponse> newComment(
            @PathVariable Long claimId,
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return commentService.create(claimId, request.text(), user.getUsername())
                .map(CommentResponse::from)
                .map(c -> ResponseEntity.status(HttpStatus.CREATED).body(c))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(@PathVariable Long commentId) {
        commentService.delete(commentId);
    }

}
