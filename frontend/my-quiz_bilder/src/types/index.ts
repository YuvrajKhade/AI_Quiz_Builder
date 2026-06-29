export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface Question {
  index: number;
  text: string;
  options: Record<'A' | 'B' | 'C' | 'D', string>;
  correctOption: string;
  explanation: string;
}

export interface QuizResponse {
  id: number;
  topic: string;
  difficulty: Difficulty;
  questions: Question[];
  createdAt: string;
}

export interface QuestionFeedback {
  index: number;
  questionText: string;
  selectedOption: string;
  correctOption: string;
  correct: boolean;
  explanation: string;
}

export interface ResultResponse {
  resultId: number;
  quizId: number;
  topic: string;
  score: number;
  total: number;
  feedback: QuestionFeedback[];
  suggestedNextDifficulty: Difficulty;
}

export interface HistorySummary {
  resultId: number;
  quizId: number;
  topic: string;
  difficulty: Difficulty;
  score: number;
  total: number;
  submittedAt: string;
}