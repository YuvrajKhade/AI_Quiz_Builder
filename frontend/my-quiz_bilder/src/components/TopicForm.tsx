import { useState } from 'react';
import type { Difficulty } from '../types';

interface Props {
  onSubmit: (topic: string, difficulty: Difficulty) => void;
  loading: boolean;
}

const DIFFICULTIES: { value: Difficulty; label: string; desc: string }[] = [
  { value: 'BEGINNER', label: 'Beginner', desc: 'Recall & comprehension' },
  { value: 'INTERMEDIATE', label: 'Intermediate', desc: 'Application & understanding' },
  { value: 'ADVANCED', label: 'Advanced', desc: 'Analysis & synthesis' },
];

export function TopicForm({ onSubmit, loading }: Props) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('INTERMEDIATE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) onSubmit(topic.trim(), difficulty);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="e.g. Photosynthesis, Neural Networks, Ancient Rome"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        />
      </div>

      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">Difficulty</label>
        <div className="grid gap-3 sm:grid-cols-3">
          {DIFFICULTIES.map(d => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDifficulty(d.value)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                difficulty === d.value
                  ? 'border-cyan-500 bg-cyan-50 shadow-sm ring-4 ring-cyan-100'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-sm font-bold text-slate-900">{d.label}</div>
              <div className="mt-1 text-xs leading-5 text-slate-500">{d.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!topic.trim() || loading}
        className="w-full rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition-all hover:-translate-y-0.5 hover:bg-slate-800 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        {loading ? 'Generating quiz...' : 'Generate Quiz'}
      </button>
    </form>
  );
}
