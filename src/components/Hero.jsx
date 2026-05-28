/**
 * @fileoverview Hero – Sección principal de bienvenida UMAY
 *
 * Características:
 * - Propuesta de valor potente sobre personalización botánica andina
 * - Fondo SVG con motivos botánicos animados
 * - CTA principal (iniciar quiz) y secundario (ver ingredientes)
 * - Animaciones de entrada escalonadas (fade-in-up)
 * - Badge de credibilidad con estadísticas simuladas
 * - Totalmente responsive (mobile-first)
 *
 * @param {{ onStartQuiz: () => void }} props
 */

import { ArrowRight, Leaf, Award, Users, FlaskConical } from 'lucide-react';

const STATS = [
  { icon: Leaf, value: '6', label: 'Activos Botánicos' },
  { icon: FlaskConical, value: '48+', label: 'Fórmulas Posibles' },
  { icon: Users, value: '100%', label: 'Personalizado' },
  { icon: Award, value: 'Eco', label: 'Certificado' },
];

export default function Hero({ onStartQuiz }) {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex items-center overflow-hidden bg-cream"
    >
      {/* ── FONDO BOTÁNICO SVG DECORATIVO ────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {/* Gradiente radial sage en la esquina superior derecha */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px]
                        bg-sage/5 rounded-full blur-3xl" />
        {/* Gradiente gold en la esquina inferior izquierda */}
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px]
                        bg-gold/10 rounded-full blur-3xl" />

        {/* SVG de hojas botánicas decorativas */}
        <svg
          className="absolute top-0 right-0 w-1/2 h-full opacity-[0.04]"
          viewBox="0 0 600 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hoja grande */}
          <path
            d="M300 50 C400 100, 500 300, 300 500 C100 300, 200 100, 300 50Z"
            fill="#2C4A3E"
          />
          {/* Nervadura central */}
          <line x1="300" y1="50" x2="300" y2="500" stroke="#2C4A3E" strokeWidth="4" />
          {/* Nervaduras secundarias */}
          {[120, 180, 240, 300, 360, 420].map((y, i) => (
            <line
              key={i}
              x1="300" y1={y}
              x2={i % 2 === 0 ? '220' : '380'} y2={y + 30}
              stroke="#2C4A3E" strokeWidth="2"
            />
          ))}
          {/* Círculo decorativo */}
          <circle cx="480" cy="650" r="80" stroke="#C5A880" strokeWidth="2" fill="none" />
          <circle cx="480" cy="650" r="50" stroke="#C5A880" strokeWidth="1" fill="none" />
          {/* Pequeñas hojas dispersas */}
          <ellipse cx="150" cy="700" rx="30" ry="50" fill="#2C4A3E" transform="rotate(-30 150 700)" />
          <ellipse cx="500" cy="100" rx="20" ry="35" fill="#C5A880" transform="rotate(45 500 100)" />
        </svg>

        {/* Puntos decorativos dispersos */}
        {[
          { x: '10%', y: '20%', size: 6, color: 'bg-gold/30' },
          { x: '85%', y: '35%', size: 4, color: 'bg-sage/20' },
          { x: '5%', y: '75%', size: 8, color: 'bg-sage/15' },
          { x: '90%', y: '80%', size: 5, color: 'bg-gold/25' },
        ].map((dot, i) => (
          <div
            key={i}
            aria-hidden="true"
            className={`absolute rounded-full ${dot.color}`}
            style={{
              left: dot.x,
              top: dot.y,
              width: dot.size * 4,
              height: dot.size * 4,
            }}
          />
        ))}
      </div>

      {/* ── CONTENIDO PRINCIPAL ───────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                      pt-28 pb-20 sm:pt-32 sm:pb-24 w-full">
        <div className="max-w-3xl">

          {/* Badge de marca */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5
                        bg-sage/10 border border-sage/20 rounded-pill
                        mb-6 animate-fade-in"
          >
            <Leaf size={12} className="text-sage" aria-hidden="true" />
            <span className="font-sans text-xs font-medium text-sage tracking-wider uppercase">
              Cosmética Botánica · Andes Peruanos
            </span>
          </div>

          {/* Titular principal */}
          <h1
            id="hero-heading"
            className="font-display text-hero font-semibold text-charcoal
                       leading-[1.08] tracking-[-0.02em] mb-6
                       opacity-0 animate-fade-in-up"
          >
            Tu cabello,{' '}
            <span className="text-sage">fórmula</span>
            <br />
            única de la{' '}
            <span className="relative">
              naturaleza
              {/* Subrayado decorativo gold */}
              <svg
                aria-hidden="true"
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 280 8"
                fill="none"
              >
                <path
                  d="M2 6 C60 2, 140 2, 278 5"
                  stroke="#C5A880"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subtítulo */}
          <p
            className="font-sans text-lg sm:text-xl text-charcoal-soft leading-relaxed
                       max-w-xl mb-10 opacity-0 animate-fade-in-up-delay"
          >
            Descubre la combinación exacta de{' '}
            <strong className="font-semibold text-charcoal">
              muña andina, sábila y arcillas peruanas
            </strong>{' '}
            que tu cabello necesita. Nuestro algoritmo botánico crea tu shampoo
            sólido personalizado en 60 segundos.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-3 mb-16
                        opacity-0 animate-fade-in-up-delay-2"
          >
            <button
              onClick={onStartQuiz}
              className="group inline-flex items-center justify-center gap-2.5
                         px-7 py-4 bg-sage text-cream
                         font-sans text-base font-semibold
                         rounded-pill shadow-botanical
                         transition-all duration-300
                         hover:bg-sage-dark hover:scale-[1.02] hover:shadow-botanical-lg
                         active:scale-[0.98]
                         focus:outline-none focus-visible:ring-2
                         focus-visible:ring-sage focus-visible:ring-offset-2"
            >
              Crear mi fórmula botánica
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <a
              href="#ingredientes"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#ingredientes')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2
                         px-7 py-4 bg-transparent text-charcoal
                         font-sans text-base font-medium
                         rounded-pill border border-charcoal/15
                         transition-all duration-300
                         hover:border-sage hover:text-sage hover:bg-sage-50
                         focus:outline-none focus-visible:ring-2
                         focus-visible:ring-sage focus-visible:ring-offset-2"
            >
              Ver ingredientes
            </a>
          </div>

          {/* ── ESTADÍSTICAS ────────────────────────────────────────── */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4
                        opacity-0 animate-fade-in-up-delay-2"
          >
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center sm:items-start gap-1
                           p-4 bg-white/60 backdrop-blur-xs
                           rounded-card border border-sage-50
                           shadow-card"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-sage/10 flex items-center justify-center">
                    <Icon size={14} className="text-sage" aria-hidden="true" />
                  </div>
                  <span className="font-display text-xl font-semibold text-charcoal">
                    {value}
                  </span>
                </div>
                <span className="font-sans text-xs text-charcoal-muted text-center sm:text-left">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── INDICADOR DE SCROLL ───────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2
                   flex flex-col items-center gap-1 animate-float"
      >
        <span className="font-sans text-xs text-charcoal-muted tracking-wider">
          Descubre más
        </span>
        <div className="w-5 h-8 rounded-pill border-2 border-charcoal/20
                        flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-charcoal/40 rounded-pill" />
        </div>
      </div>
    </section>
  );
}
