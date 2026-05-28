/**
 * @fileoverview Hook personalizado: useShampooQuiz
 *
 * FSM del quiz + gestión completa del carrito de compras.
 * El carrito almacena items con su fórmula completa, cantidad y precio.
 *
 * @module hooks/useShampooQuiz
 */

import { useReducer, useCallback, useEffect } from 'react';
import { QUIZ_STATES, QUIZ_QUESTIONS } from '@/types/quiz.js';
import { computeFormula, serializeFormula, deserializeFormula } from '@/utils/recommendationEngine.js';

const STORAGE_KEY   = 'umay_formula_result';
const ANSWERS_KEY   = 'umay_quiz_answers';
const CART_KEY      = 'umay_cart_items';

// ─── ESTADO INICIAL ───────────────────────────────────────────────────────────

/**
 * @typedef {Object} CartItem
 * @property {string}   cartId       - ID único del item en el carrito (timestamp)
 * @property {string}   formulaName  - Nombre de la fórmula
 * @property {string}   tagline      - Tagline de la fórmula
 * @property {string}   colorHex     - Color de la barra de shampoo
 * @property {number}   price        - Precio unitario
 * @property {string}   priceLabel   - Precio formateado
 * @property {string}   tier         - Tier: base | premium | deluxe
 * @property {Array}    topIngredients - Los 3 ingredientes top
 * @property {Object}   answers      - Respuestas del quiz
 * @property {number}   quantity     - Cantidad de unidades
 */

/** @type {{ currentState: string, answers: Object, result: Object|null, cartItems: CartItem[], isAnimating: boolean }} */
const INITIAL_STATE = {
  currentState: QUIZ_STATES.WELCOME,
  answers:      {},
  result:       null,
  cartItems:    [],
  isAnimating:  false,
};

// ─── ACCIONES ─────────────────────────────────────────────────────────────────

const A = {
  START_QUIZ:        'START_QUIZ',
  SELECT_ANSWER:     'SELECT_ANSWER',
  SET_RESULT:        'SET_RESULT',
  ADD_TO_CART:       'ADD_TO_CART',
  REMOVE_FROM_CART:  'REMOVE_FROM_CART',
  UPDATE_QTY:        'UPDATE_QTY',
  CLEAR_CART:        'CLEAR_CART',
  RESTART_QUIZ:      'RESTART_QUIZ',
  SET_ANIMATING:     'SET_ANIMATING',
};

// ─── TABLA DE TRANSICIONES FSM ────────────────────────────────────────────────

const STATE_TRANSITIONS = {
  [QUIZ_STATES.WELCOME]:        QUIZ_STATES.STEP_HAIR_TYPE,
  [QUIZ_STATES.STEP_HAIR_TYPE]: QUIZ_STATES.STEP_GOAL,
  [QUIZ_STATES.STEP_GOAL]:      QUIZ_STATES.STEP_SCENT,
  [QUIZ_STATES.STEP_SCENT]:     QUIZ_STATES.LOADING_AI,
  [QUIZ_STATES.LOADING_AI]:     QUIZ_STATES.RESULT,
  [QUIZ_STATES.RESULT]:         QUIZ_STATES.WELCOME,
};

// ─── REDUCER ──────────────────────────────────────────────────────────────────

function quizReducer(state, action) {
  switch (action.type) {

    case A.START_QUIZ:
      return { ...state, currentState: QUIZ_STATES.STEP_HAIR_TYPE, answers: {}, result: null, isAnimating: false };

    case A.SELECT_ANSWER: {
      const { questionState, optionId } = action.payload;
      const nextState = STATE_TRANSITIONS[questionState];
      if (!nextState) { console.warn('[QuizFSM] Transición inválida:', questionState); return state; }
      return {
        ...state,
        answers:      { ...state.answers, [questionState]: optionId },
        currentState: nextState,
        isAnimating:  true,
      };
    }

    case A.SET_RESULT:
      return { ...state, currentState: QUIZ_STATES.RESULT, result: action.payload, isAnimating: false };

    case A.ADD_TO_CART: {
      const formula = action.payload;
      // Si ya existe exactamente esa fórmula (mismo formulaName), incrementar qty
      const existingIdx = state.cartItems.findIndex(i => i.formulaName === formula.formulaName);
      if (existingIdx >= 0) {
        const updated = [...state.cartItems];
        updated[existingIdx] = { ...updated[existingIdx], quantity: updated[existingIdx].quantity + 1 };
        return { ...state, cartItems: updated };
      }
      const newItem = {
        cartId:        `umay-${Date.now()}`,
        formulaName:   formula.formulaName,
        tagline:       formula.tagline,
        colorHex:      formula.colorHex,
        price:         formula.price,
        priceLabel:    formula.priceLabel,
        tier:          formula.tier,
        topIngredients: formula.topIngredients,
        answers:       formula.answers,
        quantity:      1,
      };
      return { ...state, cartItems: [...state.cartItems, newItem] };
    }

    case A.REMOVE_FROM_CART:
      return { ...state, cartItems: state.cartItems.filter(i => i.cartId !== action.payload) };

    case A.UPDATE_QTY: {
      const { cartId, delta } = action.payload;
      const updated = state.cartItems
        .map(i => i.cartId === cartId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i);
      return { ...state, cartItems: updated };
    }

    case A.CLEAR_CART:
      return { ...state, cartItems: [] };

    case A.RESTART_QUIZ:
      return { ...INITIAL_STATE, cartItems: state.cartItems }; // preservar carrito

    case A.SET_ANIMATING:
      return { ...state, isAnimating: action.payload };

    default:
      return state;
  }
}

// ─── HOOK PRINCIPAL ───────────────────────────────────────────────────────────

export function useShampooQuiz() {
  const [state, dispatch] = useReducer(quizReducer, INITIAL_STATE, initializeState);

  // Reset animating flag
  useEffect(() => {
    if (!state.isAnimating) return;
    const t = setTimeout(() => dispatch({ type: A.SET_ANIMATING, payload: false }), 50);
    return () => clearTimeout(t);
  }, [state.isAnimating]);

  // Motor de recomendación al llegar a LOADING_AI
  useEffect(() => {
    if (state.currentState !== QUIZ_STATES.LOADING_AI) return;
    const t = setTimeout(() => {
      const formulaResult = computeFormula(state.answers, QUIZ_QUESTIONS);
      try {
        localStorage.setItem(STORAGE_KEY, serializeFormula(formulaResult) ?? '');
        localStorage.setItem(ANSWERS_KEY, JSON.stringify(state.answers));
      } catch { /* silencioso */ }
      dispatch({ type: A.SET_RESULT, payload: formulaResult });
    }, 2500);
    return () => clearTimeout(t);
  }, [state.currentState, state.answers]);

  // Persistir carrito en localStorage cuando cambia
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(state.cartItems));
    } catch { /* silencioso */ }
  }, [state.cartItems]);

  // ── ACCIONES PÚBLICAS ──────────────────────────────────────────────────────

  const startQuiz      = useCallback(() => dispatch({ type: A.START_QUIZ }), []);
  const restartQuiz    = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(ANSWERS_KEY); } catch {}
    dispatch({ type: A.RESTART_QUIZ });
  }, []);
  const selectAnswer   = useCallback((questionState, optionId) =>
    dispatch({ type: A.SELECT_ANSWER, payload: { questionState, optionId } }), []);

  // addToCart recibe el objeto FormulaResult completo
  const addToCart      = useCallback((formula) => dispatch({ type: A.ADD_TO_CART, payload: formula }), []);
  const removeFromCart = useCallback((cartId)  => dispatch({ type: A.REMOVE_FROM_CART, payload: cartId }), []);
  const updateQty      = useCallback((cartId, delta) => dispatch({ type: A.UPDATE_QTY, payload: { cartId, delta } }), []);
  const clearCart      = useCallback(() => dispatch({ type: A.CLEAR_CART }), []);

  // ── DERIVACIONES ──────────────────────────────────────────────────────────
  const currentQuestion = QUIZ_QUESTIONS.find(q => q.state === state.currentState) || null;
  const totalSteps      = QUIZ_QUESTIONS.length;
  const currentStep     = currentQuestion?.step ?? 0;
  const cartCount       = state.cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal       = state.cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  return {
    currentState: state.currentState,
    answers:      state.answers,
    result:       state.result,
    cartItems:    state.cartItems,
    cartCount,
    cartTotal,
    isAnimating:  state.isAnimating,
    currentQuestion,
    totalSteps,
    currentStep,
    startQuiz,
    restartQuiz,
    selectAnswer,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
  };
}

// ─── INICIALIZADOR LAZY ───────────────────────────────────────────────────────

function initializeState(initialArg) {
  try {
    const savedResult  = localStorage.getItem(STORAGE_KEY);
    const savedAnswers = localStorage.getItem(ANSWERS_KEY);
    const savedCart    = localStorage.getItem(CART_KEY);
    const cartItems    = savedCart ? JSON.parse(savedCart) : [];

    if (savedResult && savedAnswers) {
      const result  = deserializeFormula(savedResult);
      const answers = JSON.parse(savedAnswers);
      if (result && answers) {
        return { ...initialArg, currentState: QUIZ_STATES.RESULT, answers, result, cartItems };
      }
    }
    return { ...initialArg, cartItems };
  } catch {
    return initialArg;
  }
}
