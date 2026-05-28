/**
 * @fileoverview Checkout – Flujo multi-paso de compra UMAY
 *
 * Pasos:
 *   1. CART    → Resumen de productos (puede editar qty / eliminar)
 *   2. SHIPPING → Datos de envío (nombre, dirección, teléfono, email)
 *   3. PAYMENT → Método de pago: Tarjeta de crédito | Yape
 *   4. REVIEW  → Resumen final + botón "Pagar" (sin acción — MVP)
 *
 * Funcionalidades adicionales:
 *   - Cancelar pedido (vuelve al paso 1 y ofrece limpiar carrito)
 *   - Validación básica de formulario antes de avanzar
 *   - Animación de entrada/salida entre pasos
 *   - Cierre con Escape
 *
 * @module components/Checkout
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, ArrowLeft, ArrowRight, ShoppingBag, MapPin, CreditCard,
  CheckCircle2, Leaf, Smartphone, Lock, AlertCircle, Trash2, ChevronRight,
} from 'lucide-react';

// ─── CONSTANTES ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 'cart',     label: 'Carrito',  icon: ShoppingBag },
  { id: 'shipping', label: 'Envío',    icon: MapPin      },
  { id: 'payment',  label: 'Pago',     icon: CreditCard  },
  { id: 'review',   label: 'Revisar',  icon: CheckCircle2},
];

const TIER_LABELS = { base: 'Esencial', premium: 'Premium', deluxe: 'Deluxe' };
const TIER_COLORS = {
  base:    'bg-sage-50 text-sage border-sage-100',
  premium: 'bg-gold/10 text-gold-dark border-gold/25',
  deluxe:  'bg-charcoal/5 text-charcoal border-charcoal/15',
};

const PERU_REGIONS = [
  'Lima', 'Arequipa', 'Cusco', 'La Libertad', 'Piura', 'Lambayeque',
  'Junín', 'Loreto', 'Cajamarca', 'Áncash', 'Ica', 'San Martín',
  'Puno', 'Ucayali', 'Huánuco', 'Ayacucho', 'Tacna', 'Tumbes', 'Pasco',
  'Moquegua', 'Apurímac', 'Huancavelica', 'Amazonas', 'Madre de Dios', 'Callao',
];

// ─── COMPONENTE DE STEP INDICATOR ────────────────────────────────────────────

function StepIndicator({ currentStep }) {
  const currentIdx = STEPS.findIndex(s => s.id === currentStep);
  return (
    <div className="flex items-center gap-0" role="list" aria-label="Pasos del checkout">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const done    = idx < currentIdx;
        const active  = idx === currentIdx;
        return (
          <div key={step.id} role="listitem" className="flex items-center">
            <div className={`flex flex-col items-center gap-1 ${active || done ? '' : 'opacity-40'}`}>
              <div
                aria-current={active ? 'step' : undefined}
                className={`w-8 h-8 rounded-full flex items-center justify-center
                             transition-all duration-300
                             ${done   ? 'bg-sage text-cream'
                             : active ? 'bg-sage/15 border-2 border-sage text-sage'
                             :          'bg-cream-dark border border-sage-100 text-charcoal-muted'}`}
              >
                {done
                  ? <CheckCircle2 size={14} aria-hidden="true" />
                  : <Icon size={13} aria-hidden="true" />
                }
              </div>
              <span className={`font-sans text-[9px] font-medium tracking-wide hidden sm:block
                               ${active ? 'text-sage' : done ? 'text-sage/70' : 'text-charcoal-muted'}`}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                aria-hidden="true"
                className={`h-px w-6 sm:w-10 mx-1 transition-all duration-300
                             ${idx < currentIdx ? 'bg-sage' : 'bg-sage-100'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── PASO 1: RESUMEN DEL CARRITO ──────────────────────────────────────────────

function StepCart({ cartItems, cartTotal, onRemove, onUpdateQty, onNext, onCancel }) {
  const isEmpty = cartItems.length === 0;
  return (
    <div className="animate-fade-in-up">
      <h3 className="font-display text-xl font-semibold text-charcoal mb-1">
        Resumen del pedido
      </h3>
      <p className="font-sans text-sm text-charcoal-muted mb-5">
        Revisa tus productos antes de continuar
      </p>

      {isEmpty ? (
        <div className="text-center py-10">
          <ShoppingBag size={40} className="text-sage/30 mx-auto mb-3" aria-hidden="true" />
          <p className="font-sans text-sm text-charcoal-muted">Tu carrito está vacío</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {cartItems.map(item => (
            <div key={item.cartId}
                 className="flex gap-3 p-3 bg-cream rounded-botanical border border-sage-100">
              {/* Mini barra */}
              <div
                className="w-10 h-14 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: `linear-gradient(145deg,${item.colorHex}EE,${item.colorHex}77)` }}
                aria-hidden="true"
              >
                <Leaf size={11} className="text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div>
                    <p className="font-sans text-sm font-semibold text-charcoal leading-tight">
                      {item.formulaName}
                    </p>
                    <span className={`inline-block mt-0.5 px-2 py-px rounded-pill font-sans text-[10px]
                                      font-semibold border ${TIER_COLORS[item.tier]}`}>
                      {TIER_LABELS[item.tier]}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemove(item.cartId)}
                    aria-label={`Eliminar ${item.formulaName}`}
                    className="w-6 h-6 rounded flex items-center justify-center
                               text-charcoal-muted hover:text-red-500 hover:bg-red-50
                               transition-colors duration-150
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  >
                    <Trash2 size={12} aria-hidden="true" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm font-semibold text-charcoal">
                    S/. {(item.price * item.quantity).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-1.5 bg-white rounded-pill
                                  border border-sage-100 px-2 py-0.5">
                    <button onClick={() => onUpdateQty(item.cartId, -1)} disabled={item.quantity <= 1}
                            aria-label="Menos"
                            className="text-sage disabled:opacity-30 focus:outline-none">
                      <span className="text-sm font-bold leading-none">−</span>
                    </button>
                    <span className="font-sans text-xs font-semibold text-charcoal min-w-[16px] text-center">
                      {item.quantity}
                    </span>
                    <button onClick={() => onUpdateQty(item.cartId, 1)} aria-label="Más"
                            className="text-sage focus:outline-none">
                      <span className="text-sm font-bold leading-none">+</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      {!isEmpty && (
        <div className="border-t border-sage-100 pt-4 mb-5">
          <div className="flex justify-between font-sans text-sm text-charcoal-soft mb-1">
            <span>Subtotal</span><span>S/. {cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-sans text-sm text-charcoal-soft mb-2">
            <span>Envío</span><span className="text-sage font-medium">Gratis 🌿</span>
          </div>
          <div className="flex justify-between font-display text-base font-semibold text-charcoal">
            <span>Total a pagar</span><span>S/. {cartTotal.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button
          onClick={onNext}
          disabled={isEmpty}
          className="w-full flex items-center justify-center gap-2 py-3.5
                     bg-sage text-cream font-sans text-sm font-semibold
                     rounded-pill shadow-botanical disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-300 hover:bg-sage-dark hover:scale-[1.01]
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
        >
          Continuar al envío <ArrowRight size={16} aria-hidden="true" />
        </button>
        <button
          onClick={onCancel}
          className="w-full py-2.5 font-sans text-sm text-charcoal-muted
                     border border-charcoal/10 rounded-pill
                     hover:border-red-300 hover:text-red-500 hover:bg-red-50
                     transition-colors duration-200
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          Cancelar pedido
        </button>
      </div>
    </div>
  );
}

// ─── PASO 2: DATOS DE ENVÍO ────────────────────────────────────────────────────

function StepShipping({ shippingData, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!shippingData.name?.trim())      e.name     = 'Ingresa tu nombre completo';
    if (!shippingData.phone?.trim())     e.phone    = 'Ingresa tu número de teléfono';
    if (!shippingData.email?.trim())     e.email    = 'Ingresa tu email';
    else if (!/\S+@\S+\.\S+/.test(shippingData.email)) e.email = 'Email inválido';
    if (!shippingData.address?.trim())   e.address  = 'Ingresa tu dirección';
    if (!shippingData.region)            e.region   = 'Selecciona tu región';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  const field = (id, label, type = 'text', extra = {}) => (
    <div>
      <label htmlFor={id} className="block font-sans text-xs font-semibold text-charcoal-soft mb-1.5">
        {label} <span className="text-gold-dark">*</span>
      </label>
      <input
        id={id} type={type} value={shippingData[id] || ''} {...extra}
        onChange={e => onChange(id, e.target.value)}
        className={`w-full px-3.5 py-2.5 font-sans text-sm text-charcoal
                    bg-white border rounded-card outline-none
                    transition-colors duration-200
                    focus:border-sage focus:ring-2 focus:ring-sage/10
                    placeholder:text-charcoal-muted/50
                    ${errors[id] ? 'border-red-400 bg-red-50/30' : 'border-sage-100'}`}
      />
      {errors[id] && (
        <p className="flex items-center gap-1 mt-1 font-sans text-[11px] text-red-500">
          <AlertCircle size={10} aria-hidden="true" />{errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in-up">
      <h3 className="font-display text-xl font-semibold text-charcoal mb-1">
        Datos de envío
      </h3>
      <p className="font-sans text-sm text-charcoal-muted mb-5">
        ¿A dónde enviamos tu fórmula botánica?
      </p>

      <div className="space-y-3.5 mb-6">
        {field('name',    'Nombre completo',   'text', { placeholder: 'Ej. María Torres Quispe' })}
        <div className="grid grid-cols-2 gap-3">
          {field('phone',  'Teléfono / Celular', 'tel',  { placeholder: '999 999 999' })}
          {field('email',  'Correo electrónico', 'email',{ placeholder: 'correo@ejemplo.com' })}
        </div>
        {field('address', 'Dirección completa', 'text', { placeholder: 'Jr. Los Olivos 123, Dpto 4B' })}
        <div>
          <label htmlFor="region" className="block font-sans text-xs font-semibold text-charcoal-soft mb-1.5">
            Región <span className="text-gold-dark">*</span>
          </label>
          <select
            id="region"
            value={shippingData.region || ''}
            onChange={e => onChange('region', e.target.value)}
            className={`w-full px-3.5 py-2.5 font-sans text-sm text-charcoal
                        bg-white border rounded-card outline-none
                        transition-colors duration-200
                        focus:border-sage focus:ring-2 focus:ring-sage/10
                        ${errors.region ? 'border-red-400 bg-red-50/30' : 'border-sage-100'}`}
          >
            <option value="">Selecciona tu región</option>
            {PERU_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.region && (
            <p className="flex items-center gap-1 mt-1 font-sans text-[11px] text-red-500">
              <AlertCircle size={10} aria-hidden="true" />{errors.region}
            </p>
          )}
        </div>
        {field('reference', 'Referencia (opcional)', 'text', { placeholder: 'Cerca al parque, casa blanca...' })}
      </div>

      <div className="flex gap-2">
        <button onClick={onBack}
                className="flex items-center gap-1.5 px-4 py-3 font-sans text-sm text-charcoal-soft
                           border border-charcoal/12 rounded-pill hover:bg-sage-50 hover:text-sage
                           transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage">
          <ArrowLeft size={15} aria-hidden="true" /> Volver
        </button>
        <button onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 py-3
                           bg-sage text-cream font-sans text-sm font-semibold
                           rounded-pill shadow-botanical
                           hover:bg-sage-dark hover:scale-[1.01] transition-all duration-300
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-sage">
          Ir al pago <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

// ─── PASO 3: MÉTODO DE PAGO ────────────────────────────────────────────────────

function StepPayment({ paymentMethod, onMethodChange, cardData, onCardChange, yapePhone, onYapeChange, cartTotal, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const formatCard = (val) => val.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g,'').slice(0,4);
    return clean.length > 2 ? clean.slice(0,2)+'/'+clean.slice(2) : clean;
  };

  const validate = () => {
    const e = {};
    if (paymentMethod === 'card') {
      const num = (cardData.number||'').replace(/\s/g,'');
      if (num.length < 16)         e.number = 'Número de tarjeta inválido';
      if (!cardData.expiry?.match(/^\d{2}\/\d{2}$/)) e.expiry = 'Formato MM/AA';
      if (!(cardData.cvv||'').match(/^\d{3,4}$/))    e.cvv    = 'CVV inválido';
      if (!cardData.name?.trim())  e.name   = 'Nombre requerido';
    } else {
      if (!(yapePhone||'').replace(/\s/g,'').match(/^\d{9}$/)) e.yapePhone = 'Número Yape inválido (9 dígitos)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  return (
    <div className="animate-fade-in-up">
      <h3 className="font-display text-xl font-semibold text-charcoal mb-1">
        Método de pago
      </h3>
      <p className="font-sans text-sm text-charcoal-muted mb-5">
        Selecciona cómo deseas pagar S/. {cartTotal.toFixed(2)}
      </p>

      {/* Selector de método */}
      <div className="grid grid-cols-2 gap-3 mb-5" role="radiogroup" aria-label="Método de pago">
        {/* Tarjeta */}
        <button
          role="radio"
          aria-checked={paymentMethod === 'card'}
          onClick={() => onMethodChange('card')}
          className={`flex flex-col items-center gap-2 p-4 rounded-botanical border-2
                       transition-all duration-200
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-sage
                       ${paymentMethod === 'card'
                         ? 'border-sage bg-sage-50'
                         : 'border-sage-100 bg-white hover:border-sage-200 hover:bg-sage-50/40'}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center
                           ${paymentMethod === 'card' ? 'bg-sage text-cream' : 'bg-sage-50 text-sage'}`}>
            <CreditCard size={18} aria-hidden="true" />
          </div>
          <span className="font-sans text-sm font-semibold text-charcoal">Tarjeta</span>
          <span className="font-sans text-[10px] text-charcoal-muted">Visa / Mastercard</span>
          {paymentMethod === 'card' && (
            <CheckCircle2 size={14} className="text-sage absolute top-2 right-2" aria-hidden="true" />
          )}
        </button>

        {/* Yape */}
        <button
          role="radio"
          aria-checked={paymentMethod === 'yape'}
          onClick={() => onMethodChange('yape')}
          className={`relative flex flex-col items-center gap-2 p-4 rounded-botanical border-2
                       transition-all duration-200
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-sage
                       ${paymentMethod === 'yape'
                         ? 'border-sage bg-sage-50'
                         : 'border-sage-100 bg-white hover:border-sage-200 hover:bg-sage-50/40'}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center
                           ${paymentMethod === 'yape' ? 'bg-[#6B21A8] text-white' : 'bg-purple-50 text-purple-600'}`}>
            <Smartphone size={18} aria-hidden="true" />
          </div>
          <span className="font-sans text-sm font-semibold text-charcoal">Yape</span>
          <span className="font-sans text-[10px] text-charcoal-muted">Pago inmediato</span>
          {paymentMethod === 'yape' && (
            <CheckCircle2 size={14} className="text-sage absolute top-2 right-2" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Formulario Tarjeta */}
      {paymentMethod === 'card' && (
        <div className="space-y-3.5 mb-5 animate-fade-in">
          <div>
            <label htmlFor="card-number" className="block font-sans text-xs font-semibold text-charcoal-soft mb-1.5">
              Número de tarjeta <span className="text-gold-dark">*</span>
            </label>
            <input
              id="card-number" type="text" inputMode="numeric"
              value={cardData.number || ''}
              placeholder="1234 5678 9012 3456"
              onChange={e => onCardChange('number', formatCard(e.target.value))}
              className={`w-full px-3.5 py-2.5 font-sans text-sm text-charcoal font-mono
                          bg-white border rounded-card outline-none tracking-wider
                          focus:border-sage focus:ring-2 focus:ring-sage/10 placeholder:tracking-normal
                          placeholder:font-sans placeholder:text-charcoal-muted/50
                          ${errors.number ? 'border-red-400' : 'border-sage-100'}`}
            />
            {errors.number && <p className="mt-1 font-sans text-[11px] text-red-500">{errors.number}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="card-expiry" className="block font-sans text-xs font-semibold text-charcoal-soft mb-1.5">
                Vencimiento <span className="text-gold-dark">*</span>
              </label>
              <input
                id="card-expiry" type="text" inputMode="numeric"
                value={cardData.expiry || ''} placeholder="MM/AA"
                onChange={e => onCardChange('expiry', formatExpiry(e.target.value))}
                className={`w-full px-3.5 py-2.5 font-sans text-sm text-charcoal font-mono
                            bg-white border rounded-card outline-none
                            focus:border-sage focus:ring-2 focus:ring-sage/10
                            placeholder:font-sans placeholder:text-charcoal-muted/50
                            ${errors.expiry ? 'border-red-400' : 'border-sage-100'}`}
              />
              {errors.expiry && <p className="mt-1 font-sans text-[11px] text-red-500">{errors.expiry}</p>}
            </div>
            <div>
              <label htmlFor="card-cvv" className="block font-sans text-xs font-semibold text-charcoal-soft mb-1.5">
                CVV <span className="text-gold-dark">*</span>
              </label>
              <input
                id="card-cvv" type="text" inputMode="numeric"
                value={cardData.cvv || ''} placeholder="123"
                onChange={e => onCardChange('cvv', e.target.value.replace(/\D/g,'').slice(0,4))}
                className={`w-full px-3.5 py-2.5 font-sans text-sm text-charcoal font-mono
                            bg-white border rounded-card outline-none
                            focus:border-sage focus:ring-2 focus:ring-sage/10
                            placeholder:font-sans placeholder:text-charcoal-muted/50
                            ${errors.cvv ? 'border-red-400' : 'border-sage-100'}`}
              />
              {errors.cvv && <p className="mt-1 font-sans text-[11px] text-red-500">{errors.cvv}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="card-name" className="block font-sans text-xs font-semibold text-charcoal-soft mb-1.5">
              Nombre en la tarjeta <span className="text-gold-dark">*</span>
            </label>
            <input
              id="card-name" type="text"
              value={cardData.name || ''} placeholder="TAL COMO APARECE EN LA TARJETA"
              onChange={e => onCardChange('name', e.target.value.toUpperCase())}
              className={`w-full px-3.5 py-2.5 font-sans text-sm text-charcoal tracking-wide
                          bg-white border rounded-card outline-none uppercase
                          focus:border-sage focus:ring-2 focus:ring-sage/10
                          placeholder:normal-case placeholder:tracking-normal placeholder:text-charcoal-muted/50
                          ${errors.name ? 'border-red-400' : 'border-sage-100'}`}
            />
            {errors.name && <p className="mt-1 font-sans text-[11px] text-red-500">{errors.name}</p>}
          </div>
          {/* Logos de tarjetas simulados */}
          <div className="flex items-center gap-3 pt-1">
            <Lock size={12} className="text-sage" aria-hidden="true" />
            <span className="font-sans text-[11px] text-charcoal-muted">Pago 100% seguro y encriptado</span>
            <div className="flex gap-1.5 ml-auto">
              {['VISA','MC','AMEX'].map(brand => (
                <span key={brand}
                      className="px-1.5 py-0.5 bg-white border border-sage-100 rounded
                                 font-sans text-[9px] font-bold text-charcoal-muted">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Formulario Yape */}
      {paymentMethod === 'yape' && (
        <div className="space-y-4 mb-5 animate-fade-in">
          {/* QR simulado */}
          <div className="flex flex-col items-center gap-3 p-5
                          bg-gradient-to-br from-purple-50 to-purple-100/50
                          border border-purple-200 rounded-botanical">
            {/* QR mock SVG */}
            <svg width="120" height="120" viewBox="0 0 120 120" aria-label="QR de pago Yape simulado">
              <rect width="120" height="120" fill="white" rx="8"/>
              <rect x="10" y="10" width="40" height="40" fill="#6B21A8" rx="4"/>
              <rect x="70" y="10" width="40" height="40" fill="#6B21A8" rx="4"/>
              <rect x="10" y="70" width="40" height="40" fill="#6B21A8" rx="4"/>
              <rect x="18" y="18" width="24" height="24" fill="white" rx="2"/>
              <rect x="78" y="18" width="24" height="24" fill="white" rx="2"/>
              <rect x="18" y="78" width="24" height="24" fill="white" rx="2"/>
              <rect x="25" y="25" width="10" height="10" fill="#6B21A8"/>
              <rect x="85" y="25" width="10" height="10" fill="#6B21A8"/>
              <rect x="25" y="85" width="10" height="10" fill="#6B21A8"/>
              {[70,80,90,100].map((x,i) => [70,80,90,100].map((y,j) =>
                (i+j)%2===0 && <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill="#6B21A8"/>
              ))}
              <rect x="55" y="50" width="10" height="10" fill="#6B21A8"/>
              <rect x="50" y="60" width="8" height="8" fill="#6B21A8"/>
            </svg>
            <p className="font-sans text-xs text-purple-700 text-center font-medium">
              Escanea con tu app Yape
            </p>
            <div className="flex items-center gap-1.5 px-3 py-1.5
                            bg-[#6B21A8]/10 border border-purple-200 rounded-pill">
              <span className="font-display text-sm font-semibold text-purple-800">
                S/. {cartTotal.toFixed(2)}
              </span>
              <span className="font-sans text-xs text-purple-600">· UMAY Botánica</span>
            </div>
          </div>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-sage-100" aria-hidden="true" />
            <span className="font-sans text-xs text-charcoal-muted">o ingresa tu número</span>
            <div className="flex-1 h-px bg-sage-100" aria-hidden="true" />
          </div>

          <div>
            <label htmlFor="yape-phone" className="block font-sans text-xs font-semibold text-charcoal-soft mb-1.5">
              Número Yape <span className="text-gold-dark">*</span>
            </label>
            <div className="flex">
              <span className="flex items-center px-3 bg-sage-50 border border-r-0
                               border-sage-100 rounded-l-card font-sans text-sm text-charcoal-muted">
                🇵🇪 +51
              </span>
              <input
                id="yape-phone" type="tel" inputMode="numeric"
                value={yapePhone || ''} placeholder="999 999 999"
                onChange={e => onYapeChange(e.target.value.replace(/\D/g,'').slice(0,9))}
                className={`flex-1 px-3.5 py-2.5 font-sans text-sm text-charcoal font-mono
                            bg-white border rounded-r-card outline-none
                            focus:border-sage focus:ring-2 focus:ring-sage/10
                            placeholder:font-sans placeholder:text-charcoal-muted/50
                            ${errors.yapePhone ? 'border-red-400' : 'border-sage-100'}`}
              />
            </div>
            {errors.yapePhone && <p className="mt-1 font-sans text-[11px] text-red-500">{errors.yapePhone}</p>}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onBack}
                className="flex items-center gap-1.5 px-4 py-3 font-sans text-sm text-charcoal-soft
                           border border-charcoal/12 rounded-pill hover:bg-sage-50 hover:text-sage
                           transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage">
          <ArrowLeft size={15} aria-hidden="true" /> Volver
        </button>
        <button onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 py-3
                           bg-sage text-cream font-sans text-sm font-semibold
                           rounded-pill shadow-botanical
                           hover:bg-sage-dark hover:scale-[1.01] transition-all duration-300
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-sage">
          Revisar pedido <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

// ─── PASO 4: REVISIÓN FINAL ───────────────────────────────────────────────────

function StepReview({ cartItems, cartTotal, shippingData, paymentMethod, cardData, yapePhone, onBack, onCancel }) {
  const lastFour = (cardData.number || '').replace(/\s/g,'').slice(-4);

  return (
    <div className="animate-fade-in-up">
      <h3 className="font-display text-xl font-semibold text-charcoal mb-1">
        Confirmar pedido
      </h3>
      <p className="font-sans text-sm text-charcoal-muted mb-5">
        Revisa todo antes de finalizar tu compra
      </p>

      <div className="space-y-3 mb-6">
        {/* Productos */}
        <div className="p-4 bg-cream rounded-botanical border border-sage-100">
          <p className="font-sans text-xs font-semibold text-charcoal-muted tracking-wider
                        uppercase mb-3">Productos</p>
          {cartItems.map(item => (
            <div key={item.cartId} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-8 rounded flex-shrink-0"
                     style={{ background: `linear-gradient(145deg,${item.colorHex}EE,${item.colorHex}77)` }}
                     aria-hidden="true" />
                <div>
                  <p className="font-sans text-xs font-semibold text-charcoal leading-tight">
                    {item.formulaName}
                  </p>
                  <p className="font-sans text-[10px] text-charcoal-muted">
                    Cant. {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-sans text-sm font-semibold text-charcoal">
                S/. {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="border-t border-sage-100 mt-2 pt-2 flex justify-between">
            <span className="font-display text-sm font-semibold text-charcoal">Total</span>
            <span className="font-display text-sm font-semibold text-charcoal">S/. {cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Envío */}
        <div className="p-4 bg-cream rounded-botanical border border-sage-100">
          <p className="font-sans text-xs font-semibold text-charcoal-muted tracking-wider
                        uppercase mb-2">Envío</p>
          <p className="font-sans text-sm font-semibold text-charcoal">{shippingData.name}</p>
          <p className="font-sans text-xs text-charcoal-soft">{shippingData.address}</p>
          <p className="font-sans text-xs text-charcoal-soft">{shippingData.region}</p>
          {shippingData.reference && (
            <p className="font-sans text-xs text-charcoal-muted italic">{shippingData.reference}</p>
          )}
          <p className="font-sans text-xs text-charcoal-soft mt-0.5">
            {shippingData.phone} · {shippingData.email}
          </p>
        </div>

        {/* Pago */}
        <div className="p-4 bg-cream rounded-botanical border border-sage-100">
          <p className="font-sans text-xs font-semibold text-charcoal-muted tracking-wider
                        uppercase mb-2">Método de pago</p>
          {paymentMethod === 'card' ? (
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-sage" aria-hidden="true" />
              <p className="font-sans text-sm text-charcoal">
                Tarjeta terminada en <strong>·· {lastFour || 'XXXX'}</strong>
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Smartphone size={16} className="text-purple-600" aria-hidden="true" />
              <p className="font-sans text-sm text-charcoal">
                Yape · +51 {yapePhone}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nota: pago no habilitado */}
      <div className="flex items-start gap-2 p-3 bg-gold/10 border border-gold/25
                      rounded-botanical mb-4">
        <AlertCircle size={14} className="text-gold-dark flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="font-sans text-xs text-gold-dark leading-relaxed">
          <strong>Demo MVP:</strong> El módulo de pago está en construcción.
          Tu pedido quedará guardado pero no se procesará ningún cobro.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {/* Botón pagar — sin acción (MVP) */}
        <button
          aria-label="Pagar (módulo en construcción)"
          onClick={() => {/* no-op intencional: pago no habilitado en MVP */}}
          className="w-full flex items-center justify-center gap-2.5 py-4
                     bg-sage/50 text-cream font-sans text-base font-semibold
                     rounded-pill cursor-not-allowed opacity-70
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
        >
          <Lock size={16} aria-hidden="true" />
          Pagar S/. {cartTotal.toFixed(2)}
          <span className="font-sans text-xs font-normal opacity-75">(próximamente)</span>
        </button>

        <div className="flex gap-2">
          <button onClick={onBack}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5
                             font-sans text-sm text-charcoal-soft
                             border border-charcoal/12 rounded-pill
                             hover:bg-sage-50 hover:text-sage
                             transition-colors duration-200
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-sage">
            <ArrowLeft size={14} aria-hidden="true" /> Volver
          </button>
          <button onClick={onCancel}
                  className="flex-1 py-2.5 font-sans text-sm text-charcoal-muted
                             border border-charcoal/10 rounded-pill
                             hover:border-red-300 hover:text-red-500 hover:bg-red-50
                             transition-colors duration-200
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
            Cancelar pedido
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────

export default function Checkout({
  isOpen, onClose,
  cartItems, cartTotal,
  onRemove, onUpdateQty, onClear,
}) {
  const [step,          setStep]          = useState('cart');
  const [shippingData,  setShippingData]  = useState({});
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData,      setCardData]      = useState({});
  const [yapePhone,     setYapePhone]     = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const overlayRef = useRef(null);

  // Reset al abrir
  useEffect(() => {
    if (isOpen) { setStep('cart'); setShowCancelConfirm(false); }
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleShippingChange = useCallback((field, value) => {
    setShippingData(prev => ({ ...prev, [field]: value }));
  }, []);
  const handleCardChange = useCallback((field, value) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };
  const confirmCancel = () => {
    onClear();
    setShowCancelConfirm(false);
    onClose();
  };

  const goNext = () => {
    const order = ['cart','shipping','payment','review'];
    const idx = order.indexOf(step);
    if (idx < order.length - 1) setStep(order[idx + 1]);
  };
  const goBack = () => {
    const order = ['cart','shipping','payment','review'];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  };

  return (
    <>
      {/* ── OVERLAY ─────────────────────────────────────────────── */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-xs
                    transition-opacity duration-300
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* ── MODAL ───────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Checkout — proceso de pago"
        className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center
                    pointer-events-none`}
      >
        <div
          onClick={e => e.stopPropagation()}
          className={`pointer-events-auto w-full sm:max-w-lg
                      bg-cream rounded-t-2xl sm:rounded-2xl shadow-botanical-lg
                      flex flex-col max-h-[92vh] sm:max-h-[88vh]
                      transition-all duration-400 ease-out
                      ${isOpen
                        ? 'translate-y-0 opacity-100 scale-100'
                        : 'translate-y-full sm:translate-y-0 opacity-0 sm:scale-95'
                      }`}
        >
          {/* Header del modal */}
          <div className="flex items-center justify-between px-5 py-4
                          border-b border-sage-100 flex-shrink-0">
            <StepIndicator currentStep={step} />
            <button
              onClick={onClose}
              aria-label="Cerrar checkout"
              className="w-8 h-8 rounded-full flex items-center justify-center
                         text-charcoal-muted hover:bg-sage-50 hover:text-charcoal
                         transition-colors duration-200 ml-2
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Body scrollable */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            {step === 'cart' && (
              <StepCart
                cartItems={cartItems}
                cartTotal={cartTotal}
                onRemove={onRemove}
                onUpdateQty={onUpdateQty}
                onNext={goNext}
                onCancel={handleCancel}
              />
            )}
            {step === 'shipping' && (
              <StepShipping
                shippingData={shippingData}
                onChange={handleShippingChange}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 'payment' && (
              <StepPayment
                paymentMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
                cardData={cardData}
                onCardChange={handleCardChange}
                yapePhone={yapePhone}
                onYapeChange={setYapePhone}
                cartTotal={cartTotal}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 'review' && (
              <StepReview
                cartItems={cartItems}
                cartTotal={cartTotal}
                shippingData={shippingData}
                paymentMethod={paymentMethod}
                cardData={cardData}
                yapePhone={yapePhone}
                onBack={goBack}
                onCancel={handleCancel}
              />
            )}

            {/* Confirmación de cancelación */}
            {showCancelConfirm && (
              <div
                className="fixed inset-0 z-10 flex items-center justify-center p-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-white rounded-botanical shadow-botanical-lg border border-sage-100
                                p-5 max-w-xs w-full animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={18} className="text-red-500" aria-hidden="true" />
                    <p className="font-sans text-sm font-semibold text-charcoal">
                      ¿Cancelar el pedido?
                    </p>
                  </div>
                  <p className="font-sans text-xs text-charcoal-soft leading-relaxed mb-4">
                    Se eliminarán todos los productos de tu carrito. Esta acción no se puede deshacer.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={confirmCancel}
                      className="flex-1 py-2.5 bg-red-500 text-white font-sans text-sm
                                 font-semibold rounded-pill hover:bg-red-600
                                 transition-colors duration-200
                                 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      Sí, cancelar
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="flex-1 py-2.5 bg-white text-charcoal-soft font-sans text-sm
                                 font-medium rounded-pill border border-charcoal/15
                                 hover:bg-sage-50 transition-colors duration-200
                                 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                    >
                      Mantener
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
