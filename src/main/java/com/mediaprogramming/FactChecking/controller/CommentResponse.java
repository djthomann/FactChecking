package com.mediaprogramming.FactChecking.controller;

import com.mediaprogramming.FactChecking.model.Claim;
import com.mediaprogramming.FactChecking.model.ClaimCategory;
import com.mediaprogramming.FactChecking.model.ClaimStatus;
import com.mediaprogramming.FactChecking.model.Comment;

public record CommentResponse(String text) {

    public static CommentResponse from(Comment comment)  {
        return new CommentResponse(comment.getText());
    }

}
