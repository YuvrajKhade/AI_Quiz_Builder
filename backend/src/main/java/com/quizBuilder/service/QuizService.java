package com.quizBuilder.service;

import com.quizBuilder.dto.QuizDTO;
import com.quizBuilder.gateway.AIGateway;
import com.quizBuilder.gateway.WikipediaGateway;
import com.quizBuilder.model.*;
import com.quizBuilder.repository.QuizRepository;
import com.quizBuilder.repository.QuizResultRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizResultRepository resultRepository;
    private final AIGateway aiGateway;
    private final WikipediaGateway wikipediaGateway;
    private final AdaptiveDifficultyEngine difficultyEngine;

    // ── Generate ──────────────────────────────────────────

    @Transactional
    public QuizDTO.QuizResponse generate(String topic, Difficulty difficulty) {
        Optional<String> context = wikipediaGateway.fetchSummary(topic);

        List<Question> questions = aiGateway.generateQuestions(topic, difficulty, context);

        Quiz quiz = Quiz.builder()
                .topic(topic)
                .difficulty(difficulty)
                .questions(questions)
                .wikipediaContext(context.orElse(null))
                .build();

        quiz = quizRepository.save(quiz);
        log.info("Quiz saved id={} topic='{}' difficulty={}", quiz.getId(), topic, difficulty);

        return toQuizResponse(quiz);
    }

    // ── Submit ────────────────────────────────────────────

    @Transactional
    public QuizDTO.ResultResponse submit(Long quizId, Map<Integer, String> answers) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found: " + quizId));

        List<QuizDTO.QuestionFeedback> feedback = buildFeedback(quiz.getQuestions(), answers);
        int score = (int) feedback.stream().filter(QuizDTO.QuestionFeedback::isCorrect).count();

        QuizResult result = QuizResult.builder()
                .quiz(quiz)
                .answers(answers)
                .score(score)
                .total(quiz.getQuestions().size())
                .build();

        result = resultRepository.save(result);

        Difficulty next = difficultyEngine.suggest(quiz.getTopic(), quiz.getDifficulty());

        return QuizDTO.ResultResponse.builder()
                .resultId(result.getId())
                .quizId(quizId)
                .topic(quiz.getTopic())
                .score(score)
                .total(quiz.getQuestions().size())
                .feedback(feedback)
                .suggestedNextDifficulty(next)
                .build();
    }

    // ── History ───────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<QuizDTO.HistorySummary> history() {
        return resultRepository.findAllByOrderBySubmittedAtDesc().stream()
                .map(this::toHistorySummary)
                .toList();
    }

    // ── Get quiz (for review) ─────────────────────────────

    @Transactional(readOnly = true)
    public QuizDTO.QuizResponse getQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found: " + quizId));
        return toQuizResponse(quiz);
    }

    // ── Mappers ───────────────────────────────────────────

    private List<QuizDTO.QuestionFeedback> buildFeedback(
            List<Question> questions,
            Map<Integer, String> answers
    ) {
        List<QuizDTO.QuestionFeedback> list = new ArrayList<>();
        for (Question q : questions) {
            String selected = answers.get(q.getIndex());
            boolean correct = q.getCorrectOption().equalsIgnoreCase(selected);
            list.add(QuizDTO.QuestionFeedback.builder()
                    .index(q.getIndex())
                    .questionText(q.getText())
                    .selectedOption(selected)
                    .correctOption(q.getCorrectOption())
                    .correct(correct)
                    .explanation(q.getExplanation())
                    .build());
        }
        return list;
    }

    private QuizDTO.QuizResponse toQuizResponse(Quiz quiz) {
        return QuizDTO.QuizResponse.builder()
                .id(quiz.getId())
                .topic(quiz.getTopic())
                .difficulty(quiz.getDifficulty())
                .questions(quiz.getQuestions())
                .createdAt(quiz.getCreatedAt())
                .build();
    }

    private QuizDTO.HistorySummary toHistorySummary(QuizResult r) {
        return QuizDTO.HistorySummary.builder()
                .resultId(r.getId())
                .quizId(r.getQuiz().getId())
                .topic(r.getQuiz().getTopic())
                .difficulty(r.getQuiz().getDifficulty())
                .score(r.getScore())
                .total(r.getTotal())
                .submittedAt(r.getSubmittedAt())
                .build();
    }
}