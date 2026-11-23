package com.mediaprogramming.FactChecking.controller;

import com.mediaprogramming.FactChecking.model.Comment;
import com.mediaprogramming.FactChecking.model.CommentStance;

public record CommentResponse(Long id, CommentStance stance, String authorUsername, String text) {

    public static CommentResponse from(Comment comment)  {
        return new CommentResponse(comment.getId(), comment.getStance(), comment.getAuthor().getUsername(), comment.getText());
    }
}
