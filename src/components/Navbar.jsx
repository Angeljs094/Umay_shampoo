/**
 * @fileoverview Navbar – Barra de navegación responsive UMAY
 * @param {{ cartCount: number, onCartClick: () => void }} props
 */

import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Menu, X, Leaf } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Ingredientes', href: '#ingredientes' },
  { label: 'Mi Fórmula',   href: '#quiz' },
  { label: 'Nosotros',     href: '#nosotros' },
];

export default function Navbar({ cartCount = 0, onCartClick }) {
  const [isScrolled,    setIsScrolled]    = useState(false);
  const [isMobileOpen,  setIsMobileOpen]  = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(cartCount);
  const [cartBounce,    setCartBounce]    = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cartCount > prevCartCount) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 600);
      setPrevCartCount(cartCount);
      return () => clearTimeout(timer);
    }
    setPrevCartCount(cartCount);
  }, [cartCount, prevCartCount]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const handleNavClick = useCallback((href) => {
    setIsMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled
          ? 'bg-cream/90 backdrop-blur-md shadow-botanical border-b border-sage-50'
          : 'bg-transparent'
        }`}
    >
      <nav aria-label="Navegación principal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* ── LOGO ─────────────────────────────────────────────────────── */}
          <a href="#" aria-label="UMAY - Inicio"
             className="flex items-center gap-2.5 group focus:outline-none
                        focus-visible:ring-2 focus-visible:ring-sage rounded-lg">
            <div className="relative w-9 h-9 flex-shrink-0">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"
                   className="w-full h-full transition-transform duration-300 group-hover:scale-110"
                   aria-hidden="true">
                <circle cx="18" cy="18" r="18" fill="#2C4A3E" />
                <path d="M10 8 C10 8, 22 7, 24 18 C24 18, 14 17, 10 8Z" fill="#C5A880" opacity="0.85" />
                <path d="M26 28 C26 28, 14 29, 12 18 C12 18, 22 19, 26 28Z" fill="#4A7060" opacity="0.75" />
                <line x1="18" y1="7" x2="18" y2="29" stroke="#FAF8F5" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="18" cy="12" r="1.5" fill="#C5A880" />
                <circle cx="18" cy="24" r="1.5" fill="#C5A880" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-semibold tracking-[0.18em] text-sage uppercase">UMAY</span>
              <span className="font-sans text-[0.55rem] tracking-[0.22em] text-charcoal-muted uppercase">Botánica Andina</span>
            </div>
          </a>

          {/* ── NAV LINKS (desktop) ───────────────────────────────────────── */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <button onClick={() => handleNavClick(link.href)}
                        className="font-sans text-sm font-medium text-charcoal-soft
                                   hover:text-sage transition-colors duration-200
                                   relative group focus:outline-none
                                   focus-visible:ring-2 focus-visible:ring-sage rounded">
                  {link.label}
                  <span aria-hidden="true"
                        className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gold
                                   transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
            ))}
          </ul>

          {/* ── ACCIONES DERECHA ──────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <button onClick={() => handleNavClick('#quiz')}
                    className="hidden md:flex items-center gap-2 px-5 py-2.5
                               bg-sage text-cream font-sans text-sm font-medium
                               rounded-pill transition-all duration-300
                               hover:bg-sage-dark hover:scale-[1.02] active:scale-[0.98]
                               focus:outline-none focus-visible:ring-2
                               focus-visible:ring-sage focus-visible:ring-offset-2">
              <Leaf size={14} aria-hidden="true" />
              Crear mi fórmula
            </button>

            {/* Botón carrito */}
            <button
              onClick={onCartClick}
              aria-label={`Carrito: ${cartCount} ${cartCount === 1 ? 'producto' : 'productos'}`}
              className={`relative p-2 rounded-full transition-all duration-300
                          hover:bg-sage-50 focus:outline-none
                          focus-visible:ring-2 focus-visible:ring-sage
                          ${cartBounce ? 'animate-pulse-scale' : ''}`}
            >
              <ShoppingBag size={22} className="text-charcoal-soft" aria-hidden="true" />
              {cartCount > 0 && (
                <span aria-hidden="true"
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px]
                                 flex items-center justify-center
                                 bg-gold text-charcoal font-sans text-[10px] font-bold
                                 rounded-full px-1 leading-none">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburguesa mobile */}
            <button
              aria-label={isMobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-charcoal-soft
                         hover:bg-sage-50 transition-colors duration-200
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-sage">
              {isMobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* ── MENÚ MOBILE ──────────────────────────────────────────────── */}
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menú de navegación"
             className={`md:hidden transition-all duration-300 overflow-hidden
               ${isMobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 px-2 border-t border-sage-100 bg-cream/95 backdrop-blur-sm">
            <ul role="list" className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <button onClick={() => handleNavClick(link.href)}
                          className="w-full text-left px-4 py-3 rounded-card
                                     font-sans text-base text-charcoal-soft font-medium
                                     hover:bg-sage-50 hover:text-sage transition-colors duration-200">
                    {link.label}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <button onClick={() => handleNavClick('#quiz')}
                        className="w-full flex items-center justify-center gap-2
                                   px-4 py-3 bg-sage text-cream rounded-card
                                   font-sans text-base font-medium
                                   hover:bg-sage-dark transition-colors duration-200">
                  <Leaf size={16} aria-hidden="true" />
                  Crear mi fórmula personalizada
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
