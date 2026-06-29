import { useState } from 'react';
import { QuizAPI } from '../services/quizApi';
export function useQuiz() {
    const [phase, setPhase] = useState('idle');
    const [quiz, setQuiz] = useState(null);
    const [result, setResult] = useState(null);
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState(null);
    const generate = async (topic, difficulty) => {
        setPhase('loading');
        setError(null);
        setAnswers({});
        setResult(null);
        try {
            const data = await QuizAPI.generate(topic, difficulty);
            setQuiz(data);
            setPhase('playing');
        }
        catch {
            setError('Failed to generate quiz. Check your API key and try again.');
            setPhase('error');
        }
    };
    const selectAnswer = (questionIndex, option) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: option }));
    };
    const submit = async () => {
        if (!quiz)
            return;
        setPhase('submitting');
        try {
            const data = await QuizAPI.submit(quiz.id, answers);
            setResult(data);
            setPhase('results');
        }
        catch {
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
