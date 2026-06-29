import axios from 'axios';
import type { Difficulty, HistorySummary, QuizResponse, ResultResponse } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

export const QuizAPI = {
  /** Generate a new quiz */
  generate: (topic: string, difficulty: Difficulty): Promise<QuizResponse> =>
    api.post<QuizResponse>('/quiz/generate', { topic, difficulty }).then(r => r.data),

  /** Submit answers and get scored result */
  submit: (quizId: number, answers: Record<number, string>): Promise<ResultResponse> =>
    api.post<ResultResponse>(`/quiz/${quizId}/submit`, { answers }).then(r => r.data),

  /** Fetch full quiz by ID (for review) */
  getQuiz: (quizId: number): Promise<QuizResponse> =>
    api.get<QuizResponse>(`/quiz/${quizId}`).then(r => r.data),

  /** Fetch history list */
  history: (): Promise<HistorySummary[]> =>
    api.get<HistorySummary[]>('/quiz/history').then(r => r.data),
};