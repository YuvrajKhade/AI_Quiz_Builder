package com.quizBuilder.gateway;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quizBuilder.model.Difficulty;
import com.quizBuilder.model.Question;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Builds the quiz-generation prompt and calls the configured LLM via Spring AI.
 * Returns a typed List<Question> — no string parsing, no regex.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AIGateway {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    @Value("${app.quiz.questions-per-quiz:5}")
    private int questionsPerQuiz;

    private static final String SYSTEM_PROMPT = """
        You are a quiz-generation engine. You MUST respond with valid JSON only.
        Do not include any explanation, markdown, or text outside the JSON.
        The JSON must follow this exact schema:
        {
          "questions": [
            {
              "index": 0,
              "text": "Question text here?",
              "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
              "correctOption": "A",
              "explanation": "Brief explanation of why this answer is correct."
            }
          ]
        }
        """;

    /**
     * Generates quiz questions for the given topic, difficulty, and optional Wikipedia context.
     */
    public List<Question> generateQuestions(
            String topic,
            Difficulty difficulty,
            Optional<String> context
    ) {
        String userPrompt = buildUserPrompt(topic, difficulty, context);

        log.info("Calling LLM for topic='{}', difficulty={}", topic, difficulty);

        String rawJson = chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .user(userPrompt)
                .call()
                .content();

        return parseQuestions(rawJson);
    }

    private String buildUserPrompt(String topic, Difficulty difficulty, Optional<String> context) {
        StringBuilder sb = new StringBuilder();
        sb.append("Topic: ").append(topic).append("\n");
        sb.append("Number of questions: ").append(questionsPerQuiz).append("\n");
        sb.append("Difficulty strategy: ").append(difficulty.getPromptStrategy()).append("\n");

        context.ifPresent(ctx -> sb
                .append("\nBackground context (use for factual accuracy — do not copy verbatim):\n")
                .append(ctx)
                .append("\n"));

        sb.append("\nGenerate ").append(questionsPerQuiz)
                .append(" multiple-choice questions on this topic as JSON.");

        return sb.toString();
    }

    private List<Question> parseQuestions(String rawJson) {
        try {
            // Strip accidental markdown fences if model ignores instruction
            String clean = rawJson
                    .replaceAll("(?s)```json\\s*", "")
                    .replaceAll("(?s)```\\s*", "")
                    .trim();

            var wrapper = objectMapper.readTree(clean);
            return objectMapper.convertValue(
                    wrapper.get("questions"),
                    new TypeReference<List<Question>>() {}
            );
        } catch (Exception e) {
            log.error("Failed to parse LLM response: {}", rawJson, e);
            throw new IllegalStateException("AI response could not be parsed into questions.", e);
        }
    }
}