package com.quizBuilder.service;

import com.quizBuilder.model.Difficulty;
import com.quizBuilder.model.QuizResult;
import com.quizBuilder.repository.QuizResultRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Unique feature: analyses the user's recent performance on a topic
 * and recommends the next difficulty level (Bloom's taxonomy-inspired).
 *
 * Rules:
 *   - avg score >= 80% → bump up one level
 *   - avg score <= 40% → drop down one level
 *   - otherwise        → stay at current level
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdaptiveDifficultyEngine {

    private static final int LOOKBACK = 3;   // examine last N results
    private static final double BUMP_UP_THRESHOLD   = 0.80;
    private static final double DROP_DOWN_THRESHOLD = 0.40;

    private final QuizResultRepository resultRepository;

    /**
     * Returns the suggested difficulty for the next quiz on this topic.
     */
    public Difficulty suggest(String topic, Difficulty currentDifficulty) {
        List<QuizResult> recent = resultRepository.findRecentByTopic(topic, LOOKBACK);

        if (recent.isEmpty()) {
            return currentDifficulty;
        }

        double avgRatio = recent.stream()
                .mapToDouble(r -> (double) r.getScore() / r.getTotal())
                .average()
                .orElse(0.5);

        Difficulty suggestion;
        if (avgRatio >= BUMP_UP_THRESHOLD) {
            suggestion = bumpUp(currentDifficulty);
        } else if (avgRatio <= DROP_DOWN_THRESHOLD) {
            suggestion = dropDown(currentDifficulty);
        } else {
            suggestion = currentDifficulty;
        }

        log.info("AdaptiveDifficulty: topic='{}' avgScore={:.0f}% → suggest {}",
                topic, avgRatio * 100, suggestion);
        return suggestion;
    }

    private Difficulty bumpUp(Difficulty d) {
        return switch (d) {
            case BEGINNER     -> Difficulty.INTERMEDIATE;
            case INTERMEDIATE -> Difficulty.ADVANCED;
            case ADVANCED     -> Difficulty.ADVANCED;
        };
    }

    private Difficulty dropDown(Difficulty d) {
        return switch (d) {
            case BEGINNER     -> Difficulty.BEGINNER;
            case INTERMEDIATE -> Difficulty.BEGINNER;
            case ADVANCED     -> Difficulty.INTERMEDIATE;
        };
    }
}