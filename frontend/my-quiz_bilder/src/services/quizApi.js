import axios from 'axios';
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' },
});
export const QuizAPI = {
    /** Generate a new quiz */
    generate: (topic, difficulty) => api.post('/quiz/generate', { topic, difficulty }).then(r => r.data),
    /** Submit answers and get scored result */
    submit: (quizId, answers) => api.post(`/quiz/${quizId}/submit`, { answers }).then(r => r.data),
    /** Fetch full quiz by ID (for review) */
    getQuiz: (quizId) => api.get(`/quiz/${quizId}`).then(r => r.data),
    /** Fetch history list */
    history: () => api.get('/quiz/history').then(r => r.data),
};
