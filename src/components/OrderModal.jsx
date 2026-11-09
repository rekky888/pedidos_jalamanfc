import { useEffect, useRef, useState } from 'react'
import { translations } from '../i18n'
import { APPS_SCRIPT_URL, BIZUM_PHONE, PRICES, SHIRT_SIZES } from '../config'
import { findSize } from '../sizes'

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')

const inputBase =
  'w-full rounded-xl border border-white/10 bg-ink px-4 py-3.5 text-base text-white placeholder:text-white/30 transition-colors duration-200 hover:border-white/25 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30'

function Field({ label, optional, htmlFor, children, hint }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 flex flex-wrap items-baseline gap-x-2 text-xs font-bold uppercase tracking-wider text-white/70">
        <span>{label}</span>
        {optional && <span className="text-[11px] font-medium normal-case tracking-normal text-white/35">({optional})</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-white/45">{hint}</p>}
    </div>
  )
}

function SizeSelect({ id, value, onChange, sizes, placeholder, isKit, t }) {
  const mShirt = value ? findSize('shirt', value) : null
  const mShorts = value && isKit ? findSize('shorts', value) : null
  return (
    <>
      <div className="relative">
        <select
          id={id}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputBase} cursor-pointer appearance-none pr-10 ${value ? '' : 'text-white/40'}`}
        >
          <option value="" disabled>{placeholder}</option>
          {sizes.map((s) => (
            <option key={s} value={s} className="text-white">{s}</option>
          ))}
        </select>
        <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-accent" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {mShirt && (
        <p className="mt-1.5 text-xs text-white/45">
          {isKit ? `${t.shirt}: ` : ''}{t.length} {mShirt.length} cm · {t.width} {mShirt.width} cm
          {mShorts ? `  |  ${t.shorts}: ${t.length} ${mShorts.length} cm · ${t.width} ${mShorts.width} cm` : ''}
        </p>
      )}
    </>
  )
}

export default function OrderModal({ initialProduct = 'kit', lang, onClose, onSuccess }) {
  const t = translations[lang]
  const o = t.order
  const [form, setForm] = useState({
    name: '',
    phone: '',
    product: initialProduct,
    shirtSize: '',
    shortsSize: '',
    number: '',
    backName: '',
    bizum: false,
  })
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [phoneError, setPhoneError] = useState(false)
  const firstInput = useRef(null)
  const loading = status === 'loading'
  const loadingRef = useRef(false)
  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))
  const isKit = form.product === 'kit'
  const price = PRICES[form.product]

  // Bloquear scroll, foco inicial y cerrar con Escape
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = setTimeout(() => firstInput.current?.focus(), 250)
    const onKey = (e) => e.key === 'Escape' && !loadingRef.current && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    if (form.phone.replace(/\D/g, '').length < 9) {
      setPhoneError(true)
      return
    }

    const payload = {
      fecha: new Date().toISOString(),
      nombre: form.name.trim(),
      telefono: form.phone.trim(),
      producto: translations.es.shop[form.product].name, // siempre en castellano para la hoja
      productoId: form.product,
      precio: price,
      talla: form.shirtSize,
      tallaCamiseta: form.shirtSize,
      tallaPantalon: isKit ? form.shirtSize : '',
      dorsal: form.number,
      nombreEspalda: form.backName.trim().toUpperCase(),
      bizumConfirmado: form.bizum ? 'SÍ' : 'NO',
      idioma: lang,
    }

    setStatus('loading')
    try {
      if (!APPS_SCRIPT_URL) {
        // Modo prueba: sin URL configurada se simula el envío
        console.warn('[Jalaman FC] APPS_SCRIPT_URL vacío: envío simulado', payload)
        await new Promise((r) => setTimeout(r, 1200))
      } else {
        // text/plain evita el preflight CORS que Apps Script no soporta
        const res = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        let data = null
        try {
          data = await res.json()
        } catch {
          /* respuesta no JSON: se da por buena */
        }
        if (data && data.result === 'error') throw new Error(data.message || 'Apps Script error')
      }
      onSuccess(payload.nombre.split(' ')[0])
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="order-title">
      {/* Fondo */}
      <div className="animate-fade-in absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => !loading && onClose()} />

      {/* Panel: bottom-sheet en móvil, centrado en escritorio */}
      <div className="animate-sheet-up relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-ink-2 shadow-2xl shadow-accent/10 sm:max-w-lg sm:rounded-3xl">
        {/* Cabecera */}
        <div className="pinstripes relative shrink-0 border-b border-white/10 px-5 pt-3 pb-5 sm:px-7 sm:pt-6">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />
          <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-accent/25 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <h2 id="order-title" className="font-display text-3xl uppercase leading-none sm:text-4xl">
                {o.title}
              </h2>
              <p className="mt-2 text-sm text-white/55">{o.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label={o.close}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:rotate-90 hover:border-accent hover:text-accent disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
            <fieldset disabled={loading} className="min-w-0 space-y-4">
              {/* Producto */}
            <div>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-white/70">{o.product}</p>
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={o.product}>
                {['shirt', 'kit'].map((p) => {
                  const active = form.product === p
                  return (
                    <label
                      key={p}
                      className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 ${
                        active ? 'border-accent bg-accent/10' : 'border-white/10 bg-ink hover:border-white/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="product"
                        value={p}
                        checked={active}
                        onChange={() => set('product')(p)}
                        className="sr-only"
                      />
                      <span
                        className={`absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                          active ? 'border-accent bg-accent' : 'border-white/30'
                        }`}
                      >
                        {active && <span className="h-2 w-2 rounded-full bg-ink" />}
                      </span>
                      <span className="block pr-6 text-sm font-bold leading-tight">{t.shop[p].name}</span>
                      <span className="mt-1 block text-[11px] text-white/45">{t.shop[p].sub}</span>
                      <span className={`mt-3 block font-display text-3xl leading-none ${active ? 'text-accent' : 'text-white'}`}>
                        {PRICES[p]}€
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            <Field label={o.name} htmlFor="f-name">
              <input
                ref={firstInput}
                id="f-name"
                type="text"
                required
                autoComplete="name"
                placeholder={o.namePh}
                value={form.name}
                onChange={(e) => set('name')(e.target.value)}
                className={inputBase}
              />
            </Field>

            <Field label={o.phone} htmlFor="f-phone">
              <input
                id="f-phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder={o.phonePh}
                value={form.phone}
                onChange={(e) => {
                  setPhoneError(false)
                  set('phone')(e.target.value)
                }}
                aria-invalid={phoneError}
                className={`${inputBase} ${phoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
              />
              {phoneError && <p className="mt-1.5 text-xs font-semibold text-red-400">{o.invalidPhone}</p>}
            </Field>

            <Field label={o.size} htmlFor="f-size">
              <SizeSelect id="f-size" isKit={isKit} value={form.shirtSize} onChange={set('shirtSize')} sizes={SHIRT_SIZES} placeholder={o.choose} t={t.sizes} />
            </Field>

            <div className="grid grid-cols-[1fr_2fr] gap-4">
              <Field label={o.number} optional={o.optional} htmlFor="f-number">
                <input
                  id="f-number"
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  placeholder={o.numberPh}
                  value={form.number}
                  onChange={(e) => set('number')(e.target.value.replace(/\D/g, ''))}
                  className={`${inputBase} text-center font-display text-xl`}
                />
              </Field>
              <Field label={o.backName} optional={o.optional} htmlFor="f-backname">
                <input
                  id="f-backname"
                  type="text"
                  maxLength={14}
                  placeholder={o.backNamePh}
                  value={form.backName}
                  onChange={(e) => set('backName')(e.target.value.toUpperCase())}
                  className={`${inputBase} font-display text-xl uppercase tracking-wider`}
                />
              </Field>
            </div>

            {/* Bizum */}
            <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4">
              <div className="flex items-start gap-3">
                <span className="shrink-0 rounded-md bg-[#05C3C9] px-2 py-1 text-xs font-extrabold text-white">bizum</span>
                <p className="text-sm leading-snug text-white/85">
                  {fill(o.bizumInfo, { price, phone: BIZUM_PHONE })}
                </p>
              </div>
              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-ink/60 p-3 transition-colors hover:border-accent/60">
                <input
                  type="checkbox"
                  required
                  checked={form.bizum}
                  onChange={(e) => set('bizum')(e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-accent ${
                    form.bizum ? 'scale-110 border-accent bg-accent' : 'border-white/30'
                  }`}
                  aria-hidden="true"
                >
                  {form.bizum && (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink" fill="none" stroke="currentColor" strokeWidth="4">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-sm font-semibold leading-snug">
                  {o.bizumConfirm} <span className="text-accent">*</span>
                </span>
              </label>
            </div>

            {status === 'error' && (
              <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm font-medium text-red-300">
                {o.error}
              </p>
            )}
            </fieldset>
          </div>

          {/* Pie con total y botón */}
          <div className="shrink-0 border-t border-white/10 bg-ink-2 px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-7 sm:pb-5">
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-full bg-accent py-2 pr-2 pl-6 text-ink transition-all duration-300 hover:shadow-[0_10px_40px_-5px_rgba(255,79,163,0.7)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-90"
            >
              {!loading && (
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              )}
              <span className="relative flex items-center gap-3 text-sm font-extrabold uppercase tracking-wider">
                {loading && (
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                )}
                {loading ? o.loading : o.submit}
              </span>
              <span className="relative rounded-full bg-ink px-4 py-2.5 font-display text-xl leading-none text-accent">
                {price}€
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
