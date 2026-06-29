package com.quizBuilder.controller;

import com.quizBuilder.dto.QuizDTO;
import com.quizBuilder.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    /**
     * POST /api/quiz/generate
     * Body: { "topic": "Neural Networks", "difficulty": "INTERMEDIATE" }
     */
    @PostMapping("/generate")
    public ResponseEntity<QuizDTO.QuizResponse> generate(
            @Valid @RequestBody QuizDTO.GenerateRequest request
    ) {
        QuizDTO.QuizResponse response = quizService.generate(
                request.getTopic(),
                request.getDifficulty()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/quiz/{id}/submit
     * Body: { "answers": { "0": "A", "1": "C", "2": "B", "3": "D", "4": "A" } }
     */
    @PostMapping("/{id}/submit")
    public ResponseEntity<QuizDTO.ResultResponse> submit(
            @PathVariable Long id,
            @Valid @RequestBody QuizDTO.SubmitRequest request
    ) {
        QuizDTO.ResultResponse response = quizService.submit(id, request.getAnswers());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/quiz/history
     * Returns all past quiz results, newest first.
     */
    @GetMapping("/history")
    public ResponseEntity<List<QuizDTO.HistorySummary>> history() {
        return ResponseEntity.ok(quizService.history());
    }

    /**
     * GET /api/quiz/{id}
     * Returns a full quiz (for review mode).
     */
    @GetMapping("/{id}")
    public ResponseEntity<QuizDTO.QuizResponse> getQuiz(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuiz(id));
    }
}