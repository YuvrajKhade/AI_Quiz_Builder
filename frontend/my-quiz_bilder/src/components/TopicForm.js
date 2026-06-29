import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const DIFFICULTIES = [
    { value: 'BEGINNER', label: 'Beginner', desc: 'Recall & comprehension' },
    { value: 'INTERMEDIATE', label: 'Intermediate', desc: 'Application & understanding' },
    { value: 'ADVANCED', label: 'Advanced', desc: 'Analysis & synthesis' },
];
export function TopicForm({ onSubmit, loading }) {
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('INTERMEDIATE');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (topic.trim())
            onSubmit(topic.trim(), difficulty);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-semibold text-slate-700", children: "Topic" }), _jsx("input", { type: "text", value: topic, onChange: e => setTopic(e.target.value), placeholder: "e.g. Photosynthesis, Neural Networks, Ancient Rome", className: "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60", disabled: loading })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-3 block text-sm font-semibold text-slate-700", children: "Difficulty" }), _jsx("div", { className: "grid gap-3 sm:grid-cols-3", children: DIFFICULTIES.map(d => (_jsxs("button", { type: "button", onClick: () => setDifficulty(d.value), className: `rounded-2xl border p-4 text-left transition-all ${difficulty === d.value
                                ? 'border-cyan-500 bg-cyan-50 shadow-sm ring-4 ring-cyan-100'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`, children: [_jsx("div", { className: "text-sm font-bold text-slate-900", children: d.label }), _jsx("div", { className: "mt-1 text-xs leading-5 text-slate-500", children: d.desc })] }, d.value))) })] }), _jsx("button", { type: "submit", disabled: !topic.trim() || loading, className: "w-full rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition-all hover:-translate-y-0.5 hover:bg-slate-800 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none", children: loading ? 'Generating quiz...' : 'Generate Quiz' })] }));
}
