/**
 * @fileoverview IngredientsGrid – Vitrina interactiva de ingredientes UMAY
 *
 * Características:
 * - Tarjetas con hover-zoom y efecto de revelado de información
 * - Iconografía botánica con SVG decorativo
 * - Detalle científico de cada ingrediente andino
 * - Animación de entrada con Intersection Observer
 * - Grid responsive: 1 col mobile → 2 col tablet → 3 col desktop
 *
 * @module components/IngredientsGrid
 */

import { useState, useEffect, useRef } from 'react';
import { Leaf, MapPin, Sparkles } from 'lucide-react';
import { INGREDIENTS_CATALOG } from '@/types/quiz.js';

// Orden de presentación en la vitrina (los más icónicos primero)
const FEATURED_ORDER = ['muna', 'sabila', 'arcillaVerde', 'romero', 'karite', 'aceiteCocos'];

/**
 * Tarjeta individual de ingrediente.
 *
 * @param {{ ingredient: import('@/types/quiz.js').Ingredient, isVisible: boolean, delay: number }} props
 */
function IngredientCard({ ingredient, isVisible, delay }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <article
      aria-label={`Ingrediente: ${ingredient.name}`}
      style={{ transitionDelay: `${delay}ms` }}
      className={`group relative rounded-botanical overflow-hidden
                  bg-white border border-sage-50 shadow-card
                  transition-all duration-500
                  hover:shadow-card-hover hover:-translate-y-1
                  cursor-pointer
                  ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                  }`}
      onClick={() => setIsFlipped((v) => !v)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsFlipped((v) => !v); }}
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
    >
      {/* ── FRENTE DE LA TARJETA ────────────────────────────────── */}
      <div
        className={`transition-all duration-500
                    ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        {/* Área visual del ingrediente */}
        <div
          className="relative h-52 flex items-center justify-center overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${ingredient.bgColor} 0%, ${ingredient.bgColor}88 100%)` }}
        >
          {/* Emoji principal con zoom en hover */}
          <span
            aria-hidden="true"
            className="text-7xl transition-transform duration-500
                       group-hover:scale-110 select-none filter drop-shadow-sm"
          >
            {ingredient.icon}
          </span>

          {/* Badge de origen */}
          <div
            className="absolute bottom-3 left-3
                        flex items-center gap-1.5 px-2.5 py-1
                        bg-white/80 backdrop-blur-xs rounded-pill
                        shadow-card"
          >
            <MapPin size={10} className="text-sage flex-shrink-0" aria-hidden="true" />
            <span className="font-sans text-[10px] text-charcoal-soft font-medium truncate max-w-[120px]">
              {ingredient.origin.split('(')[0].trim()}
            </span>
          </div>

          {/* Badge "Tap para saber más" */}
          <div
            aria-hidden="true"
            className="absolute top-3 right-3 px-2 py-1
                       bg-sage/90 text-cream rounded-pill
                       font-sans text-[9px] font-medium tracking-wide
                       opacity-0 group-hover:opacity-100
                       transition-opacity duration-300"
          >
            Ver detalle →
          </div>

          {/* SVG decorativo de hoja en la esquina */}
          <svg
            aria-hidden="true"
            className="absolute -top-4 -right-4 w-20 h-20 opacity-10"
            viewBox="0 0 80 80"
            fill={ingredient.color}
          >
            <path d="M40 5 C65 10, 75 40, 40 75 C5 40, 15 10, 40 5Z" />
            <line x1="40" y1="5" x2="40" y2="75" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        {/* Contenido textual del frente */}
        <div className="p-5">
          {/* Nombre científico */}
          <p className="font-sans text-[10px] italic text-charcoal-muted mb-1 tracking-wide">
            {ingredient.latin}
          </p>
          {/* Nombre del ingrediente */}
          <h3 className="font-display text-lg font-semibold text-charcoal mb-3 leading-snug">
            {ingredient.name}
          </h3>
          {/* Beneficios como chips */}
          <ul
            aria-label={`Beneficios de ${ingredient.name}`}
            className="flex flex-wrap gap-1.5"
          >
            {ingredient.benefits.slice(0, 2).map((benefit) => (
              <li
                key={benefit}
                className="inline-flex items-center gap-1 px-2 py-0.5
                           rounded-pill font-sans text-[11px] font-medium
                           bg-sage-50 text-sage border border-sage-100"
              >
                <Leaf size={9} aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── REVERSO DE LA TARJETA (detalle científico) ─────────────── */}
      <div
        className={`absolute inset-0 p-5 flex flex-col
                    transition-all duration-500
                    ${isFlipped
                      ? 'opacity-100 pointer-events-auto'
                      : 'opacity-0 pointer-events-none'
                    }`}
        style={{ background: ingredient.color }}
      >
        {/* Header del reverso */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-sans text-[10px] text-white/60 italic mb-0.5">
              {ingredient.latin}
            </p>
            <h3 className="font-display text-lg font-semibold text-white leading-snug">
              {ingredient.name}
            </h3>
          </div>
          <span aria-hidden="true" className="text-3xl mt-0.5">{ingredient.icon}</span>
        </div>

        {/* Descripción científica */}
        <p className="font-sans text-sm text-white/85 leading-relaxed mb-4 flex-grow overflow-y-auto">
          {ingredient.description}
        </p>

        {/* Lista completa de beneficios */}
        <ul className="space-y-1.5">
          {ingredient.benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-center gap-2 font-sans text-xs text-white/90"
            >
              <Sparkles size={10} className="flex-shrink-0 text-white/70" aria-hidden="true" />
              {benefit}
            </li>
          ))}
        </ul>

        {/* Indicador de cerrar */}
        <div
          aria-hidden="true"
          className="mt-4 text-center font-sans text-[10px] text-white/50"
        >
          Tap para volver
        </div>
      </div>
    </article>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function IngredientsGrid() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer para animación de entrada
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const ingredients = FEATURED_ORDER.map((id) => INGREDIENTS_CATALOG[id]);

  return (
    <section
      id="ingredientes"
      ref={sectionRef}
      aria-labelledby="ingredients-heading"
      className="py-24 sm:py-32 bg-cream-dark"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── CABECERA DE SECCIÓN ──────────────────────────────────── */}
        <div
          className={`text-center max-w-2xl mx-auto mb-16
                      transition-all duration-700
                      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5
                          bg-gold/15 border border-gold/25 rounded-pill
                          mb-5">
            <Leaf size={12} className="text-gold-dark" aria-hidden="true" />
            <span className="font-sans text-xs font-medium text-gold-dark tracking-wider uppercase">
              Activos Botánicos
            </span>
          </div>

          <h2
            id="ingredients-heading"
            className="font-display text-hero-sm font-semibold text-charcoal mb-4"
          >
            La ciencia detrás
            <br />
            <span className="text-sage">de cada gota</span>
          </h2>

          <p className="font-sans text-base text-charcoal-soft leading-relaxed">
            Cada ingrediente UMAY es seleccionado por sus propiedades botánicas
            documentadas científicamente. Cultivados de forma sostenible en los
            Andes y valles peruanos, directo a tu fórmula personalizada.
          </p>

          <p className="font-sans text-sm text-charcoal-muted mt-3">
            <kbd className="px-2 py-0.5 bg-sage-50 border border-sage-100 rounded text-xs font-sans text-sage">
              Toca cada tarjeta
            </kbd>
            {' '}para conocer la ciencia botánica
          </p>
        </div>

        {/* ── GRID DE INGREDIENTES ─────────────────────────────────── */}
        <div
          role="list"
          aria-label="Catálogo de ingredientes botánicos UMAY"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {ingredients.map((ingredient, index) => (
            <IngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              isVisible={isVisible}
              delay={index * 80}
            />
          ))}
        </div>

        {/* ── CTA INFERIOR ─────────────────────────────────────────── */}
        <div
          className={`mt-14 text-center transition-all duration-700 delay-500
                      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className="font-sans text-sm text-charcoal-muted mb-4">
            Nuestro algoritmo combina los mejores ingredientes en la proporción exacta para ti
          </p>
          <a
            href="#quiz"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#quiz')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3
                       bg-sage text-cream font-sans text-sm font-medium
                       rounded-pill shadow-botanical
                       transition-all duration-300
                       hover:bg-sage-dark hover:scale-[1.02] hover:shadow-botanical-lg
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <Sparkles size={15} aria-hidden="true" />
            Descubrir mi fórmula
          </a>
        </div>
      </div>
    </section>
  );
}
