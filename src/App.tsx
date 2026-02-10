import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-100 via-cyan-50 to-emerald-100 px-6 py-16 text-slate-900">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-3xl border border-white/70 bg-white/80 p-8 shadow-xl backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
          React + Tailwind CSS v4
        </p>
        <h1 className="text-4xl font-black leading-tight sm:text-5xl">
          Tailwind уже подключен
        </h1>
        <p className="text-base text-slate-600">
          Измени классы в <code>src/App.tsx</code> и сразу увидишь результат.
        </p>
        <button
          type="button"
          onClick={() => setCount((value) => value + 1)}
          className="inline-flex w-fit items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:-translate-y-0.5 hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Кликнули: {count}
        </button>
        <div className="rounded-xl bg-slate-950 px-4 py-3 text-sm text-emerald-300">
          npm run dev
        </div>
      </div>
    </main>
  )
}

export default App
