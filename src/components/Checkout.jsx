/**
 * @fileoverview Checkout – Flujo multi-paso de compra UMAY
 * Pasos: cart → shipping → payment → review
 * El botón "Pagar" es un no-op intencional (MVP — pago no habilitado).
 * @param {{ isOpen, onClose, cartItems, cartTotal, onRemove, onUpdateQty, onClear }} props
 */

import { useState, useEffect, useCallback } from 'react';
import {
  X, ShoppingBag, MapPin, CreditCard, CheckCircle2,
  ArrowRight, ArrowLeft, Trash2, Plus, Minus,
  Smartphone, Leaf, AlertTriangle, Lock,
} from 'lucide-react';

// ─── DATOS ────────────────────────────────────────────────────────────────────

const PERU_REGIONS = [
  'Amazonas','Áncash','Apurímac','Arequipa','Ayacucho','Cajamarca',
  'Callao','Cusco','Huancavelica','Huánuco','Ica','Junín',
  'La Libertad','Lambayeque','Lima','Loreto','Madre de Dios',
  'Moquegua','Pasco','Piura','Puno','San Martín','Tacna','Tumbes','Ucayali',
];

const STEPS = [
  { id: 'cart',     label: 'Carrito',   Icon: ShoppingBag },
  { id: 'shipping', label: 'Envío',     Icon: MapPin },
  { id: 'payment',  label: 'Pago',      Icon: CreditCard },
  { id: 'review',   label: 'Revisión',  Icon: CheckCircle2 },
];

const EMPTY_SHIPPING = { name: '', phone: '', email: '', address: '', region: '', reference: '' };
const EMPTY_CARD     = { number: '', expiry: '', cvv: '', holder: '' };

// ─── INDICADOR DE PASOS ───────────────────────────────────────────────────────

function StepIndicator({ currentStep }) {
  const currentIdx = STEPS.findIndex(s => s.id === currentStep);
  return (
    <div className="flex items-center justify-between px-2 py-4" role="list" aria-label="Pasos del checkout">
      {STEPS.map((step, idx) => {
        const done    = idx < currentIdx;
        const active  = idx === currentIdx;
        const { Icon } = step;
        return (
          <div key={step.id} className="flex items-center flex-1" role="listitem">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                              transition-all duration-300
                              ${done   ? 'bg-sage text-cream'
                              : active ? 'bg-sage text-cream ring-4 ring-sage/20'
                              :          'bg-sage-100 text-sage-light'}`}>
                {done
                  ? <CheckCircle2 size={14} aria-hidden="true" />
                  : <Icon size={14} aria-hidden="true" />
                }
              </div>
              <span className={`font-sans text-[10px] font-medium hidden sm:block
                               ${active ? 'text-sage' : done ? 'text-sage-light' : 'text-charcoal-muted'}`}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-300
                               ${done ? 'bg-sage' : 'bg-sage-100'}`}
                   aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── PASO 1: CARRITO ─────────────────────────────────────────────────────────

function StepCart({ cartItems, cartTotal, onRemove, onUpdateQty, onClear, onNext, onCancel }) {
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {cartItems.map((item) => (
          <div key={item.cartId}
               className="flex gap-3 p-3.5 bg-white rounded-botanical border border-sage-50 shadow-card">
            <div className="w-10 h-14 rounded-xl flex-shrink-0 flex items-center justify-center"
                 style={{ background: `linear-gradient(145deg, ${item.colorHex}EE, ${item.colorHex}88)` }}
                 aria-hidden="true">
              <Leaf size={12} className="text-white/60" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-sans text-sm font-semibold text-charcoal leading-tight">{item.formulaName}</p>
                <button onClick={() => onRemove(item.cartId)} aria-label={`Eliminar ${item.formulaName}`}
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                                   text-charcoal-muted hover:bg-red-50 hover:text-red-500
                                   transition-colors duration-200">
                  <Trash2 size={12} aria-hidden="true" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {item.topIngredients.slice(0, 3).map(ingr => (
                  <span key={ingr.id} className="font-sans text-[10px] px-1.5 py-0.5
                                                  bg-sage-50 text-sage rounded border border-sage-100">
                    {ingr.data.icon} {ingr.data.name.split(' ')[0]}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-semibold text-charcoal">
                  S/. {(item.price * item.quantity).toFixed(2)}
                </p>
                <div className="flex items-center gap-1 bg-sage-50 rounded-pill px-1 py-0.5">
                  <button onClick={() => onUpdateQty(item.cartId, -1)} disabled={item.quantity <= 1}
                          aria-label="Disminuir cantidad"
                          className="w-5 h-5 rounded-full flex items-center justify-center
                                     text-sage hover:bg-sage hover:text-cream
                                     disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <Minus size={10} aria-hidden="true" />
                  </button>
                  <span className="font-sans text-xs font-semibold text-charcoal min-w-[16px] text-center">
                    {item.quantity}
                  </span>
                  <button onClick={() => onUpdateQty(item.cartId, 1)} aria-label="Aumentar cantidad"
                          className="w-5 h-5 rounded-full flex items-center justify-center
                                     text-sage hover:bg-sage hover:text-cream transition-colors">
                    <Plus size={10} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 px-5 py-4 border-t border-sage-100 space-y-3">
        {/* Total */}
        <div className="space-y-1">
          <div className="flex justify-between font-sans text-sm text-charcoal-soft">
            <span>Subtotal</span><span>S/. {cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-sans text-sm text-charcoal-soft">
            <span>Envío</span><span className="text-sage font-medium">Gratis 🌿</span>
          </div>
          <div className="h-px bg-sage-100" />
          <div className="flex justify-between font-display text-base font-semibold text-charcoal">
            <span>Total</span><span>S/. {cartTotal.toFixed(2)}</span>
          </div>
        </div>
        <button onClick={onNext}
                className="w-full flex items-center justify-center gap-2.5 py-3.5
                           bg-sage text-cream font-sans text-sm font-semibold
                           rounded-pill shadow-botanical transition-all duration-300
                           hover:bg-sage-dark hover:scale-[1.01] active:scale-[0.99]
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-sage">
          Continuar al envío <ArrowRight size={16} aria-hidden="true" />
        </button>
        {!confirmClear ? (
          <button onClick={() => setConfirmClear(true)}
                  className="w-full py-2.5 font-sans text-xs text-charcoal-muted
                             border border-dashed border-charcoal/15 rounded-botanical
                             hover:border-red-300 hover:text-red-500 transition-colors">
            Cancelar pedido
          </button>
        ) : (
          <div className="p-3 bg-red-50 border border-red-100 rounded-botanical">
            <p className="font-sans text-xs text-red-700 font-medium mb-2">¿Cancelar el pedido y vaciar el carrito?</p>
            <div className="flex gap-2">
              <button onClick={onCancel}
                      className="flex-1 py-1.5 bg-red-500 text-white font-sans text-xs
                                 font-semibold rounded-pill hover:bg-red-600 transition-colors">
                Sí, cancelar
              </button>
              <button onClick={() => setConfirmClear(false)}
                      className="flex-1 py-1.5 bg-white text-charcoal-soft font-sans text-xs
                                 font-medium rounded-pill border border-charcoal/15
                                 hover:bg-sage-50 transition-colors">
                Mantener
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PASO 2: ENVÍO ────────────────────────────────────────────────────────────

function StepShipping({ shipping, setShipping, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!shipping.name.trim())    e.name    = 'Requerido';
    if (!shipping.phone.trim() || !/^\d{9}$/.test(shipping.phone.trim())) e.phone = 'Ingresa 9 dígitos';
    if (!shipping.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) e.email = 'Email inválido';
    if (!shipping.address.trim()) e.address = 'Requerido';
    if (!shipping.region)         e.region  = 'Selecciona una región';
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onNext();
  };

  const field = (id, label, placeholder, type = 'text') => (
    <div>
      <label htmlFor={id} className="block font-sans text-xs font-medium text-charcoal mb-1.5">
        {label} <span className="text-red-400">*</span>
      </label>
      <input
        id={id} type={type} placeholder={placeholder}
        value={shipping[id]}
        onChange={(e) => { setShipping(s => ({ ...s, [id]: e.target.value })); setErrors(er => ({ ...er, [id]: undefined })); }}
        className={`w-full px-3.5 py-2.5 rounded-card border font-sans text-sm
                    bg-white text-charcoal placeholder-charcoal-muted/50
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent
                    ${errors[id] ? 'border-red-300 bg-red-50' : 'border-sage-100'}`}
      />
      {errors[id] && <p className="font-sans text-[11px] text-red-500 mt-1">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <h3 className="font-display text-base font-semibold text-charcoal">Datos de envío</h3>
        {field('name',    'Nombre completo',    'Ej: María García López')}
        {field('phone',   'Teléfono',           '999 999 999', 'tel')}
        {field('email',   'Correo electrónico', 'tu@correo.com', 'email')}
        {field('address', 'Dirección completa', 'Av. Principal 123, Dpto 4B')}

        <div>
          <label htmlFor="region" className="block font-sans text-xs font-medium text-charcoal mb-1.5">
            Región <span className="text-red-400">*</span>
          </label>
          <select
            id="region"
            value={shipping.region}
            onChange={(e) => { setShipping(s => ({ ...s, region: e.target.value })); setErrors(er => ({ ...er, region: undefined })); }}
            className={`w-full px-3.5 py-2.5 rounded-card border font-sans text-sm
                        bg-white text-charcoal transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent
                        ${errors.region ? 'border-red-300 bg-red-50' : 'border-sage-100'}`}
          >
            <option value="">Selecciona tu región</option>
            {PERU_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.region && <p className="font-sans text-[11px] text-red-500 mt-1">{errors.region}</p>}
        </div>

        <div>
          <label htmlFor="reference" className="block font-sans text-xs font-medium text-charcoal mb-1.5">
            Referencia <span className="text-charcoal-muted font-normal">(opcional)</span>
          </label>
          <input
            id="reference" type="text" placeholder="Cerca al parque, casa azul..."
            value={shipping.reference}
            onChange={(e) => setShipping(s => ({ ...s, reference: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-card border border-sage-100 font-sans text-sm
                       bg-white text-charcoal placeholder-charcoal-muted/50
                       focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-shrink-0 px-5 py-4 border-t border-sage-100 space-y-2">
        <button onClick={handleNext}
                className="w-full flex items-center justify-center gap-2.5 py-3.5
                           bg-sage text-cream font-sans text-sm font-semibold
                           rounded-pill shadow-botanical transition-all duration-300
                           hover:bg-sage-dark hover:scale-[1.01] active:scale-[0.99]
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-sage">
          Continuar al pago <ArrowRight size={16} aria-hidden="true" />
        </button>
        <button onClick={onBack}
                className="w-full flex items-center justify-center gap-2 py-2.5
                           font-sans text-xs text-charcoal-muted border border-charcoal/10
                           rounded-pill hover:border-sage hover:text-sage transition-colors">
          <ArrowLeft size={14} aria-hidden="true" /> Volver al carrito
        </button>
      </div>
    </div>
  );
}

// ─── PASO 3: PAGO ─────────────────────────────────────────────────────────────

function StepPayment({ payMethod, setPayMethod, cardData, setCardData, yapePhone, setYapePhone, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const formatCardNumber = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
  const formatExpiry     = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
  };

  const validate = () => {
    const e = {};
    if (payMethod === 'card') {
      if (!cardData.number || cardData.number.replace(/\s/g, '').length < 16) e.number = 'Número inválido';
      if (!cardData.expiry || cardData.expiry.length < 5)  e.expiry = 'Fecha inválida';
      if (!cardData.cvv   || cardData.cvv.length < 3)      e.cvv    = 'CVV inválido';
      if (!cardData.holder.trim())                          e.holder = 'Requerido';
    } else {
      if (!yapePhone || !/^\d{9}$/.test(yapePhone)) e.yapePhone = 'Ingresa 9 dígitos';
    }
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onNext();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <h3 className="font-display text-base font-semibold text-charcoal mb-4">Método de pago</h3>

        {/* Selector */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { id: 'card',  label: 'Tarjeta',  Icon: CreditCard,  accent: '#1D4ED8' },
            { id: 'yape',  label: 'Yape',     Icon: Smartphone,   accent: '#6B21A8' },
          ].map(({ id, label, Icon, accent }) => (
            <button key={id} type="button" onClick={() => { setPayMethod(id); setErrors({}); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-botanical border-2
                                transition-all duration-200
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
                                ${payMethod === id
                                  ? 'border-current shadow-botanical'
                                  : 'border-sage-100 hover:border-sage-200 text-charcoal-muted'
                                }`}
                    style={payMethod === id ? { color: accent, borderColor: accent } : {}}>
              <Icon size={22} aria-hidden="true" />
              <span className="font-sans text-xs font-semibold">{label}</span>
            </button>
          ))}
        </div>

        {/* Formulario tarjeta */}
        {payMethod === 'card' && (
          <div className="space-y-3 animate-fade-in">
            <div>
              <label htmlFor="cardNumber" className="block font-sans text-xs font-medium text-charcoal mb-1.5">
                Número de tarjeta
              </label>
              <input id="cardNumber" type="text" placeholder="0000 0000 0000 0000"
                     value={cardData.number}
                     onChange={(e) => { setCardData(d => ({ ...d, number: formatCardNumber(e.target.value) })); setErrors(er => ({ ...er, number: undefined })); }}
                     className={`w-full px-3.5 py-2.5 rounded-card border font-sans text-sm
                                 font-mono tracking-widest bg-white text-charcoal
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 ${errors.number ? 'border-red-300 bg-red-50' : 'border-sage-100'}`} />
              {errors.number && <p className="font-sans text-[11px] text-red-500 mt-1">{errors.number}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="expiry" className="block font-sans text-xs font-medium text-charcoal mb-1.5">Vencimiento</label>
                <input id="expiry" type="text" placeholder="MM/AA"
                       value={cardData.expiry}
                       onChange={(e) => { setCardData(d => ({ ...d, expiry: formatExpiry(e.target.value) })); setErrors(er => ({ ...er, expiry: undefined })); }}
                       className={`w-full px-3.5 py-2.5 rounded-card border font-sans text-sm font-mono
                                   bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                   ${errors.expiry ? 'border-red-300 bg-red-50' : 'border-sage-100'}`} />
                {errors.expiry && <p className="font-sans text-[11px] text-red-500 mt-1">{errors.expiry}</p>}
              </div>
              <div>
                <label htmlFor="cvv" className="block font-sans text-xs font-medium text-charcoal mb-1.5">CVV</label>
                <input id="cvv" type="text" placeholder="123"
                       value={cardData.cvv}
                       onChange={(e) => { setCardData(d => ({ ...d, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })); setErrors(er => ({ ...er, cvv: undefined })); }}
                       className={`w-full px-3.5 py-2.5 rounded-card border font-sans text-sm font-mono
                                   bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                   ${errors.cvv ? 'border-red-300 bg-red-50' : 'border-sage-100'}`} />
                {errors.cvv && <p className="font-sans text-[11px] text-red-500 mt-1">{errors.cvv}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="holder" className="block font-sans text-xs font-medium text-charcoal mb-1.5">Nombre en la tarjeta</label>
              <input id="holder" type="text" placeholder="NOMBRE APELLIDO"
                     value={cardData.holder}
                     onChange={(e) => { setCardData(d => ({ ...d, holder: e.target.value.toUpperCase() })); setErrors(er => ({ ...er, holder: undefined })); }}
                     className={`w-full px-3.5 py-2.5 rounded-card border font-sans text-sm
                                 bg-white text-charcoal uppercase tracking-wider
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 ${errors.holder ? 'border-red-300 bg-red-50' : 'border-sage-100'}`} />
              {errors.holder && <p className="font-sans text-[11px] text-red-500 mt-1">{errors.holder}</p>}
            </div>
          </div>
        )}

        {/* Yape */}
        {payMethod === 'yape' && (
          <div className="animate-fade-in">
            <div className="flex justify-center mb-5">
              <div className="p-4 bg-purple-50 rounded-botanical border border-purple-100">
                {/* QR mock SVG */}
                <svg width="140" height="140" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" aria-label="Código QR de Yape (demo)">
                  <rect width="140" height="140" fill="white" />
                  {/* Corner squares */}
                  <rect x="10" y="10" width="35" height="35" fill="none" stroke="#6B21A8" strokeWidth="4" />
                  <rect x="16" y="16" width="23" height="23" fill="#6B21A8" />
                  <rect x="95" y="10" width="35" height="35" fill="none" stroke="#6B21A8" strokeWidth="4" />
                  <rect x="101" y="16" width="23" height="23" fill="#6B21A8" />
                  <rect x="10" y="95" width="35" height="35" fill="none" stroke="#6B21A8" strokeWidth="4" />
                  <rect x="16" y="101" width="23" height="23" fill="#6B21A8" />
                  {/* Data dots */}
                  {[55,65,75,85,55,75,55,65,85,65,75,85,55,65,75,85].map((x, i) => (
                    <rect key={i} x={x} y={10 + (i % 8) * 8} width="6" height="6" fill="#6B21A8" opacity={i % 3 === 0 ? 1 : 0.5} />
                  ))}
                  {[10,20,30,40,50,60,70,80,90].map((y, i) => (
                    <rect key={`r${i}`} x={55 + (i % 4) * 10} y={y} width="6" height="6" fill="#6B21A8" opacity={i % 2 === 0 ? 1 : 0.4} />
                  ))}
                  {/* Logo Yape */}
                  <rect x="58" y="58" width="24" height="24" rx="4" fill="#6B21A8" />
                  <text x="70" y="74" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="sans-serif">Y</text>
                </svg>
              </div>
            </div>
            <p className="font-sans text-xs text-center text-charcoal-muted mb-3">
              Escanea el código o ingresa tu número Yape
            </p>
            <div>
              <label htmlFor="yapePhone" className="block font-sans text-xs font-medium text-charcoal mb-1.5">
                Número Yape <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-2.5 bg-sage-50
                                rounded-card border border-sage-100 flex-shrink-0">
                  <span aria-hidden="true">🇵🇪</span>
                  <span className="font-sans text-sm text-charcoal font-medium">+51</span>
                </div>
                <input id="yapePhone" type="tel" placeholder="999 999 999"
                       value={yapePhone}
                       onChange={(e) => { setYapePhone(e.target.value.replace(/\D/g, '').slice(0, 9)); setErrors(er => ({ ...er, yapePhone: undefined })); }}
                       className={`flex-1 px-3.5 py-2.5 rounded-card border font-sans text-sm font-mono
                                   bg-white text-charcoal
                                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                   ${errors.yapePhone ? 'border-red-300 bg-red-50' : 'border-sage-100'}`} />
              </div>
              {errors.yapePhone && <p className="font-sans text-[11px] text-red-500 mt-1">{errors.yapePhone}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 px-5 py-4 border-t border-sage-100 space-y-2">
        <button onClick={handleNext}
                className="w-full flex items-center justify-center gap-2.5 py-3.5
                           bg-sage text-cream font-sans text-sm font-semibold
                           rounded-pill shadow-botanical transition-all duration-300
                           hover:bg-sage-dark hover:scale-[1.01] active:scale-[0.99]
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-sage">
          Revisar pedido <ArrowRight size={16} aria-hidden="true" />
        </button>
        <button onClick={onBack}
                className="w-full flex items-center justify-center gap-2 py-2.5
                           font-sans text-xs text-charcoal-muted border border-charcoal/10
                           rounded-pill hover:border-sage hover:text-sage transition-colors">
          <ArrowLeft size={14} aria-hidden="true" /> Volver al envío
        </button>
      </div>
    </div>
  );
}

// ─── PASO 4: REVISIÓN ─────────────────────────────────────────────────────────

function StepReview({ cartItems, cartTotal, shipping, payMethod, cardData, yapePhone, onBack, onCancel }) {
  const [confirmCancel, setConfirmCancel] = useState(false);

  const payLabel = payMethod === 'card'
    ? `Tarjeta ···· ${cardData.number.slice(-4) || '????'}`
    : `Yape +51 ${yapePhone || '?????????'}`;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

        {/* Banner MVP */}
        <div className="flex items-start gap-3 p-3.5 bg-gold/10 border border-gold/30 rounded-botanical">
          <AlertTriangle size={16} className="text-gold-dark flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-sans text-xs font-semibold text-gold-dark">Demo MVP</p>
            <p className="font-sans text-xs text-charcoal-muted">
              El módulo de pago está en construcción. El botón "Pagar" aún no procesa transacciones.
            </p>
          </div>
        </div>

        {/* Productos */}
        <div>
          <p className="font-sans text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">
            Productos
          </p>
          <div className="space-y-2">
            {cartItems.map(item => (
              <div key={item.cartId}
                   className="flex items-center justify-between p-3 bg-white rounded-card
                              border border-sage-50 shadow-card">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-10 rounded-lg flex-shrink-0"
                       style={{ background: `linear-gradient(145deg, ${item.colorHex}EE, ${item.colorHex}88)` }}
                       aria-hidden="true" />
                  <div>
                    <p className="font-sans text-xs font-semibold text-charcoal leading-tight">{item.formulaName}</p>
                    <p className="font-sans text-[10px] text-charcoal-muted">×{item.quantity}</p>
                  </div>
                </div>
                <p className="font-display text-sm font-semibold text-charcoal">
                  S/. {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Envío */}
        <div>
          <p className="font-sans text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">
            Dirección de envío
          </p>
          <div className="p-3 bg-white rounded-card border border-sage-50 shadow-card space-y-0.5">
            <p className="font-sans text-sm font-semibold text-charcoal">{shipping.name}</p>
            <p className="font-sans text-xs text-charcoal-soft">{shipping.address}</p>
            <p className="font-sans text-xs text-charcoal-soft">{shipping.region}</p>
            {shipping.reference && <p className="font-sans text-xs text-charcoal-muted italic">{shipping.reference}</p>}
            <p className="font-sans text-xs text-charcoal-muted">{shipping.phone} · {shipping.email}</p>
          </div>
        </div>

        {/* Pago */}
        <div>
          <p className="font-sans text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">
            Método de pago
          </p>
          <div className="p-3 bg-white rounded-card border border-sage-50 shadow-card flex items-center gap-2">
            {payMethod === 'card'
              ? <CreditCard size={16} className="text-blue-600" aria-hidden="true" />
              : <Smartphone size={16} className="text-purple-600" aria-hidden="true" />
            }
            <p className="font-sans text-sm text-charcoal">{payLabel}</p>
          </div>
        </div>

        {/* Total */}
        <div className="p-3 bg-sage-50 rounded-card border border-sage-100">
          <div className="flex justify-between font-sans text-sm text-charcoal-soft mb-1">
            <span>Subtotal</span><span>S/. {cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-sans text-sm text-charcoal-soft mb-2">
            <span>Envío</span><span className="text-sage font-medium">Gratis</span>
          </div>
          <div className="flex justify-between font-display text-base font-semibold text-charcoal">
            <span>Total</span><span>S/. {cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 px-5 py-4 border-t border-sage-100 space-y-2">
        {/* Botón Pagar — no-op intencional MVP */}
        <button
          type="button"
          onClick={() => { /* no-op intencional: pago no habilitado en MVP */ }}
          aria-disabled="true"
          className="w-full flex items-center justify-center gap-2.5 py-4
                     bg-sage/70 text-cream/80 font-sans text-sm font-semibold
                     rounded-pill cursor-not-allowed opacity-70
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
        >
          <Lock size={16} aria-hidden="true" />
          Pagar S/. {cartTotal.toFixed(2)} · Próximamente
        </button>

        <button onClick={onBack}
                className="w-full flex items-center justify-center gap-2 py-2.5
                           font-sans text-xs text-charcoal-muted border border-charcoal/10
                           rounded-pill hover:border-sage hover:text-sage transition-colors">
          <ArrowLeft size={14} aria-hidden="true" /> Volver al pago
        </button>

        {!confirmCancel ? (
          <button onClick={() => setConfirmCancel(true)}
                  className="w-full py-2 font-sans text-xs text-charcoal-muted/60
                             hover:text-red-400 transition-colors">
            Cancelar pedido
          </button>
        ) : (
          <div className="p-3 bg-red-50 border border-red-100 rounded-botanical">
            <p className="font-sans text-xs text-red-700 font-medium mb-2">¿Cancelar y vaciar el carrito?</p>
            <div className="flex gap-2">
              <button onClick={onCancel}
                      className="flex-1 py-1.5 bg-red-500 text-white font-sans text-xs
                                 font-semibold rounded-pill hover:bg-red-600 transition-colors">
                Sí, cancelar
              </button>
              <button onClick={() => setConfirmCancel(false)}
                      className="flex-1 py-1.5 bg-white text-charcoal-soft font-sans text-xs
                                 font-medium rounded-pill border border-charcoal/15
                                 hover:bg-sage-50 transition-colors">
                Mantener
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────

export default function Checkout({ isOpen, onClose, cartItems, cartTotal, onRemove, onUpdateQty, onClear }) {
  const [step,       setStep]       = useState('cart');
  const [shipping,   setShipping]   = useState(EMPTY_SHIPPING);
  const [payMethod,  setPayMethod]  = useState('card');
  const [cardData,   setCardData]   = useState(EMPTY_CARD);
  const [yapePhone,  setYapePhone]  = useState('');

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Reset al cerrar
  useEffect(() => {
    if (!isOpen) {
      setStep('cart');
      setShipping(EMPTY_SHIPPING);
      setCardData(EMPTY_CARD);
      setYapePhone('');
      setPayMethod('card');
    }
  }, [isOpen]);

  const handleCancel = useCallback(() => {
    onClear();
    onClose();
  }, [onClear, onClose]);

  const stepTitle = {
    cart:     'Tu pedido',
    shipping: 'Datos de envío',
    payment:  'Método de pago',
    review:   'Revisar pedido',
  }[step];

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-charcoal/50 backdrop-blur-xs
                    transition-opacity duration-300
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        className={`fixed inset-x-0 bottom-0 sm:inset-auto sm:right-4 sm:top-4 sm:bottom-4
                    z-50 sm:w-[480px]
                    bg-cream flex flex-col
                    rounded-t-2xl sm:rounded-botanical shadow-botanical-lg
                    transition-all duration-300 ease-in-out
                    ${isOpen
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-full sm:translate-y-0 sm:translate-x-full opacity-0'
                    }`}
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2 flex-shrink-0">
          <h2 className="font-display text-lg font-semibold text-charcoal">{stepTitle}</h2>
          <button onClick={onClose} aria-label="Cerrar checkout"
                  className="w-8 h-8 rounded-full flex items-center justify-center
                             text-charcoal-muted hover:bg-sage-50 hover:text-charcoal
                             transition-colors duration-200
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-sage">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-3 flex-shrink-0">
          <StepIndicator currentStep={step} />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {step === 'cart' && (
            <StepCart
              cartItems={cartItems} cartTotal={cartTotal}
              onRemove={onRemove} onUpdateQty={onUpdateQty}
              onNext={() => setStep('shipping')}
              onCancel={handleCancel}
            />
          )}
          {step === 'shipping' && (
            <StepShipping
              shipping={shipping} setShipping={setShipping}
              onNext={() => setStep('payment')}
              onBack={() => setStep('cart')}
            />
          )}
          {step === 'payment' && (
            <StepPayment
              payMethod={payMethod} setPayMethod={setPayMethod}
              cardData={cardData}   setCardData={setCardData}
              yapePhone={yapePhone} setYapePhone={setYapePhone}
              onNext={() => setStep('review')}
              onBack={() => setStep('shipping')}
            />
          )}
          {step === 'review' && (
            <StepReview
              cartItems={cartItems} cartTotal={cartTotal}
              shipping={shipping} payMethod={payMethod}
              cardData={cardData} yapePhone={yapePhone}
              onBack={() => setStep('payment')}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </>
  );
}
