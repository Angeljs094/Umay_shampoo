/**
 * @fileoverview CartDrawer – Panel lateral deslizante del carrito UMAY
 *
 * Características:
 * - Drawer desde la derecha con overlay oscuro
 * - Lista de items con emoji, nombre, precio, cantidad (+/-)
 * - Botón eliminar item individual
 * - Botón "Vaciar carrito" con confirmación
 * - Subtotal calculado en tiempo real
 * - CTA "Ir al checkout" que abre el flujo de pago
 * - Cierre con Escape, click en overlay o botón X
 * - Accesibilidad: role dialog, aria-modal, focus-trap básico
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   cartItems: CartItem[],
 *   cartTotal: number,
 *   onRemove: (cartId: string) => void,
 *   onUpdateQty: (cartId: string, delta: number) => void,
 *   onClear: () => void,
 *   onCheckout: () => void,
 * }} props
 */

import { useEffect, useRef, useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Leaf, ArrowRight, AlertCircle } from 'lucide-react';

const TIER_LABELS = { base: 'Esencial', premium: 'Premium', deluxe: 'Deluxe' };
const TIER_COLORS = {
  base:    'bg-sage-50 text-sage border-sage-100',
  premium: 'bg-gold/10 text-gold-dark border-gold/25',
  deluxe:  'bg-charcoal/5 text-charcoal border-charcoal/15',
};

export default function CartDrawer({ isOpen, onClose, cartItems, cartTotal, onRemove, onUpdateQty, onClear, onCheckout }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const closeRef = useRef(null);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Bloquear scroll del body mientras está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Focus en el botón cerrar al abrir
  useEffect(() => {
    if (isOpen) setTimeout(() => closeRef.current?.focus(), 100);
    else setConfirmClear(false);
  }, [isOpen]);

  const handleClearConfirm = () => {
    onClear();
    setConfirmClear(false);
  };

  const handleCheckout = () => {
    onClose();
    onCheckout();
  };

  const isEmpty = cartItems.length === 0;

  return (
    <>
      {/* ── OVERLAY ─────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-xs
                    transition-opacity duration-300
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* ── DRAWER ──────────────────────────────────────────────────── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`fixed right-0 top-0 h-full z-50 w-full max-w-md
                    bg-cream flex flex-col shadow-botanical-lg
                    transition-transform duration-400 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* ── HEADER ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4
                        border-b border-sage-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sage/10 flex items-center justify-center">
              <ShoppingBag size={16} className="text-sage" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-charcoal">
                Mi carrito
              </h2>
              {!isEmpty && (
                <p className="font-sans text-xs text-charcoal-muted">
                  {cartItems.reduce((s, i) => s + i.quantity, 0)} producto{cartItems.reduce((s,i)=>s+i.quantity,0)!==1?'s':''}
                </p>
              )}
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="w-8 h-8 rounded-full flex items-center justify-center
                       text-charcoal-muted hover:bg-sage-50 hover:text-charcoal
                       transition-colors duration-200
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* ── BODY ──────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isEmpty ? (
            /* Carrito vacío */
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <div className="w-20 h-20 rounded-full bg-sage-50 flex items-center justify-center">
                <ShoppingBag size={32} className="text-sage/40" aria-hidden="true" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-charcoal mb-1">
                  Tu carrito está vacío
                </p>
                <p className="font-sans text-sm text-charcoal-muted">
                  Completa el quiz para obtener tu fórmula personalizada
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-5 py-2.5
                           bg-sage text-cream font-sans text-sm font-medium
                           rounded-pill transition-all duration-300
                           hover:bg-sage-dark hover:scale-[1.02]
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              >
                <Leaf size={14} aria-hidden="true" />
                Crear mi fórmula
              </button>
            </div>
          ) : (
            /* Lista de items */
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="flex gap-3 p-3.5 bg-white rounded-botanical
                             border border-sage-50 shadow-card"
                >
                  {/* Mini barra de shampoo */}
                  <div
                    className="w-10 h-14 rounded-xl flex-shrink-0 flex items-center justify-center
                               shadow-sm overflow-hidden"
                    style={{ background: `linear-gradient(145deg, ${item.colorHex}EE, ${item.colorHex}88)` }}
                    aria-hidden="true"
                  >
                    <Leaf size={12} className="text-white/60" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-sans text-sm font-semibold text-charcoal leading-tight line-clamp-2">
                        {item.formulaName}
                      </p>
                      <button
                        onClick={() => onRemove(item.cartId)}
                        aria-label={`Eliminar ${item.formulaName} del carrito`}
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                                   text-charcoal-muted hover:bg-red-50 hover:text-red-500
                                   transition-colors duration-200
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        <Trash2 size={12} aria-hidden="true" />
                      </button>
                    </div>

                    {/* Ingredients chips */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.topIngredients.slice(0, 3).map(ingr => (
                        <span
                          key={ingr.id}
                          className="font-sans text-[10px] px-1.5 py-0.5
                                     bg-sage-50 text-sage rounded border border-sage-100"
                        >
                          {ingr.data.icon} {ingr.data.name.split(' ')[0]}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Tier badge */}
                      <span className={`px-2 py-0.5 rounded-pill font-sans text-[10px]
                                        font-semibold border ${TIER_COLORS[item.tier]}`}>
                        {TIER_LABELS[item.tier]}
                      </span>

                      {/* Precio y cantidad */}
                      <div className="flex items-center gap-2">
                        <p className="font-display text-sm font-semibold text-charcoal">
                          S/. {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1 bg-sage-50 rounded-pill px-1 py-0.5">
                          <button
                            onClick={() => onUpdateQty(item.cartId, -1)}
                            aria-label="Disminuir cantidad"
                            disabled={item.quantity <= 1}
                            className="w-5 h-5 rounded-full flex items-center justify-center
                                       text-sage hover:bg-sage hover:text-cream
                                       disabled:opacity-30 disabled:cursor-not-allowed
                                       transition-colors duration-150
                                       focus:outline-none focus-visible:ring-1 focus-visible:ring-sage"
                          >
                            <Minus size={10} aria-hidden="true" />
                          </button>
                          <span className="font-sans text-xs font-semibold text-charcoal
                                           min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.cartId, 1)}
                            aria-label="Aumentar cantidad"
                            className="w-5 h-5 rounded-full flex items-center justify-center
                                       text-sage hover:bg-sage hover:text-cream
                                       transition-colors duration-150
                                       focus:outline-none focus-visible:ring-1 focus-visible:ring-sage"
                          >
                            <Plus size={10} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Botón vaciar carrito */}
              {!confirmClear ? (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5
                             font-sans text-xs text-charcoal-muted border border-dashed
                             border-charcoal/15 rounded-botanical
                             hover:border-red-300 hover:text-red-500
                             transition-colors duration-200
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <Trash2 size={12} aria-hidden="true" />
                  Vaciar carrito
                </button>
              ) : (
                <div className="p-3 bg-red-50 border border-red-100 rounded-botanical">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={14} className="text-red-500 flex-shrink-0" aria-hidden="true" />
                    <p className="font-sans text-xs text-red-700 font-medium">
                      ¿Vaciar todo el carrito?
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleClearConfirm}
                      className="flex-1 py-1.5 bg-red-500 text-white font-sans text-xs
                                 font-semibold rounded-pill
                                 hover:bg-red-600 transition-colors duration-200
                                 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      Sí, vaciar
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="flex-1 py-1.5 bg-white text-charcoal-soft font-sans text-xs
                                 font-medium rounded-pill border border-charcoal/15
                                 hover:bg-sage-50 transition-colors duration-200
                                 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── FOOTER DEL CARRITO ────────────────────────────────────── */}
        {!isEmpty && (
          <div className="flex-shrink-0 px-5 py-4 border-t border-sage-100 bg-white/80 backdrop-blur-xs">
            {/* Desglose del total */}
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between font-sans text-sm text-charcoal-soft">
                <span>Subtotal</span>
                <span>S/. {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-sans text-sm text-charcoal-soft">
                <span>Envío</span>
                <span className="text-sage font-medium">Gratis 🌿</span>
              </div>
              <div className="h-px bg-sage-100 my-1" aria-hidden="true" />
              <div className="flex justify-between font-display text-base font-semibold text-charcoal">
                <span>Total</span>
                <span>S/. {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* CTA Checkout */}
            <button
              onClick={handleCheckout}
              className="group w-full flex items-center justify-center gap-2.5
                         py-4 bg-sage text-cream font-sans text-base font-semibold
                         rounded-pill shadow-botanical
                         transition-all duration-300
                         hover:bg-sage-dark hover:scale-[1.01] hover:shadow-botanical-lg
                         active:scale-[0.99]
                         focus:outline-none focus-visible:ring-2
                         focus-visible:ring-sage focus-visible:ring-offset-2"
            >
              Ir al checkout
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <p className="text-center font-sans text-[10px] text-charcoal-muted mt-2">
              🔒 Pago seguro · SSL certificado
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
