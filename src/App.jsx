import { useCallback, useEffect, useState } from 'react'
import { translations } from './i18n'
import { BIZUM_PHONE, LINKS, PRICES } from './config'
import { SIZE_DATA } from './sizes'
import OrderModal from './components/OrderModal'
import SuccessOverlay from './components/SuccessOverlay'

const YEAR = new Date().getFullYear()

/* ---------- Iconos SVG inline ---------- */
const Arrow = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className} aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-4 w-4 shrink-0 text-accent" aria-hidden="true">
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ---------- Escudo (PNG negro sobre blanco → invertido para fondo oscuro) ---------- */
const Crest = ({ className = '' }) => (
  <img src="/img/escudo.png" alt="Escudo Jalaman FC" className={`invert mix-blend-screen ${className}`} />
)

/* ---------- Botón principal ---------- */
const CtaButton = ({ href, onClick, children, variant = 'primary', className = '' }) => {
  const base =
    'group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-4 text-sm font-extrabold uppercase tracking-wider transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink active:scale-95'
  const styles = {
    primary:
      'bg-accent text-ink shadow-[0_0_0_0_rgba(255,79,163,0.6)] hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-5px_rgba(255,79,163,0.7)]',
    ghost: 'border border-white/20 text-white hover:border-accent hover:text-accent',
  }
  const Tag = onClick ? 'button' : 'a'
  return (
    <Tag
      {...(onClick ? { type: 'button', onClick } : { href })}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {variant === 'primary' && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
      <span className="relative">{children}</span>
      <Arrow className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Tag>
  )
}

/* ---------- Header ---------- */
function Header({ lang, setLang, t }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/10 bg-ink/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6">
        <a href="#top" className="group flex items-center gap-3" aria-label="Jalaman FC">
          <Crest className="h-10 w-auto transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-110 sm:h-12" />
          <span className="font-display text-xl uppercase leading-none tracking-wide sm:text-2xl">
            Jalaman <span className="text-accent">FC</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/70 md:flex">
          <a href="#tienda" className="transition-colors hover:text-accent">{t.nav.shop}</a>
          <a href="#info" className="transition-colors hover:text-accent">{t.nav.info}</a>
        </nav>

        {/* Selector de idioma */}
        <div
          role="group"
          aria-label="Idioma / Hizkuntza"
          className="relative flex rounded-full border border-white/15 bg-white/5 p-1 text-xs font-extrabold"
        >
          <span
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-accent transition-transform duration-300 ease-out ${
              lang === 'eu' ? 'translate-x-full' : 'translate-x-0'
            }`}
            aria-hidden="true"
          />
          {['es', 'eu'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`relative z-10 w-11 rounded-full py-1.5 uppercase transition-colors duration-300 ${
                lang === l ? 'text-ink' : 'text-white/60 hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

/* ---------- Hero ---------- */
function Hero({ t, onOrder }) {
  return (
    <section id="top" className="pinstripes relative overflow-hidden pt-24 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
      {/* Glow de fondo */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent/25 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {t.hero.badge}
          </span>

          <h1 className="mt-6 font-display text-[3.4rem] uppercase leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
            <span className="block">{t.hero.titleA}</span>
            <span className="block text-accent">{t.hero.titleB}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/70 sm:text-lg lg:mx-0">
            {t.hero.text}
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <CtaButton onClick={() => onOrder('kit')}>{t.hero.cta}</CtaButton>
            <CtaButton href="#info" variant="ghost">{t.nav.info}</CtaButton>
          </div>

          <dl className="mx-auto mt-10 grid max-w-sm grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-4 lg:mx-0">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-widest text-white/50">{t.hero.stat1}</dt>
              <dd className="font-display text-2xl text-white">{PRICES.shirt}€</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-widest text-white/50">{t.hero.stat2}</dt>
              <dd className="font-display text-2xl text-white">{PRICES.kit}€</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-widest text-white/50">JLMN</dt>
              <dd className="font-display text-2xl text-accent">26/27</dd>
            </div>
          </dl>
        </div>

        {/* Imagen hero */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
          <div className="absolute -inset-3 rotate-3 rounded-[2rem] border-2 border-accent/60" />
          <div className="animate-float relative overflow-hidden rounded-[2rem] shadow-2xl shadow-accent/20">
            <img
              src="/img/equipacion.jpg"
              alt="Nueva equipación Jalaman FC: camiseta rosa y pantalón negro"
              className="aspect-[3/4] w-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5">
              <p className="font-display text-3xl uppercase leading-none">Infernu</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t.hero.stat3}</p>
            </div>
          </div>
          <Crest className="absolute -top-6 -right-4 h-20 w-auto drop-shadow-2xl sm:h-24" />
        </div>
      </div>
    </section>
  )
}

/* ---------- Marquee ---------- */
function Marquee({ items }) {
  const row = [...items, ...items]
  return (
    <div className="relative -rotate-1 overflow-hidden border-y-2 border-ink bg-accent py-3 text-ink">
      <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-2xl uppercase tracking-wide">
            {w} <span aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------- Tarjeta de producto ---------- */
function ProductCard({ product, price, onBuy, images, buyLabel, badge, toggleLabels }) {
  const [imgIdx, setImgIdx] = useState(0)
  const hasToggle = images.length > 1

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-ink-2 transition-all duration-500 hover:-translate-y-1 ${
        badge ? 'border-accent/60 shadow-[0_0_60px_-20px_rgba(255,79,163,0.6)]' : 'border-white/10 hover:border-white/25'
      }`}
    >
      {badge && (
        <span className="absolute top-4 left-4 z-10 rounded-full bg-accent px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-ink">
          {badge}
        </span>
      )}

      {/* Espacio para imagen */}
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-3">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
              i === imgIdx ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent" />
        {hasToggle && (
          <button
            onClick={() => setImgIdx((i) => (i + 1) % images.length)}
            className="absolute right-4 bottom-4 rounded-full border border-white/20 bg-ink/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur transition-all hover:border-accent hover:text-accent"
          >
            ↻ {imgIdx === 0 ? toggleLabels[0] : toggleLabels[1]}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-3xl uppercase leading-none tracking-wide">{product.name}</h3>
            <p className="mt-2 text-sm font-medium text-white/50">{product.sub}</p>
          </div>
          <p className="font-display text-5xl leading-none text-accent">
            {price}
            <span className="text-2xl">€</span>
          </p>
        </div>

        <ul className="mt-6 space-y-2.5 text-sm text-white/75">
          {product.features.map((f) => (
            <li key={f} className="flex items-center gap-3">
              <Check /> {f}
            </li>
          ))}
        </ul>

        <CtaButton onClick={onBuy} className="mt-8 w-full">
          {buyLabel} · {price}€
        </CtaButton>
      </div>
    </article>
  )
}

/* ---------- Tienda ---------- */
function Shop({ t, onOrder }) {
  return (
    <section id="tienda" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t.shop.eyebrow}</p>
          <h2 className="mt-3 font-display text-5xl uppercase leading-none sm:text-6xl">{t.shop.title}</h2>
          <p className="mt-4 text-white/60">{t.shop.text}</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2 md:gap-8">
          <ProductCard
            product={t.shop.shirt}
            price={PRICES.shirt}
            onBuy={() => onOrder('shirt')}
            images={['/img/camiseta-frente.jpg', '/img/camiseta-espalda.jpg']}
            buyLabel={t.shop.buy}
            toggleLabels={[t.shop.viewBack, t.shop.viewFront]}
          />
          <ProductCard
            product={t.shop.kit}
            price={PRICES.kit}
            onBuy={() => onOrder('kit')}
            images={['/img/equipacion.jpg']}
            buyLabel={t.shop.buy}
            badge={t.shop.popular}
          />
        </div>
      </div>
    </section>
  )
}

/* ---------- Tallas y Bizum ---------- */
function Info({ t }) {
  return (
    <section id="info" className="scroll-mt-20 pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pinstripes relative overflow-hidden rounded-3xl border border-white/10 bg-ink-2 p-6 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-accent/20 blur-[100px]" />
          <span className="text-outline pointer-events-none absolute -top-4 right-4 hidden font-display text-[10rem] leading-none opacity-30 lg:block">
            00
          </span>

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t.info.eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl uppercase leading-none sm:text-5xl">{t.info.title}</h2>

            <ol className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
              {t.info.steps.map((s, i) => (
                <li
                  key={s.title}
                  className="group rounded-2xl border border-white/10 bg-ink/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent font-display text-2xl text-ink transition-transform duration-300 group-hover:rotate-[-8deg]">
                    0{i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{s.text.replace('{phone}', BIZUM_PHONE)}</p>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-accent/40 bg-accent/10 p-5 sm:flex-row sm:items-center sm:gap-5">
              <span className="inline-flex w-fit items-center rounded-lg bg-[#05C3C9] px-3 py-1.5 text-sm font-extrabold tracking-tight text-white">
                bizum
              </span>
              <p className="text-sm leading-relaxed text-white/80">
                <strong className="text-accent">{t.info.noteTitle}:</strong> {t.info.note}
              </p>
            </div>

            <SizeGuide t={t.sizes} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Guía de tallas (medidas en cm, prenda en plano) ---------- */
function SizeTable({ title, rows, t }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink/60">
      {title && (
        <p className="border-b border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          {title}
        </p>
      )}
      <table className="w-full text-center text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-widest text-white/50">
            <th className="px-4 py-3 text-left font-semibold">{t.size}</th>
            <th className="px-4 py-3 font-semibold">{t.length}</th>
            <th className="px-4 py-3 font-semibold">{t.width}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([size, length, width]) => (
            <tr key={size} className="border-t border-white/5 transition-colors hover:bg-accent/10">
              <td className="px-4 py-2.5 text-left font-display text-lg tracking-wide text-white">{size}</td>
              <td className="px-4 py-2.5 tabular-nums text-white/80">{length}</td>
              <td className="px-4 py-2.5 tabular-nums text-white/80">{width}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SizeGuide({ t }) {
  const [tab, setTab] = useState('shirt')
  const tables = SIZE_DATA[tab]

  return (
    <div className="mt-12 border-t border-white/10 pt-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{t.eyebrow}</p>
          <h3 className="mt-2 font-display text-3xl uppercase leading-none sm:text-4xl">{t.title}</h3>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60">{t.text}</p>
        </div>

        {/* Pestañas Camiseta / Pantalón */}
        <div role="tablist" className="flex w-full rounded-full border border-white/15 bg-white/5 p-1 md:w-auto">
          {['shirt', 'shorts'].map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`flex-1 rounded-full px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 md:flex-none ${
                tab === key ? 'bg-accent text-ink shadow-lg shadow-accent/30' : 'text-white/60 hover:text-white'
              }`}
            >
              {t[key]}
            </button>
          ))}
        </div>
      </div>

      <div className={`mt-8 grid gap-4 md:gap-6 ${tables.length > 1 ? 'md:grid-cols-2' : 'mx-auto max-w-md'}`}>
        {tables.map((table) => (
          <SizeTable
            key={tab + table.group}
            title={tab === 'shirt' ? t[table.group] : null}
            rows={table.rows}
            t={t}
          />
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-white/40">{t.tolerance}</p>
    </div>
  )
}

/* ---------- Footer ---------- */
function Footer({ t }) {
  const igHandle = '@' + LINKS.instagram.replace(/\/$/, '').split('/').pop()
  return (
    <footer className="border-t border-white/10 bg-ink-2">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-12 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
        <div className="flex flex-col items-center gap-3 md:flex-row md:gap-4">
          <Crest className="h-14 w-auto" />
          <div>
            <p className="font-display text-2xl uppercase">
              Jalaman <span className="text-accent">FC</span>
            </p>
            <p className="text-sm text-white/50">{t.footer.tagline}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-ink"
          >
            <InstagramIcon /> {igHandle}
          </a>
          <a
            href={`mailto:${LINKS.email}`}
            className="group flex items-center justify-center gap-3 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-ink"
          >
            <MailIcon /> {LINKS.email}
          </a>
        </div>
      </div>
      <p className="border-t border-white/5 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-center text-xs text-white/40">
        © {YEAR} Jalaman FC · 31001 · {t.footer.rights}
      </p>
    </footer>
  )
}

/* ---------- App ---------- */
export default function App() {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'es'
    return localStorage.getItem('jlmn-lang') || 'es'
  })
  const t = translations[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem('jlmn-lang', lang)
    document.title = `Jalaman FC · ${t.hero.titleA} ${t.hero.titleB}`
  }, [lang, t])

  // Estado del modal de pedido y del mensaje de éxito
  const [orderProduct, setOrderProduct] = useState(null) // null = cerrado | 'shirt' | 'kit'
  const [successName, setSuccessName] = useState(null)
  const openOrder = useCallback((product) => setOrderProduct(product), [])
  const closeOrder = useCallback(() => setOrderProduct(null), [])
  const handleSuccess = useCallback((name) => {
    setOrderProduct(null)
    setSuccessName(name || '')
  }, [])
  const closeSuccess = useCallback(() => setSuccessName(null), [])

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header lang={lang} setLang={setLang} t={t} />
      <main>
        <Hero t={t} onOrder={openOrder} />
        <Marquee items={t.marquee} />
        <Shop t={t} onOrder={openOrder} />
        <Info t={t} />
      </main>
      <Footer t={t} />

      {/* Botón flotante móvil */}
      <button
        type="button"
        onClick={() => openOrder('kit')}
        className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-ink shadow-lg shadow-accent/40 transition-transform active:scale-95 md:hidden"
      >
        {t.nav.order} <Arrow className="h-4 w-4" />
      </button>

      {orderProduct && (
        <OrderModal
          key={orderProduct}
          initialProduct={orderProduct}
          lang={lang}
          onClose={closeOrder}
          onSuccess={handleSuccess}
        />
      )}
      {successName !== null && <SuccessOverlay name={successName} o={t.order} onClose={closeSuccess} />}
    </div>
  )
}
