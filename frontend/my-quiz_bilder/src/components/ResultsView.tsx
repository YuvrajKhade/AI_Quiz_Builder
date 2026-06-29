import type { ResultResponse } from '../types';

interface Props {
  result: ResultResponse;
  onRetry: () => void;
}

export function ResultsView({ result, onRetry }: Props) {
  const pct = Math.round((result.score / result.total) * 100);

  const scoreColor =
    pct >= 80 ? 'text-emerald-600' :
    pct >= 60 ? 'text-amber-600' :
    'text-red-600';

  const difficultyLabel: Record<string, string> = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className={`text-6xl font-black tracking-tight ${scoreColor}`}>
          {result.score}/{result.total}
        </div>
        <div className="mt-2 text-sm font-semibold text-slate-500">{pct}% correct</div>
        <div className="mt-3 text-lg font-bold text-slate-900">{result.topic}</div>
      </div>

      <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4 text-sm shadow-sm">
        <span className="font-bold text-cyan-800">Next suggested difficulty: </span>
        <span className="font-semibold text-cyan-700">{difficultyLabel[result.suggestedNextDifficulty]}</span>
        <span className="ml-2 text-cyan-600">
          {pct >= 80 ? 'Great job, levelling up!' : pct <= 40 ? 'More practice recommended.' : 'Keep going!'}
        </span>
      </div>

      <div className="space-y-3">
        {result.feedback.map(f => (
          <div
            key={f.index}
            className={`rounded-3xl border p-5 shadow-sm ${
              f.correct
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                f.correct ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {f.correct ? '✓' : '×'}
              </span>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold leading-6 text-slate-800">{f.questionText}</p>
                {!f.correct && (
                  <p className="text-xs font-medium text-red-700">
                    You answered <strong>{f.selectedOption}</strong> - correct: <strong>{f.correctOption}</strong>
                  </p>
                )}
                <p className="mt-2 text-xs leading-5 text-slate-600">{f.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onRetry}
        className="w-full rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition-all hover:-translate-y-0.5 hover:bg-slate-800"
      >
        Try Another Quiz
      </button>
    </div>
  );
}
