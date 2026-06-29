import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from 'react-query';
import { QuizAPI } from '../services/quizApi';
export function HistoryPage() {
    const { data: history, isLoading, isError } = useQuery('history', QuizAPI.history);
    if (isLoading)
        return _jsx("p", { className: "rounded-3xl border border-slate-200 bg-white py-10 text-center text-sm font-medium text-slate-500 shadow-sm", children: "Loading history..." });
    if (isError)
        return _jsx("p", { className: "rounded-3xl border border-red-200 bg-red-50 py-10 text-center text-sm font-medium text-red-600 shadow-sm", children: "Failed to load history." });
    if (!history?.length)
        return _jsx("p", { className: "rounded-3xl border border-slate-200 bg-white py-10 text-center text-sm font-medium text-slate-400 shadow-sm", children: "No quizzes taken yet." });
    return (_jsxs("div", { className: "space-y-3", children: [_jsx("h2", { className: "text-lg font-bold text-slate-900", children: "Quiz History" }), history.map(h => {
                const pct = Math.round((h.score / h.total) * 100);
                return (_jsxs("div", { className: "flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "truncate text-sm font-bold text-slate-900", children: h.topic }), _jsxs("div", { className: "mt-1 text-xs font-medium text-slate-400", children: [h.difficulty.charAt(0) + h.difficulty.slice(1).toLowerCase(), " \u00B7", ' ', new Date(h.submittedAt).toLocaleDateString()] })] }), _jsxs("div", { className: `shrink-0 rounded-2xl px-3 py-2 text-lg font-black ${pct >= 80 ? 'bg-emerald-50 text-emerald-600' : pct >= 60 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`, children: [h.score, "/", h.total] })] }, h.resultId));
            })] }));
}
