import { useState } from 'react';
import { QuizAPI } from '../services/quizApi';
import type { Difficulty, QuizResponse, ResultResponse } from '../types';

type Phase = 'idle' | 'loading' | 'playing' | 'submitting' | 'results' | 'error';

export function useQuiz() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [result, setResult] = useState<ResultResponse | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);

  const generate = async (topic: string, difficulty: Difficulty) => {
    setPhase('loading');
    setError(null);
    setAnswers({});
    setResult(null);
    try {
      const data = await QuizAPI.generate(topic, difficulty);
      setQuiz(data);
      setPhase('playing');
    } catch {
      setError('Failed to generate quiz. Check your API key and try again.');
      setPhase('error');
    }
  };

  const selectAnswer = (questionIndex: number, option: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: option }));
  };

  const submit = async () => {
    if (!quiz) return;
    setPhase('submitting');
    try {
      const data = await QuizAPI.submit(quiz.id, answers);
      setResult(data);
      setPhase('results');
    } catch {
      setError('Failed to submit quiz. Please try again.');
      setPhase('error');
    }
  };

  const reset = () => {
    setPhase('idle');
    setQuiz(null);
    setResult(null);
    setAnswers({});
    setError(null);
  };

  const allAnswered = quiz
    ? quiz.questions.every(q => answers[q.index] !== undefined)
    : false;

  return { phase, quiz, result, answers, error, allAnswered, generate, selectAnswer, submit, reset };
}