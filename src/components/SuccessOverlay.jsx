import { useEffect } from 'react'

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')

// Piezas de "confeti" decorativas
const CONFETTI = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i % 6) * 0.12}s`,
  duration: `${1.6 + (i % 5) * 0.25}s`,
  size: i % 3 === 0 ? 10 : 6,
  color: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? 'var(--color-accent)' : 'var(--color-accent-soft)',
}))

export default function SuccessOverlay({ name, o, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const timer = setTimeout(onClose, 9000)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(timer)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-5" role="alertdialog" aria-modal="true" aria-labelledby="success-title">
      <div className="animate-fade-in absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="animate-pop relative w-full max-w-sm overflow-hidden rounded-3xl border border-accent/50 bg-ink-2 p-8 text-center shadow-[0_0_80px_-10px_rgba(255,79,163,0.6)]">
        {/* Confeti */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className="animate-confetti absolute -top-4 rounded-sm"
              style={{
                left: c.left,
                width: c.size,
                height: c.size * 1.6,
                background: c.color,
                animationDelay: c.delay,
                animationDuration: c.duration,
              }}
            />
          ))}
        </div>
        <div className="pinstripes pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-accent/40 blur-3xl" />

        <div className="relative">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent shadow-lg shadow-accent/50">
            <svg viewBox="0 0 24 24" className="animate-draw h-10 w-10 text-ink" fill="none" stroke="currentColor" strokeWidth="3.5" aria-hidden="true">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
            </svg>
          </div>

          <p className="mt-6 font-display text-6xl uppercase leading-none text-accent italic">{o.successKicker}</p>
          <h2 id="success-title" className="mt-2 font-display text-2xl uppercase tracking-wide">
            {o.successTitle}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">{fill(o.successText, { name })}</p>

          <button
            onClick={onClose}
            className="mt-8 w-full rounded-full bg-accent px-6 py-4 text-sm font-extrabold uppercase tracking-wider text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-5px_rgba(255,79,163,0.7)] active:scale-95"
          >
            {o.successBtn} 💪
          </button>
        </div>
      </div>
    </div>
  )
}
