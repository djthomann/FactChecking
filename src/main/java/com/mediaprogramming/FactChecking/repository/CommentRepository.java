package com.mediaprogramming.FactChecking.repository;

import com.mediaprogramming.FactChecking.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByClaimId(Long claimId);

}
