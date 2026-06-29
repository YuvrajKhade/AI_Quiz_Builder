import { useQuery } from 'react-query';
import { QuizAPI } from '../services/quizApi';

export function HistoryPage() {
  const { data: history, isLoading, isError } = useQuery('history', QuizAPI.history);

  if (isLoading) return <p className="rounded-3xl border border-slate-200 bg-white py-10 text-center text-sm font-medium text-slate-500 shadow-sm">Loading history...</p>;
  if (isError) return <p className="rounded-3xl border border-red-200 bg-red-50 py-10 text-center text-sm font-medium text-red-600 shadow-sm">Failed to load history.</p>;
  if (!history?.length) return <p className="rounded-3xl border border-slate-200 bg-white py-10 text-center text-sm font-medium text-slate-400 shadow-sm">No quizzes taken yet.</p>;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-slate-900">Quiz History</h2>
      {history.map(h => {
        const pct = Math.round((h.score / h.total) * 100);
        return (
          <div key={h.resultId} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-slate-900">{h.topic}</div>
              <div className="mt-1 text-xs font-medium text-slate-400">
                {h.difficulty.charAt(0) + h.difficulty.slice(1).toLowerCase()} ·{' '}
                {new Date(h.submittedAt).toLocaleDateString()}
              </div>
            </div>
            <div className={`shrink-0 rounded-2xl px-3 py-2 text-lg font-black ${
              pct >= 80 ? 'bg-emerald-50 text-emerald-600' : pct >= 60 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
            }`}>
              {h.score}/{h.total}
            </div>
          </div>
        );
      })}
    </div>
  );
}
