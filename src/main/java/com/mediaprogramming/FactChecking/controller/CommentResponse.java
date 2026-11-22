package com.mediaprogramming.FactChecking.controller;

import com.mediaprogramming.FactChecking.model.Comment;

public record CommentResponse(Long id, String authorUsername, String text) {

    public static CommentResponse from(Comment comment)  {
        return new CommentResponse(comment.getId(), comment.getAuthor().getUsername(), comment.getText());
    }
}
