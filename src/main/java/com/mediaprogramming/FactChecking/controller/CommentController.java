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
    public CommentResponse newComment(
            @PathVariable Long claimId,
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return CommentResponse.from(commentService.createComment(claimId, request.text(), user.getUsername()));
    }

    @DeleteMapping("/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails user) {
        commentService.deleteComment(commentId, user.getUsername());
        return ResponseEntity.ok().build();
    }

}
