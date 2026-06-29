package com.quizBuilder.dto;

import com.quizBuilder.model.Difficulty;
import com.quizBuilder.model.Question;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

// ── Inbound ──────────────────────────────────────────────

public class QuizDTO {

    /** POST /api/quiz/generate */
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class GenerateRequest {
        @NotBlank(message = "Topic must not be blank")
        private String topic;

        @NotNull(message = "Difficulty must not be null")
        private Difficulty difficulty;
    }

    /** POST /api/quiz/{id}/submit */
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class SubmitRequest {
        @NotNull
        private Map<Integer, String> answers;  // questionIndex → "A"|"B"|"C"|"D"
    }

    // ── Outbound ─────────────────────────────────────────

    /** Full quiz returned after generation */
    @Getter @Setter @Builder
    public static class QuizResponse {
        private Long id;
        private String topic;
        private Difficulty difficulty;
        private List<Question> questions;
        private Instant createdAt;
    }

    /** Score + per-question feedback after submission */
    @Getter @Setter @Builder
    public static class ResultResponse {
        private Long resultId;
        private Long quizId;
        private String topic;
        private int score;
        private int total;
        private List<QuestionFeedback> feedback;
        private Difficulty suggestedNextDifficulty;  // Adaptive difficulty engine output
    }

    @Getter @Setter @Builder
    public static class QuestionFeedback {
        private int index;
        private String questionText;
        private String selectedOption;
        private String correctOption;
        private boolean correct;
        private String explanation;
    }

    /** Compact summary for history list */
    @Getter @Setter @Builder
    public static class HistorySummary {
        private Long resultId;
        private Long quizId;
        private String topic;
        private Difficulty difficulty;
        private int score;
        private int total;
        private Instant submittedAt;
    }
}