/**
 * @fileoverview Footer – Pie de página UMAY
 *
 * Características:
 * - Logo repetido con tagline de marca
 * - Links de navegación agrupados
 * - Redes sociales simuladas con íconos SVG custom
 * - Sello de sostenibilidad y créditos académicos
 * - Fondo oscuro con sage profundo
 *
 * @module components/Footer
 */

import { Leaf, Heart, Instagram, Twitter, Youtube } from 'lucide-react';

const FOOTER_LINKS = {
  Producto: [
    { label: 'Cómo funciona', href: '#quiz' },
    { label: 'Ingredientes', href: '#ingredientes' },
    { label: 'Fórmulas disponibles', href: '#quiz' },
    { label: 'Precios', href: '#quiz' },
  ],
  'Sobre UMAY': [
    { label: 'Nuestra misión', href: '#nosotros' },
    { label: 'Sostenibilidad', href: '#nosotros' },
    { label: 'Proveedores andinos', href: '#nosotros' },
    { label: 'Certificaciones', href: '#nosotros' },
  ],
  Legal: [
    { label: 'Política de privacidad', href: '#' },
    { label: 'Términos de uso', href: '#' },
    { label: 'Política de devolución', href: '#' },
  ],
};

const SOCIAL_LINKS = [
  {
    label: 'Instagram de UMAY',
    href: '#',
    Icon: Instagram,
  },
  {
    label: 'Twitter de UMAY',
    href: '#',
    Icon: Twitter,
  },
  {
    label: 'YouTube de UMAY',
    href: '#',
    Icon: Youtube,
  },
];

const CERTIFICATIONS = [
  { emoji: '🌱', label: 'Ingredientes Orgánicos' },
  { emoji: '♻️', label: 'Empaque Reciclable' },
  { emoji: '🐰', label: 'Cruelty Free' },
  { emoji: '🇵🇪', label: 'Hecho en Perú' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSmoothScroll = (e, href) => {
    if (href.startsWith('#') && href !== '#') {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="nosotros"
      role="contentinfo"
      className="bg-sage-dark text-cream"
    >
      {/* ── BANDA DE CERTIFICACIONES ────────────────────────────────── */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {CERTIFICATIONS.map(({ emoji, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">{emoji}</span>
                <span className="font-sans text-xs text-white/70 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENIDO PRINCIPAL ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Columna 1: Marca */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 flex-shrink-0">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="18" cy="18" r="18" fill="#FAF8F5" opacity="0.15" />
                  <path d="M10 8 C10 8, 22 7, 24 18 C24 18, 14 17, 10 8Z" fill="#C5A880" opacity="0.85" />
                  <path d="M26 28 C26 28, 14 29, 12 18 C12 18, 22 19, 26 28Z" fill="#4A7060" opacity="0.75" />
                  <line x1="18" y1="7" x2="18" y2="29" stroke="#FAF8F5" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="18" cy="12" r="1.5" fill="#C5A880" />
                  <circle cx="18" cy="24" r="1.5" fill="#C5A880" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-semibold tracking-[0.18em] text-cream uppercase">
                  UMAY
                </span>
                <span className="font-sans text-[0.55rem] tracking-[0.22em] text-cream/50 uppercase">
                  Botánica Andina
                </span>
              </div>
            </div>

            {/* Misión */}
            <p className="font-sans text-sm text-white/65 leading-relaxed mb-6 max-w-xs">
              Llevamos la riqueza botánica de los Andes peruanos a tu rutina de
              cuidado capilar. Cada fórmula es única, sostenible y respetuosa
              con el ecosistema andino.
            </p>

            {/* Redes sociales */}
            <div className="flex items-center gap-3" role="list" aria-label="Redes sociales">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center
                             text-white/60 transition-all duration-250
                             hover:bg-gold hover:text-charcoal hover:scale-110
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-gold
                             focus-visible:ring-offset-2 focus-visible:ring-offset-sage-dark"
                >
                  <Icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Columnas 2-4: Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-sans text-xs font-semibold text-white/40
                              tracking-widest uppercase mb-4">
                {category}
              </h3>
              <ul role="list" className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      onClick={(e) => handleSmoothScroll(e, href)}
                      className="font-sans text-sm text-white/65 transition-colors duration-200
                                 hover:text-gold focus:outline-none
                                 focus-visible:ring-1 focus-visible:ring-gold rounded"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── FRANJA INFERIOR ──────────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Copyright */}
            <p className="font-sans text-xs text-white/40 text-center sm:text-left">
              © {currentYear} UMAY Botánica Andina. Todos los derechos reservados.
            </p>

            {/* Créditos académicos */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5
                          bg-white/5 rounded-pill border border-white/10"
            >
              <Leaf size={10} className="text-gold/70" aria-hidden="true" />
              <p className="font-sans text-[10px] text-white/45 text-center">
                Proyecto universitario · Desarrollado con{' '}
                <Heart
                  size={9}
                  className="inline text-gold/60 mx-0.5"
                  aria-label="amor"
                  fill="currentColor"
                />
                {' '}en Perú
              </p>
            </div>

            {/* Tagline de tecnología */}
            <p className="font-sans text-[10px] text-white/30">
              Algoritmo Botánico · React + Vite + Tailwind
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
