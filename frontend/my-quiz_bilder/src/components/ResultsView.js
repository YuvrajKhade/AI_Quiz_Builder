import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
export function ResultsView({ result, onRetry }) {
    const pct = Math.round((result.score / result.total) * 100);
    const scoreColor = pct >= 80 ? 'text-emerald-600' :
        pct >= 60 ? 'text-amber-600' :
            'text-red-600';
    const difficultyLabel = {
        BEGINNER: 'Beginner',
        INTERMEDIATE: 'Intermediate',
        ADVANCED: 'Advanced',
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm", children: [_jsxs("div", { className: `text-6xl font-black tracking-tight ${scoreColor}`, children: [result.score, "/", result.total] }), _jsxs("div", { className: "mt-2 text-sm font-semibold text-slate-500", children: [pct, "% correct"] }), _jsx("div", { className: "mt-3 text-lg font-bold text-slate-900", children: result.topic })] }), _jsxs("div", { className: "rounded-3xl border border-cyan-200 bg-cyan-50 p-4 text-sm shadow-sm", children: [_jsx("span", { className: "font-bold text-cyan-800", children: "Next suggested difficulty: " }), _jsx("span", { className: "font-semibold text-cyan-700", children: difficultyLabel[result.suggestedNextDifficulty] }), _jsx("span", { className: "ml-2 text-cyan-600", children: pct >= 80 ? 'Great job, levelling up!' : pct <= 40 ? 'More practice recommended.' : 'Keep going!' })] }), _jsx("div", { className: "space-y-3", children: result.feedback.map(f => (_jsx("div", { className: `rounded-3xl border p-5 shadow-sm ${f.correct
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-red-200 bg-red-50'}`, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: `inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black ${f.correct ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`, children: f.correct ? '✓' : '×' }), _jsxs("div", { className: "flex-1 space-y-1", children: [_jsx("p", { className: "text-sm font-semibold leading-6 text-slate-800", children: f.questionText }), !f.correct && (_jsxs("p", { className: "text-xs font-medium text-red-700", children: ["You answered ", _jsx("strong", { children: f.selectedOption }), " - correct: ", _jsx("strong", { children: f.correctOption })] })), _jsx("p", { className: "mt-2 text-xs leading-5 text-slate-600", children: f.explanation })] })] }) }, f.index))) }), _jsx("button", { onClick: onRetry, className: "w-full rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition-all hover:-translate-y-0.5 hover:bg-slate-800", children: "Try Another Quiz" })] }));
}
