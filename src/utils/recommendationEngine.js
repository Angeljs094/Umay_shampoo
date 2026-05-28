/**
 * @fileoverview Motor de Recomendación Matricial UMAY
 *
 * Implementa un algoritmo de Weighted Matrix Scoring:
 * cada respuesta del quiz suma puntos ponderados a los ingredientes del catálogo.
 * Al finalizar, se ordenan por puntuación descendente y se seleccionan los 3 top ingredientes.
 *
 * NO usa condicionales if/else para la selección: todo es una suma matricial pura.
 *
 * @module utils/recommendationEngine
 */

import { INGREDIENTS_CATALOG, FORMULA_NAMES, PRICING } from '@/types/quiz.js';

// ─── TIPOS (documentados con JSDoc para type-safety sin TS) ──────────────────

/**
 * @typedef {Object} ScoredIngredient
 * @property {string} id     - ID del ingrediente
 * @property {number} score  - Puntuación total acumulada
 * @property {import('@/types/quiz.js').Ingredient} data - Datos completos del ingrediente
 */

/**
 * @typedef {Object} FormulaResult
 * @property {string}               formulaName  - Nombre creativo de la fórmula
 * @property {string}               tagline      - Tagline de marketing
 * @property {string}               description  - Descripción científica de la fórmula
 * @property {ScoredIngredient[]}   topIngredients - Los 3 ingredientes mejor puntuados
 * @property {ScoredIngredient[]}   allIngredients - Todos los ingredientes rankeados
 * @property {string}               colorHex     - Color representativo de la barra de shampoo
 * @property {number}               price        - Precio recomendado en soles
 * @property {string}               priceLabel   - Etiqueta de precio formateada
 * @property {string}               tier         - Nivel de fórmula: 'base' | 'premium' | 'deluxe'
 * @property {Object}               answers      - Respuestas del usuario (para persistencia)
 */

// ─── FUNCIÓN PRINCIPAL ────────────────────────────────────────────────────────

/**
 * Calcula la fórmula óptima de shampoo basada en las respuestas del usuario.
 *
 * Algoritmo:
 * 1. Inicializa un vector de puntuación con ceros para cada ingrediente.
 * 2. Itera sobre cada respuesta; usa los weights de la opción como delta de puntuación.
 * 3. Ordena el vector de mayor a menor puntuación.
 * 4. Selecciona los 3 primeros como la fórmula recomendada.
 * 5. Busca el nombre de la fórmula en el catálogo por clave compuesta de los 3 IDs.
 *
 * @param {Object.<string, string>} answers - Mapa { questionState: optionId }
 *   Ejemplo: { STEP_HAIR_TYPE: 'dry_scalp', STEP_GOAL: 'hydration', STEP_SCENT: 'floral' }
 * @param {import('@/types/quiz.js').QuizQuestion[]} questions - Preguntas del quiz con weights
 * @returns {FormulaResult} Resultado completo de la fórmula personalizada
 */
export function computeFormula(answers, questions) {
  // ── PASO 1: Inicializar el vector de puntuación ──────────────────────────
  /** @type {Object.<string, number>} */
  const scoreVector = Object.keys(INGREDIENTS_CATALOG).reduce((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {});

  // ── PASO 2: Sumar los pesos de cada respuesta al vector ──────────────────
  questions.forEach((question) => {
    const selectedOptionId = answers[question.state];
    if (!selectedOptionId) return; // Pregunta no respondida: skip

    // Encontrar la opción seleccionada por su ID
    const selectedOption = question.options.find((opt) => opt.id === selectedOptionId);
    if (!selectedOption) return;

    // Sumar los pesos de esta opción al vector de puntuación
    Object.entries(selectedOption.weights).forEach(([ingredientId, points]) => {
      if (scoreVector[ingredientId] !== undefined) {
        scoreVector[ingredientId] += points;
      }
    });
  });

  // ── PASO 3: Construir array de ingredientes con puntuación y ordenar ─────
  /** @type {ScoredIngredient[]} */
  const allIngredients = Object.entries(scoreVector)
    .map(([id, score]) => ({
      id,
      score,
      data: INGREDIENTS_CATALOG[id],
    }))
    .sort((a, b) => b.score - a.score); // Orden descendente

  // ── PASO 4: Seleccionar los 3 mejores ingredientes ───────────────────────
  const topIngredients = allIngredients.slice(0, 3);

  // ── PASO 5: Determinar el nombre de la fórmula ───────────────────────────
  const formulaKey = topIngredients.map((i) => i.id).join('_');
  const formulaData = FORMULA_NAMES[formulaKey] || FORMULA_NAMES.default;

  // ── PASO 6: Calcular el color representativo (blend de los 3 colores top) ─
  const blendColor = blendHexColors(topIngredients.map((i) => i.data.color));

  // ── PASO 7: Determinar el tier y precio basado en puntuación total ────────
  const totalScore = topIngredients.reduce((sum, i) => sum + i.score, 0);
  const tier = totalScore >= 18 ? 'deluxe' : totalScore >= 12 ? 'premium' : 'base';
  const price = PRICING[tier];

  return {
    formulaName: formulaData.name,
    tagline: formulaData.tagline,
    description: formulaData.description,
    topIngredients,
    allIngredients,
    colorHex: blendColor,
    price,
    priceLabel: `S/. ${price.toFixed(2)}`,
    tier,
    answers,
  };
}

// ─── UTILIDADES INTERNAS ──────────────────────────────────────────────────────

/**
 * Mezcla un array de colores HEX calculando el promedio RGB.
 * Produce un color "blend" visual que representa la combinación de ingredientes.
 *
 * @param {string[]} hexColors - Array de colores en formato '#RRGGBB'
 * @returns {string} Color HEX resultante del blend
 */
function blendHexColors(hexColors) {
  if (!hexColors.length) return '#2C4A3E';

  const rgbs = hexColors.map(hexToRgb).filter(Boolean);
  if (!rgbs.length) return '#2C4A3E';

  const avg = {
    r: Math.round(rgbs.reduce((s, c) => s + c.r, 0) / rgbs.length),
    g: Math.round(rgbs.reduce((s, c) => s + c.g, 0) / rgbs.length),
    b: Math.round(rgbs.reduce((s, c) => s + c.b, 0) / rgbs.length),
  };

  return rgbToHex(avg.r, avg.g, avg.b);
}

/**
 * Convierte un color HEX a objeto RGB.
 *
 * @param {string} hex - Color en formato '#RRGGBB'
 * @returns {{ r: number, g: number, b: number } | null}
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convierte valores RGB a string HEX.
 *
 * @param {number} r - Rojo (0-255)
 * @param {number} g - Verde (0-255)
 * @param {number} b - Azul (0-255)
 * @returns {string} Color HEX con prefijo '#'
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

/**
 * Serializa el resultado de la fórmula para almacenamiento en localStorage.
 * Convierte el objeto a JSON con manejo seguro de errores.
 *
 * @param {FormulaResult} result - Resultado del motor de recomendación
 * @returns {string | null} JSON serializado o null si falla
 */
export function serializeFormula(result) {
  try {
    return JSON.stringify(result);
  } catch (error) {
    console.error('[RecommendationEngine] Error serializando fórmula:', error);
    return null;
  }
}

/**
 * Deserializa un resultado de fórmula desde localStorage.
 *
 * @param {string} json - String JSON almacenado
 * @returns {FormulaResult | null} Resultado deserializado o null si es inválido
 */
export function deserializeFormula(json) {
  try {
    const parsed = JSON.parse(json);
    // Validación mínima de estructura
    if (!parsed.formulaName || !parsed.topIngredients) return null;
    return parsed;
  } catch {
    return null;
  }
}
