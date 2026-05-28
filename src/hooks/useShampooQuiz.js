/**
 * @fileoverview Hook personalizado: useShampooQuiz
 *
 * Implementa una Máquina de Estados Finitos (FSM) para controlar el flujo del
 * cuestionario de personalización UMAY. Gestiona transiciones de estado,
 * respuestas del usuario, animación de carga y resultado final.
 *
 * Diagrama de estados:
 *   WELCOME → STEP_HAIR_TYPE → STEP_GOAL → STEP_SCENT → LOADING_AI → RESULT
 *                                                                        ↓
 *                                                                 (restart) → WELCOME
 *
 * @module hooks/useShampooQuiz
 */

import { useReducer, useCallback, useEffect } from 'react';
import { QUIZ_STATES, QUIZ_QUESTIONS } from '@/types/quiz.js';
import { computeFormula, serializeFormula, deserializeFormula } from '@/utils/recommendationEngine.js';

// ─── CLAVE DE PERSISTENCIA EN LOCALSTORAGE ────────────────────────────────────
const STORAGE_KEY = 'umay_formula_result';
const ANSWERS_KEY = 'umay_quiz_answers';

// ─── ESTADO INICIAL ──────────────────────────────────────────────────────────

/**
 * @typedef {Object} QuizState
 * @property {string}      currentState - Estado FSM actual (uno de QUIZ_STATES)
 * @property {Object}      answers      - Respuestas acumuladas { stateKey: optionId }
 * @property {Object|null} result       - Resultado del motor de recomendación
 * @property {number}      cartCount    - Cantidad de items en el carrito
 * @property {boolean}     isAnimating  - Flag para evitar doble transición
 */

/** @type {QuizState} */
const INITIAL_STATE = {
  currentState: QUIZ_STATES.WELCOME,
  answers: {},
  result: null,
  cartCount: 0,
  isAnimating: false,
};

// ─── TIPOS DE ACCIONES ────────────────────────────────────────────────────────

const ACTION_TYPES = {
  START_QUIZ: 'START_QUIZ',
  SELECT_ANSWER: 'SELECT_ANSWER',
  TRIGGER_LOADING: 'TRIGGER_LOADING',
  SET_RESULT: 'SET_RESULT',
  ADD_TO_CART: 'ADD_TO_CART',
  RESTART_QUIZ: 'RESTART_QUIZ',
  RESTORE_STATE: 'RESTORE_STATE',
  SET_ANIMATING: 'SET_ANIMATING',
};

// ─── TABLA DE TRANSICIONES FSM ────────────────────────────────────────────────

/**
 * Mapa de transiciones válidas de la máquina de estados.
 * Garantiza que no haya saltos ilegales entre estados.
 *
 * @type {Object.<string, string>}
 */
const STATE_TRANSITIONS = {
  [QUIZ_STATES.WELCOME]: QUIZ_STATES.STEP_HAIR_TYPE,
  [QUIZ_STATES.STEP_HAIR_TYPE]: QUIZ_STATES.STEP_GOAL,
  [QUIZ_STATES.STEP_GOAL]: QUIZ_STATES.STEP_SCENT,
  [QUIZ_STATES.STEP_SCENT]: QUIZ_STATES.LOADING_AI,
  [QUIZ_STATES.LOADING_AI]: QUIZ_STATES.RESULT,
  [QUIZ_STATES.RESULT]: QUIZ_STATES.WELCOME, // Reinicio del ciclo
};

// ─── REDUCER PURO ─────────────────────────────────────────────────────────────

/**
 * Reducer de la FSM del quiz. Maneja todas las transiciones de estado de forma pura.
 *
 * @param {QuizState} state  - Estado actual
 * @param {{ type: string, payload?: any }} action - Acción despachada
 * @returns {QuizState} Nuevo estado
 */
function quizReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.START_QUIZ:
      return {
        ...state,
        currentState: QUIZ_STATES.STEP_HAIR_TYPE,
        answers: {},
        result: null,
        isAnimating: false,
      };

    case ACTION_TYPES.SELECT_ANSWER: {
      const { questionState, optionId } = action.payload;
      const nextState = STATE_TRANSITIONS[questionState];

      if (!nextState) {
        console.warn('[QuizFSM] Transición inválida desde:', questionState);
        return state;
      }

      const updatedAnswers = { ...state.answers, [questionState]: optionId };

      return {
        ...state,
        answers: updatedAnswers,
        currentState: nextState,
        isAnimating: true,
      };
    }

    case ACTION_TYPES.SET_RESULT:
      return {
        ...state,
        currentState: QUIZ_STATES.RESULT,
        result: action.payload,
        isAnimating: false,
      };

    case ACTION_TYPES.ADD_TO_CART:
      return {
        ...state,
        cartCount: state.cartCount + 1,
      };

    case ACTION_TYPES.RESTART_QUIZ:
      return {
        ...INITIAL_STATE,
        cartCount: state.cartCount, // Preservar el carrito al reiniciar
      };

    case ACTION_TYPES.RESTORE_STATE:
      return {
        ...state,
        ...action.payload,
      };

    case ACTION_TYPES.SET_ANIMATING:
      return { ...state, isAnimating: action.payload };

    default:
      console.warn('[QuizFSM] Acción no reconocida:', action.type);
      return state;
  }
}

// ─── HOOK PRINCIPAL ───────────────────────────────────────────────────────────

/**
 * Hook que expone la máquina de estados del quiz y sus acciones.
 *
 * @returns {{
 *   currentState: string,
 *   answers: Object,
 *   result: Object|null,
 *   cartCount: number,
 *   isAnimating: boolean,
 *   currentQuestion: Object|null,
 *   totalSteps: number,
 *   currentStep: number,
 *   startQuiz: () => void,
 *   selectAnswer: (questionState: string, optionId: string) => void,
 *   addToCart: () => void,
 *   restartQuiz: () => void,
 * }}
 */
export function useShampooQuiz() {
  const [state, dispatch] = useReducer(quizReducer, INITIAL_STATE, initializeState);

  // ── Inicializar animating=false después de cada transición de estado ─────
  useEffect(() => {
    if (state.isAnimating) {
      const timer = setTimeout(() => {
        dispatch({ type: ACTION_TYPES.SET_ANIMATING, payload: false });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [state.isAnimating]);

  // ── Lanzar el motor de recomendación cuando llegamos a LOADING_AI ────────
  useEffect(() => {
    if (state.currentState !== QUIZ_STATES.LOADING_AI) return;

    // Simulamos 2.5s de "procesamiento de IA botánica" antes de mostrar resultado
    const timer = setTimeout(() => {
      const formulaResult = computeFormula(state.answers, QUIZ_QUESTIONS);

      // Persistir resultado y respuestas en localStorage
      const serialized = serializeFormula(formulaResult);
      if (serialized) {
        try {
          localStorage.setItem(STORAGE_KEY, serialized);
          localStorage.setItem(ANSWERS_KEY, JSON.stringify(state.answers));
        } catch (storageError) {
          // localStorage puede fallar en modo privado: manejamos silenciosamente
          console.warn('[QuizFSM] No se pudo guardar en localStorage:', storageError.message);
        }
      }

      dispatch({ type: ACTION_TYPES.SET_RESULT, payload: formulaResult });
    }, 2500);

    return () => clearTimeout(timer);
  }, [state.currentState, state.answers]);

  // ── ACCIONES PÚBLICAS ──────────────────────────────────────────────────────

  const startQuiz = useCallback(() => {
    dispatch({ type: ACTION_TYPES.START_QUIZ });
  }, []);

  const selectAnswer = useCallback((questionState, optionId) => {
    dispatch({
      type: ACTION_TYPES.SELECT_ANSWER,
      payload: { questionState, optionId },
    });
  }, []);

  const addToCart = useCallback(() => {
    dispatch({ type: ACTION_TYPES.ADD_TO_CART });
  }, []);

  const restartQuiz = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ANSWERS_KEY);
    } catch {
      // Silencioso
    }
    dispatch({ type: ACTION_TYPES.RESTART_QUIZ });
  }, []);

  // ── DERIVACIONES COMPUTADAS ────────────────────────────────────────────────

  const currentQuestion =
    QUIZ_QUESTIONS.find((q) => q.state === state.currentState) || null;

  const totalSteps = QUIZ_QUESTIONS.length;

  const currentStep = currentQuestion?.step ?? 0;

  return {
    currentState: state.currentState,
    answers: state.answers,
    result: state.result,
    cartCount: state.cartCount,
    isAnimating: state.isAnimating,
    currentQuestion,
    totalSteps,
    currentStep,
    startQuiz,
    selectAnswer,
    addToCart,
    restartQuiz,
  };
}

// ─── INICIALIZADOR DEL ESTADO ─────────────────────────────────────────────────

/**
 * Inicializador lazy del reducer: restaura el estado desde localStorage si existe
 * un resultado previo guardado. Esto implementa la persistencia ligera requerida.
 *
 * @param {QuizState} initialArg - Estado inicial base
 * @returns {QuizState} Estado inicial (posiblemente restaurado)
 */
function initializeState(initialArg) {
  try {
    const savedResult = localStorage.getItem(STORAGE_KEY);
    const savedAnswers = localStorage.getItem(ANSWERS_KEY);

    if (savedResult && savedAnswers) {
      const result = deserializeFormula(savedResult);
      const answers = JSON.parse(savedAnswers);

      if (result && answers) {
        // Restauramos al estado RESULT con el resultado previo
        return {
          ...initialArg,
          currentState: QUIZ_STATES.RESULT,
          answers,
          result,
        };
      }
    }
  } catch {
    // Si localStorage falla, iniciamos desde cero sin romper la app
  }

  return initialArg;
}
