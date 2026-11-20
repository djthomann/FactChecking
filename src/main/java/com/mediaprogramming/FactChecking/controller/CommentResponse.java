package com.mediaprogramming.FactChecking.controller;

import com.mediaprogramming.FactChecking.model.Comment;

public record CommentResponse(String text) {

    public static CommentResponse from(Comment comment)  {
        return new CommentResponse(comment.getText());
    }

}
