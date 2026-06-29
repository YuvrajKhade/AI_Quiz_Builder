package com.quizBuilder.repository;

import com.quizBuilder.model.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {

    /** Most recent results first, for history feed */
    List<QuizResult> findAllByOrderBySubmittedAtDesc();

    /** Last N results for a topic — used by adaptive difficulty engine */
    @Query("""
        SELECT r FROM QuizResult r
        WHERE r.quiz.topic = :topic
        ORDER BY r.submittedAt DESC
        LIMIT :limit
        """)
    List<QuizResult> findRecentByTopic(@Param("topic") String topic,
                                       @Param("limit") int limit);
}