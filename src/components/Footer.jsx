/**
 * @fileoverview Footer – Pie de página UMAY
 */

import { Leaf } from 'lucide-react';

const FOOTER_LINKS = {
  Producto:  ['Cómo funciona', 'Ingredientes', 'Mi fórmula', 'Precios'],
  Empresa:   ['Nosotros', 'Sustentabilidad', 'Prensa', 'Contacto'],
  Legal:     ['Privacidad', 'Términos', 'Cookies', 'GDPR'],
};

const CERTIFICATIONS = [
  { icon: '🌿', label: 'Ingredientes Orgánicos' },
  { icon: '♻️', label: 'Empaque Reciclable' },
  { icon: '🐇', label: 'Cruelty Free' },
  { icon: 'PE', label: 'Hecho en Perú', isText: true },
];

export default function Footer() {
  return (
    <footer id="nosotros" aria-label="Pie de página UMAY"
            className="bg-sage-dark text-cream/80">

      {/* Franja de certificaciones */}
      <div className="border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
            {CERTIFICATIONS.map(({ icon, label, isText }) => (
              <div key={label} className="flex items-center gap-2">
                {isText
                  ? <span className="font-display text-xs font-bold text-gold tracking-wider">{icon}</span>
                  : <span className="text-lg" aria-hidden="true">{icon}</span>
                }
                <span className="font-sans text-xs font-medium text-cream/70">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cuerpo del footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-cream/10 flex items-center justify-center">
                <Leaf size={14} className="text-gold" aria-hidden="true" />
              </div>
              <div>
                <span className="font-display text-lg font-semibold tracking-[0.18em] text-cream uppercase">UMAY</span>
              </div>
            </div>
            <p className="font-sans text-xs text-cream/50 leading-relaxed mb-4">
              Shampoo sólido personalizado con activos botánicos de los Andes peruanos.
              Cada fórmula, única para ti.
            </p>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cream/5 rounded-pill w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="font-sans text-[10px] text-cream/60">MVP en desarrollo activo</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-sans text-xs font-semibold text-cream/90 uppercase
                             tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <button className="font-sans text-xs text-cream/50 hover:text-cream
                                       transition-colors duration-200">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4
                        flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[10px] text-cream/30">
            © 2026 UMAY Botánica Andina. Todos los derechos reservados.
          </p>
          <p className="font-sans text-[10px] text-cream/20">
            Construido con React + Vite + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
