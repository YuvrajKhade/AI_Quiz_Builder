import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import { TopicForm } from './components/TopicForm';
import { QuizPlayer } from './components/QuizPlayer';
import { ResultsView } from './components/ResultsView';
import { HistoryPage } from './pages/HistoryPage';
import { useQuiz } from './hooks/useQuiz';

const queryClient = new QueryClient();

type Tab = 'quiz' | 'history';

function QuizApp() {
  const [tab, setTab] = useState<Tab>('quiz');
  const { phase, quiz, result, answers, error, allAnswered, generate, selectAnswer, submit, reset } = useQuiz();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dbeafe_0,_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_48%,_#f9fafb_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center">
        <main className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-soft backdrop-blur xl:grid-cols-[0.9fr_1.1fr]">
          <aside className="hidden border-r border-slate-200/80 bg-slate-950 p-10 text-white xl:flex xl:flex-col xl:justify-between">
            <div>
              <div className="mb-10 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400 text-xl font-black text-slate-950">
                AI
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">Smart learning studio</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight">Build focused quizzes in seconds.</h1>
              <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
                Practice any topic with adaptive difficulty, instant scoring, and clean feedback for every answer.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {['Topic', 'Quiz', 'Review'].map(item => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4">
                  <div className="text-xs font-medium text-slate-300">{item}</div>
                </div>
              ))}
            </div>
          </aside>

          <section className="w-full px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">AI Quiz Builder</p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Practice with precision</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Enter any topic and get a personalized quiz powered by AI.
                </p>
              </div>
            </div>

            <div className="mb-7 inline-flex rounded-full border border-slate-200 bg-slate-100 p-1 shadow-sm">
              {(['quiz', 'history'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition-all ${
                    tab === t
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="min-h-[430px]">
              {tab === 'history' ? (
                <HistoryPage />
              ) : (
                <>
                  {(phase === 'idle' || phase === 'loading' || phase === 'error') && (
                    <>
                      <TopicForm onSubmit={generate} loading={phase === 'loading'} />
                      {error && (
                        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                          {error}
                        </p>
                      )}
                    </>
                  )}

                  {(phase === 'playing' || phase === 'submitting') && quiz && (
                    <QuizPlayer
                      questions={quiz.questions}
                      answers={answers}
                      onSelect={selectAnswer}
                      onSubmit={submit}
                      allAnswered={allAnswered}
                      submitting={phase === 'submitting'}
                    />
                  )}

                  {phase === 'results' && result && (
                    <ResultsView result={result} onRetry={reset} />
                  )}
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QuizApp />
    </QueryClientProvider>
  );
}
