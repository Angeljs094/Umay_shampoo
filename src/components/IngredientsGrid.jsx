/**
 * @fileoverview IngredientsGrid – Vitrina de ingredientes botánicos con flip cards
 */

import { useState, useEffect, useRef } from 'react';
import { INGREDIENTS_CATALOG } from '@/types/quiz.js';

function IngredientCard({ ingredient }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative h-64 cursor-pointer group"
      onClick={() => setIsFlipped((v) => !v)}
      onKeyDown={(e) => e.key === 'Enter' && setIsFlipped((v) => !v)}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalles de ${ingredient.name}`}
      aria-pressed={isFlipped}
      style={{ perspective: '1000px' }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle:  'preserve-3d',
          transform:       isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRENTE */}
        <div
          className="absolute inset-0 rounded-botanical border border-sage-50
                     shadow-card hover:shadow-card-hover transition-shadow duration-300
                     flex flex-col items-center justify-center gap-3 p-6"
          style={{ backfaceVisibility: 'hidden', background: ingredient.bgColor }}
        >
          <span className="text-5xl" aria-hidden="true">{ingredient.icon}</span>
          <div className="text-center">
            <h3 className="font-display text-base font-semibold text-charcoal mb-0.5">
              {ingredient.name}
            </h3>
            <p className="font-sans text-xs italic text-charcoal-muted">{ingredient.latin}</p>
          </div>
          <div
            className="w-8 h-1 rounded-full mt-1"
            style={{ background: ingredient.color }}
            aria-hidden="true"
          />
          <p className="font-sans text-[10px] text-charcoal-muted text-center">
            📍 {ingredient.origin.split('—')[0].trim()}
          </p>
          <p className="font-sans text-[10px] text-charcoal-muted/60 mt-auto">
            Toca para ver más →
          </p>
        </div>

        {/* REVERSO */}
        <div
          className="absolute inset-0 rounded-botanical p-5 flex flex-col justify-between
                     border shadow-card"
          style={{
            backfaceVisibility: 'hidden',
            transform:          'rotateY(180deg)',
            background:         ingredient.color,
          }}
        >
          <div>
            <p className="font-display text-sm font-semibold text-white mb-2">
              {ingredient.icon} {ingredient.name}
            </p>
            <p className="font-sans text-xs text-white/80 leading-relaxed mb-3">
              {ingredient.description.slice(0, 120)}...
            </p>
          </div>
          <ul className="space-y-1">
            {ingredient.benefits.slice(0, 3).map((benefit) => (
              <li key={benefit} className="flex items-start gap-1.5">
                <span className="text-white/60 text-xs mt-0.5 flex-shrink-0" aria-hidden="true">✓</span>
                <span className="font-sans text-[11px] text-white/85 leading-snug">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function IngredientsGrid() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const ingredients = Object.values(INGREDIENTS_CATALOG);

  return (
    <section id="ingredientes" ref={sectionRef} aria-labelledby="ingredients-heading"
             className="py-24 sm:py-32 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div className={`text-center max-w-2xl mx-auto mb-14 transition-all duration-700
                         ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5
                           bg-sage/10 border border-sage/15 rounded-pill mb-5">
            <span className="text-sage text-xs" aria-hidden="true">🌿</span>
            <span className="font-sans text-xs font-medium text-sage tracking-wider uppercase">
              Botánica Andina
            </span>
          </div>
          <h2 id="ingredients-heading"
              className="font-display text-hero-sm font-semibold text-charcoal mb-4">
            Los activos que transforman <span className="text-sage">tu cabello</span>
          </h2>
          <p className="font-sans text-base text-charcoal-soft leading-relaxed">
            6 ingredientes seleccionados por su eficacia científica comprobada y su origen
            en los ecosistemas del Perú. Toca cada carta para conocer sus beneficios.
          </p>
        </div>

        {/* Grid de ingredientes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {ingredients.map((ingredient, index) => (
            <div
              key={ingredient.id}
              className={`transition-all duration-700
                          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <IngredientCard ingredient={ingredient} />
            </div>
          ))}
        </div>

        {/* Badge científico */}
        <div className={`text-center mt-12 transition-all duration-700 delay-500
                         ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center gap-3 px-5 py-3
                           bg-white border border-sage-100 rounded-botanical shadow-card">
            <span className="text-lg" aria-hidden="true">🧬</span>
            <div className="text-left">
              <p className="font-sans text-xs font-semibold text-charcoal">Algoritmo Botánico UMAY</p>
              <p className="font-sans text-xs text-charcoal-muted">
                Scoring matricial con 64+ combinaciones únicas personalizadas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
