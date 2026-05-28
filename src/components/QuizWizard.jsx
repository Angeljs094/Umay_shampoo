/**
 * @fileoverview QuizWizard – Flujo completo del quiz de personalización UMAY
 * Welcome → Preguntas → Skeleton AI → Resultado con carrito
 * @module components/QuizWizard
 */

import { useEffect, useRef } from 'react';
import {
  Leaf, Sparkles, ShoppingBag, RotateCcw,
  CheckCircle2, ArrowRight,
} from 'lucide-react';
import { QUIZ_STATES } from '@/types/quiz.js';

// ─── DESCRIPCIÓN DINÁMICA ─────────────────────────────────────────────────────

/**
 * Genera un párrafo descriptivo personalizado basado en los ingredientes y respuestas del quiz.
 */
function buildFormulaDescription(topIngredients, answers) {
  if (!topIngredients || topIngredients.length < 1) return '';

  const hairContextMap = {
    dry_scalp:  'cuero cabelludo seco e irritado',
    oily_scalp: 'cuero cabelludo con tendencia grasa',
    dandruff:   'cuero cabelludo con caspa y exceso de sebo',
    normal:     'cuero cabelludo normal en búsqueda de equilibrio',
  };
  const goalContextMap = {
    growth:     'estimular el crecimiento y densidad capilar',
    hydration:  'recuperar la hidratación profunda de cada hebra',
    shine:      'potenciar el brillo y la sedosidad natural',
    anti_frizz: 'controlar el frizz y definir la fibra capilar',
  };

  const reasonByGoal = {
    muna: {
      growth:     'estimula la microcirculación del folículo piloso acelerando el ciclo de crecimiento',
      hydration:  'equilibra el cuero cabelludo creando el ambiente ideal para retener humedad',
      shine:      'purifica el folículo removiendo impurezas que opacan el brillo natural',
      anti_frizz: 'regula el sebo del cuero cabelludo, reduciendo el exceso de aceite que causa frizz',
      default:    'aporta propiedades antimicrobianas y refrescantes únicas de los Andes peruanos',
    },
    sabila: {
      growth:     'acondiciona el cuero cabelludo y estabiliza el pH, condición esencial para el crecimiento',
      hydration:  'penetra la fibra capilar con polisacáridos que retienen hasta 1000 veces su peso en agua',
      shine:      'sella la cutícula del cabello, creando la superficie lisa que refleja la luz para dar brillo',
      anti_frizz: 'forma una barrera hidratante sobre cada hebra que bloquea la humedad ambiental causante del frizz',
      default:    'hidrata en profundidad y restaura el pH natural del cuero cabelludo',
    },
    arcillaVerde: {
      growth:     'desintoxica el folículo piloso de metales pesados y residuos que frenan el crecimiento',
      hydration:  'aporta minerales esenciales (sílice, magnesio) que mejoran la capacidad de hidratación',
      shine:      'limpia sin agredir la cutícula, dejando la fibra capilar suave y reflectante',
      anti_frizz: 'absorbe el exceso de sebo del cuero cabelludo evitando que pese y esponje el cabello',
      default:    'purifica profundamente y aporta minerales volcánicos andinos a la fibra capilar',
    },
    romero: {
      growth:     'inhibe la 5-alfa-reductasa (enzima ligada a la caída capilar) según estudios en Skinmed Journal',
      hydration:  'mejora la microcirculación del cuero cabelludo llevando nutrientes a la raíz',
      shine:      'actúa como antioxidante protegiendo la fibra capilar de daños ambientales que la opacan',
      anti_frizz: 'fortalece la corteza del cabello desde adentro, reduciendo la porosidad causante del frizz',
      default:    'estimula el folículo piloso con ácido rosmarínico y carnosol de alta potencia botánica',
    },
    karite: {
      growth:     'nutre el cuero cabelludo con ácidos grasos esenciales (oleico, esteárico) que alimentan el folículo',
      hydration:  'forma una barrera lipídica sobre el tallo del cabello que sella la humedad durante horas',
      shine:      'reviste cada hebra con una capa de lípidos naturales que aportan brillo y suavidad al tacto',
      anti_frizz: 'es el aliado definitivo contra el frizz: sella la cutícula con mantequilla natural de alta densidad',
      default:    'nutre intensamente con vitaminas A, E y F que restauran el cabello muy seco o rizado',
    },
    aceiteCocos: {
      growth:     'penetra el córtex capilar gracias a su bajo peso molecular, previniendo la pérdida de proteínas',
      hydration:  'es el único aceite vegetal que penetra el tallo (no solo lo recubre), hidratando desde dentro',
      shine:      'deposita una fina capa de ácido láurico sobre la fibra que genera un brillo intenso y vivo',
      anti_frizz: 'rellena las fisuras de la cutícula con ácido láurico, alisando la superficie y eliminando el frizz',
      default:    'penetra la fibra capilar aportando hidratación y brillo desde el interior del cabello',
    },
  };

  const hairCtx = hairContextMap[answers?.STEP_HAIR_TYPE] || 'tu perfil capilar único';
  const goalCtx = goalContextMap[answers?.STEP_GOAL]      || 'optimizar tu cabello';
  const goal    = answers?.STEP_GOAL || 'default';

  const ingredientLines = topIngredients.slice(0, 3).map((item, idx) => {
    const reason = reasonByGoal[item.id]?.[goal] || reasonByGoal[item.id]?.default || item.data.benefits[0];
    const rank   = ['como activo estrella', 'como complemento sinérgico', 'como potenciador final'][idx];
    return `la ${item.data.name} (${item.data.latin}) ${rank}, que ${reason}`;
  });

  const last    = ingredientLines.pop();
  const listStr = ingredientLines.length > 0
    ? ingredientLines.join('; ') + '; y ' + last
    : last;

  return `Diseñada específicamente para un ${hairCtx} con el objetivo de ${goalCtx}, esta fórmula integra ${listStr}. Los tres activos trabajan en cadena: el primero prepara el cuero cabelludo, el segundo actúa en la fibra capilar y el tercero sella y potencia el resultado.`;
}

// ─── SUBCOMPONENTES ───────────────────────────────────────────────────────────

function WelcomeScreen({ onStart }) {
  return (
    <div className="text-center py-10 animate-fade-in">
      <div className="inline-flex items-center justify-center
                       w-20 h-20 rounded-full bg-sage/10 mb-6 mx-auto">
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
          <circle cx="24" cy="24" r="24" fill="#2C4A3E" opacity="0.15" />
          <path d="M24 6 C32 10, 40 24, 24 42 C8 24, 16 10, 24 6Z" fill="#2C4A3E" opacity="0.7" />
          <line x1="24" y1="6" x2="24" y2="42" stroke="#FAF8F5" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="24" cy="18" r="2" fill="#C5A880" />
          <circle cx="24" cy="30" r="2" fill="#C5A880" />
        </svg>
      </div>
      <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal mb-3">
        Tu fórmula <span className="text-sage">única</span>
      </h2>
      <p className="font-sans text-base text-charcoal-soft max-w-sm mx-auto mb-2 leading-relaxed">
        Responde 3 preguntas y nuestro algoritmo botánico creará el shampoo
        sólido perfecto para tu cabello con activos reales de los Andes peruanos.
      </p>
      <p className="font-sans text-sm text-charcoal-muted mb-8">
        ✓ 60 segundos &nbsp;·&nbsp; ✓ 100% personalizado &nbsp;·&nbsp; ✓ Botánica andina
      </p>
      <button
        type="button"
        onClick={onStart}
        className="group inline-flex items-center gap-2.5
                   px-8 py-4 bg-sage text-cream
                   font-sans text-base font-semibold
                   rounded-pill shadow-botanical
                   transition-all duration-300
                   hover:bg-sage-dark hover:scale-[1.02] hover:shadow-botanical-lg
                   active:scale-[0.98]
                   focus:outline-none focus-visible:ring-2
                   focus-visible:ring-sage focus-visible:ring-offset-2"
      >
        Comenzar el análisis
        <ArrowRight size={18} aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
}

function QuestionScreen({ question, onAnswer, currentStep, totalSteps }) {
  const firstOptionRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => firstOptionRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [question.state]);

  return (
    <div key={question.state} className="animate-fade-in-up">
      {/* Barra de progreso */}
      <div className="mb-8" role="progressbar"
           aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-xs text-charcoal-muted">
            Pregunta {currentStep} de {totalSteps}
          </span>
          <span className="font-sans text-xs font-medium text-sage">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="h-1.5 bg-sage-50 rounded-full overflow-hidden">
          <div className="h-full bg-sage rounded-full transition-all duration-700 ease-out"
               style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal mb-2 leading-snug">
          {question.title}
        </h2>
        <p className="font-sans text-sm text-charcoal-muted">{question.subtitle}</p>
      </div>

      <fieldset>
        <legend className="sr-only">{question.title}</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((option, index) => (
            <button
              key={option.id}
              type="button"
              ref={index === 0 ? firstOptionRef : null}
              onClick={() => onAnswer(question.state, option.id)}
              style={{ animationDelay: `${index * 80}ms` }}
              className="group flex items-start gap-3.5 p-4 text-left
                         bg-white rounded-botanical border-2 border-sage-50
                         transition-all duration-300
                         hover:border-sage hover:shadow-botanical hover:bg-sage-50
                         active:scale-[0.98] active:border-sage
                         focus:outline-none focus-visible:ring-2
                         focus-visible:ring-sage focus-visible:ring-offset-1
                         opacity-0 animate-fade-in-up"
            >
              <span aria-hidden="true"
                    className="text-2xl flex-shrink-0 mt-0.5 transition-transform
                               duration-300 group-hover:scale-110">
                {option.emoji}
              </span>
              <div>
                <p className="font-sans text-sm font-semibold text-charcoal mb-0.5
                               group-hover:text-sage transition-colors duration-200">
                  {option.label}
                </p>
                <p className="font-sans text-xs text-charcoal-muted leading-relaxed">
                  {option.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div role="status" aria-label="Procesando tu fórmula botánica personalizada"
         className="text-center py-8 animate-fade-in">
      <div className="relative inline-flex items-center justify-center mb-8">
        <div className="w-24 h-24 rounded-full border-4 border-sage-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent
                        border-t-sage animate-spin"
             style={{ animationDuration: '1.2s' }} />
        <Leaf size={28} className="absolute text-sage animate-pulse" aria-hidden="true" />
      </div>
      <h2 className="font-display text-2xl font-semibold text-charcoal mb-2">
        Formulando tu mezcla
      </h2>
      <p className="font-sans text-sm text-charcoal-muted mb-10">
        Analizando tu perfil capilar con botánica andina...
      </p>
      <div className="max-w-xs mx-auto space-y-3 text-left">
        {[
          'Analizando tipo de cuero cabelludo',
          'Seleccionando activos botánicos',
          'Calculando concentraciones óptimas',
          'Generando fórmula personalizada',
        ].map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                             ${i < 3 ? 'bg-sage animate-pulse' : 'bg-sage-100'}`}
                 style={{ animationDelay: `${i * 500}ms` }}>
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <div className="h-3 rounded-full overflow-hidden flex-grow"
                 style={{
                   background: 'linear-gradient(90deg,#D6E8E2 25%,#AECFBF 50%,#D6E8E2 75%)',
                   backgroundSize: '1000px 100%',
                   animation: 'shimmer 1.8s infinite linear',
                 }}
                 aria-hidden="true" />
            <span className="sr-only">{step}</span>
          </div>
        ))}
      </div>
      <div className="inline-flex items-center gap-2 mt-8 px-3.5 py-1.5
                       bg-gold/10 border border-gold/20 rounded-pill animate-pulse-scale">
        <Sparkles size={12} className="text-gold-dark" aria-hidden="true" />
        <span className="font-sans text-xs font-medium text-gold-dark">
          Algoritmo Botánico UMAY
        </span>
      </div>
    </div>
  );
}

function ResultScreen({ result, cartItems, onAddToCart, onRestart }) {
  if (!result) return null;

  const { formulaName, tagline, topIngredients, colorHex, priceLabel, tier, answers } = result;

  const tierLabels = { base: 'Esencial', premium: 'Premium', deluxe: 'Deluxe' };
  const tierColors = {
    base:    'bg-sage-50 text-sage border-sage-100',
    premium: 'bg-gold/10 text-gold-dark border-gold/20',
    deluxe:  'bg-charcoal/5 text-charcoal border-charcoal/15',
  };

  // Derivar si ya está en carrito directamente desde cartItems
  const isAddedToCart = cartItems.some(i => i.formulaName === formulaName);

  const dynamicDescription = buildFormulaDescription(topIngredients, answers);

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5
                         bg-sage/10 border border-sage/15 rounded-pill mb-4">
          <CheckCircle2 size={13} className="text-sage" aria-hidden="true" />
          <span className="font-sans text-xs font-medium text-sage">
            Fórmula lista · Personalizada para ti
          </span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal mb-1">
          {formulaName}
        </h2>
        <p className="font-sans text-sm italic text-charcoal-muted">{tagline}</p>
      </div>

      {/* Barra de shampoo sólido */}
      <div className="flex justify-center mb-8"
           aria-label={`Barra de shampoo personalizada`}>
        <div className="relative group">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2
                          w-28 h-6 rounded-full blur-md opacity-25 transition-all duration-300
                          group-hover:opacity-35"
               style={{ background: colorHex }} />
          <div className="relative w-24 h-36 rounded-2xl shadow-botanical-lg overflow-hidden
                          transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
               style={{ background: `linear-gradient(145deg,${colorHex}EE,${colorHex}99,${colorHex}CC)` }}
               role="img">
            <div className="absolute inset-0 opacity-20"
                 style={{ background: 'linear-gradient(135deg,rgba(255,255,255,.6) 0%,transparent 50%,rgba(0,0,0,.1) 100%)' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <span className="font-display text-white/70 text-xs tracking-[.3em] font-semibold uppercase">UMAY</span>
              <div className="w-8 h-px bg-white/40" />
              <Leaf size={14} className="text-white/50" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 ingredientes */}
      <div className="mb-6">
        <p className="font-sans text-xs font-semibold text-charcoal-muted tracking-wider
                       uppercase mb-3 text-center">
          Activos principales seleccionados
        </p>
        <div className="grid grid-cols-3 gap-2">
          {topIngredients.map((item, index) => (
            <div key={item.id}
                 className="flex flex-col items-center gap-1.5 p-3
                            rounded-botanical border border-sage-50 bg-sage-50/50
                            transition-all duration-300 hover:bg-sage-50">
              <span aria-hidden="true" className="text-2xl">{item.data.icon}</span>
              <p className="font-sans text-[11px] font-semibold text-charcoal text-center leading-tight">
                {item.data.name.replace(' Andina', '').replace(' Virgen', '').replace(' Verde', '')}
              </p>
              <div className="w-full h-1 bg-sage-100 rounded-full overflow-hidden" aria-hidden="true">
                <div className="h-full rounded-full transition-all duration-1000"
                     style={{
                       width: `${[75, 55, 40][index]}%`,
                       background: item.data.color,
                       transitionDelay: `${index * 200}ms`,
                     }} />
              </div>
              <span className="font-sans text-[10px] text-charcoal-muted">{item.score} pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Descripción dinámica */}
      <div className="p-4 bg-cream rounded-botanical border border-sage-100 mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles size={12} className="text-gold-dark flex-shrink-0" aria-hidden="true" />
          <span className="font-sans text-[10px] font-semibold text-gold-dark uppercase tracking-wider">
            Por qué estos ingredientes
          </span>
        </div>
        <p className="font-sans text-sm text-charcoal-soft leading-relaxed mb-4">
          {dynamicDescription}
        </p>
        <div className="space-y-2.5 border-t border-sage-100 pt-3">
          {topIngredients.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-start gap-2.5">
              <span className="text-lg flex-shrink-0 mt-0.5" aria-hidden="true">{item.data.icon}</span>
              <div>
                <p className="font-sans text-[11px] font-semibold text-charcoal leading-tight">
                  {item.data.name}
                  <span className="font-normal text-charcoal-muted italic ml-1">· {item.data.latin}</span>
                </p>
                <p className="font-sans text-[11px] text-charcoal-muted leading-relaxed">
                  {item.data.benefits[0]}. {item.data.benefits[1]}.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Precio y tier */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="font-display text-3xl font-semibold text-charcoal">{priceLabel}</span>
          <p className="font-sans text-xs text-charcoal-muted">Barra de 90g · Uso natural</p>
        </div>
        <span className={`px-3 py-1 rounded-pill border font-sans text-xs font-semibold ${tierColors[tier]}`}>
          {tierLabels[tier]}
        </span>
      </div>

      {/* CTAs */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={isAddedToCart}
          aria-label={isAddedToCart ? 'Producto ya en el carrito' : 'Agregar al carrito'}
          className={`w-full flex items-center justify-center gap-2.5
                      py-4 rounded-pill font-sans text-base font-semibold
                      transition-all duration-300
                      focus:outline-none focus-visible:ring-2
                      focus-visible:ring-sage focus-visible:ring-offset-2
                      ${isAddedToCart
                        ? 'bg-sage-200 text-sage cursor-not-allowed'
                        : 'bg-sage text-cream hover:bg-sage-dark hover:scale-[1.02] active:scale-[0.98] shadow-botanical'
                      }`}
        >
          {isAddedToCart
            ? <><CheckCircle2 size={18} aria-hidden="true" />¡Agregado al carrito!</>
            : <><ShoppingBag size={18} aria-hidden="true" />Agregar al carrito</>
          }
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2
                     py-3 rounded-pill font-sans text-sm font-medium
                     text-charcoal-soft border border-charcoal/10
                     transition-all duration-250
                     hover:border-sage hover:text-sage hover:bg-sage-50
                     focus:outline-none focus-visible:ring-2
                     focus-visible:ring-sage focus-visible:ring-offset-2"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Recalcular mi fórmula
        </button>
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────

export default function QuizWizard({ quiz }) {
  const {
    currentState, result, cartItems,
    currentQuestion, totalSteps, currentStep,
    startQuiz, selectAnswer, addToCart, restartQuiz,
  } = quiz;

  const handleAddToCart = () => {
    if (!result) return;
    addToCart(result);
  };

  return (
    <section id="quiz" aria-labelledby="quiz-heading" className="py-24 sm:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5
                           bg-sage/10 border border-sage/15 rounded-pill mb-5">
            <Sparkles size={12} className="text-sage" aria-hidden="true" />
            <span className="font-sans text-xs font-medium text-sage tracking-wider uppercase">
              Diagnóstico Capilar
            </span>
          </div>
          <h2 id="quiz-heading"
              className="font-display text-hero-sm font-semibold text-charcoal mb-3">
            Fórmula hecha <span className="text-sage">para ti</span>
          </h2>
          <p className="font-sans text-base text-charcoal-soft">
            Responde 3 preguntas. El algoritmo botánico UMAY seleccionará los
            ingredientes ideales en proporciones exactas para tu cabello.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-botanical shadow-botanical-lg
                          border border-sage-50 p-6 sm:p-8">
            {currentState === QUIZ_STATES.WELCOME && (
              <WelcomeScreen onStart={startQuiz} />
            )}
            {[QUIZ_STATES.STEP_HAIR_TYPE, QUIZ_STATES.STEP_GOAL, QUIZ_STATES.STEP_SCENT]
              .includes(currentState) && currentQuestion && (
              <QuestionScreen
                question={currentQuestion}
                onAnswer={selectAnswer}
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
            )}
            {currentState === QUIZ_STATES.LOADING_AI && <LoadingScreen />}
            {currentState === QUIZ_STATES.RESULT && (
              <ResultScreen
                result={result}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onRestart={restartQuiz}
              />
            )}
          </div>
          <p className="text-center font-sans text-xs text-charcoal-muted mt-4">
            🔒 Sin registro requerido · Tu resultado se guarda automáticamente
          </p>
        </div>
      </div>
    </section>
  );
}
