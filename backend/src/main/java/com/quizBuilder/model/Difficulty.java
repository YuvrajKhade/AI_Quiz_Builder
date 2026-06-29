package com.quizBuilder.model;

public enum Difficulty {

    BEGINNER(
            "Generate foundational questions that test recall and basic comprehension. " +
                    "Use clear distractors that rule out common beginner misconceptions."
    ),
    INTERMEDIATE(
            "Generate questions that test understanding and application of concepts. " +
                    "Distractors should be plausible but distinguishable with solid knowledge."
    ),
    ADVANCED(
            "Generate questions that require analysis, evaluation, or synthesis of concepts. " +
                    "Distractors should be sophisticated and require deep knowledge to rule out."
    );

    private final String promptStrategy;

    Difficulty(String promptStrategy) {
        this.promptStrategy = promptStrategy;
    }

    public String getPromptStrategy() {
        return promptStrategy;
    }
}