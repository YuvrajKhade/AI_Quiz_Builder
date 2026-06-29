package com.quizBuilder.model;

import lombok.*;

import java.util.Map;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Question {

    private int index;
    private String text;

    /** Keys are "A", "B", "C", "D" */
    private Map<String, String> options;

    private String correctOption;   // "A" | "B" | "C" | "D"
    private String explanation;     // Why the correct answer is right
}