/**
 * @fileoverview Hero – Sección principal de la landing UMAY
 * @param {{ onStartQuiz: () => void }} props
 */

import { useEffect, useRef } from 'react';
import { ArrowRight, Leaf } from 'lucide-react';

const STATS = [
  { value: '6',    label: 'Activos Andinos' },
  { value: '64+',  label: 'Combinaciones' },
  { value: '100%', label: 'Natural' },
];

export default function Hero({ onStartQuiz }) {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-4');
        }
      },
      { threshold: 0.1 }
    );
    const elements = heroRef.current?.querySelectorAll('[data-animate]');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="inicio"
      ref={heroRef}
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-cream"
    >
      {/* Fondo decorativo */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] opacity-[0.07]"
             style={{ background: 'radial-gradient(circle, #2C4A3E 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] opacity-[0.05]"
             style={{ background: 'radial-gradient(circle, #C5A880 0%, transparent 70%)' }} />
        {/* Hoja decorativa SVG */}
        <svg viewBox="0 0 300 600" fill="none"
             className="absolute right-0 top-1/2 -translate-y-1/2 w-64 md:w-96 opacity-[0.06]"
             aria-hidden="true">
          <path d="M150 20 C220 80, 280 200, 260 350 C240 500, 150 560, 150 580
                   C150 580, 60 500, 40 350 C20 200, 80 80, 150 20Z"
                fill="#2C4A3E" />
          <line x1="150" y1="20" x2="150" y2="580"
                stroke="#FAF8F5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">

          {/* Badge */}
          <div data-animate
               className="inline-flex items-center gap-2 px-3.5 py-1.5
                          bg-sage/10 border border-sage/20 rounded-pill mb-6
                          opacity-0 translate-y-4 transition-all duration-700">
            <Leaf size={12} className="text-sage" aria-hidden="true" />
            <span className="font-sans text-xs font-medium text-sage tracking-wider uppercase">
              Cosmética Botánica · Andes Peruanos
            </span>
          </div>

          {/* Título */}
          <h1 id="hero-heading" data-animate
              className="font-display text-hero font-semibold text-charcoal mb-5 leading-[1.05]
                         opacity-0 translate-y-4 transition-all duration-700 delay-100">
            Tu cabello,{' '}
            <span className="text-sage">fórmula única</span>
            {' '}de la naturaleza
          </h1>

          {/* Separador decorativo */}
          <div data-animate
               className="w-20 h-0.5 bg-gold mb-6
                          opacity-0 translate-y-4 transition-all duration-700 delay-200"
               aria-hidden="true" />

          {/* Descripción */}
          <p data-animate
             className="font-sans text-lg text-charcoal-soft leading-relaxed mb-8 max-w-xl
                        opacity-0 translate-y-4 transition-all duration-700 delay-300">
            Descubre la combinación exacta de{' '}
            <strong className="font-semibold text-charcoal">muña andina, sábila y arcillas peruanas</strong>
            {' '}que tu cabello necesita. Nuestro algoritmo botánico crea tu shampoo sólido
            personalizado en 60 segundos.
          </p>

          {/* CTAs */}
          <div data-animate
               className="flex flex-wrap items-center gap-4
                          opacity-0 translate-y-4 transition-all duration-700 delay-500">
            <button
              onClick={onStartQuiz}
              className="group flex items-center gap-2.5
                         px-8 py-4 bg-sage text-cream
                         font-sans text-base font-semibold
                         rounded-pill shadow-botanical
                         transition-all duration-300
                         hover:bg-sage-dark hover:scale-[1.02] hover:shadow-botanical-lg
                         active:scale-[0.98]
                         focus:outline-none focus-visible:ring-2
                         focus-visible:ring-sage focus-visible:ring-offset-2"
            >
              Crear mi fórmula botánica
              <ArrowRight size={18} aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => document.querySelector('#ingredientes')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2
                         px-6 py-4 text-charcoal-soft font-sans text-base font-medium
                         border border-charcoal/15 rounded-pill
                         transition-all duration-300
                         hover:border-sage hover:text-sage hover:bg-sage-50
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              Ver ingredientes
            </button>
          </div>

          {/* Stats */}
          <div data-animate
               className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-sage-100
                          opacity-0 translate-y-4 transition-all duration-700 delay-700">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-2xl font-semibold text-sage">{value}</p>
                <p className="font-sans text-xs text-charcoal-muted mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
