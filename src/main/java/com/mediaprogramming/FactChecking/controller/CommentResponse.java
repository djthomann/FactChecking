package com.mediaprogramming.FactChecking.controller;

import com.mediaprogramming.FactChecking.model.Comment;

public record CommentResponse(Long id, String text) {

    public static CommentResponse from(Comment comment)  {
        return new CommentResponse(comment.getId(), comment.getText());
    }

}
