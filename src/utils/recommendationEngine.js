/**
 * @fileoverview Motor de Recomendación Matricial UMAY
 * Weighted Matrix Scoring: sin if/else, pura aritmética vectorial.
 * @module utils/recommendationEngine
 */

import { INGREDIENTS_CATALOG, FORMULA_NAMES, PRICING } from '@/types/quiz.js';

/**
 * Calcula la fórmula óptima de shampoo según las respuestas del usuario.
 * @param {Object.<string,string>} answers - { STEP_HAIR_TYPE: 'dry_scalp', ... }
 * @param {Array} questions - Preguntas del quiz con weights por opción
 * @returns {Object} FormulaResult completo
 */
export function computeFormula(answers, questions) {
  // 1. Vector de puntuación inicializado en 0
  const scoreVector = Object.keys(INGREDIENTS_CATALOG).reduce((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {});

  // 2. Sumar pesos de cada respuesta
  questions.forEach((question) => {
    const selectedOptionId = answers[question.state];
    if (!selectedOptionId) return;
    const selectedOption = question.options.find((opt) => opt.id === selectedOptionId);
    if (!selectedOption) return;
    Object.entries(selectedOption.weights).forEach(([ingredientId, points]) => {
      if (scoreVector[ingredientId] !== undefined) {
        scoreVector[ingredientId] += points;
      }
    });
  });

  // 3. Ordenar ingredientes por puntuación descendente
  const allIngredients = Object.entries(scoreVector)
    .map(([id, score]) => ({ id, score, data: INGREDIENTS_CATALOG[id] }))
    .sort((a, b) => b.score - a.score);

  // 4. Top 3 ingredientes
  const topIngredients = allIngredients.slice(0, 3);

  // 5. Nombre de la fórmula por clave compuesta
  const formulaKey  = topIngredients.map((i) => i.id).join('_');
  const formulaData = FORMULA_NAMES[formulaKey] || FORMULA_NAMES.default;

  // 6. Color blend de los 3 colores
  const colorHex = blendHexColors(topIngredients.map((i) => i.data.color));

  // 7. Tier por puntuación total (umbral corregido: base < 12, premium < 15, deluxe >= 15)
  const totalScore = topIngredients.reduce((sum, i) => sum + i.score, 0);
  const tier  = totalScore >= 15 ? 'deluxe' : totalScore >= 10 ? 'premium' : 'base';
  const price = PRICING[tier];

  return {
    formulaName:    formulaData.name,
    tagline:        formulaData.tagline,
    description:    formulaData.description,
    topIngredients,
    allIngredients,
    colorHex,
    price,
    priceLabel: `S/. ${price.toFixed(2)}`,
    tier,
    answers,
  };
}

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

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

export function serializeFormula(result) {
  try { return JSON.stringify(result); } catch { return null; }
}

export function deserializeFormula(json) {
  try {
    const parsed = JSON.parse(json);
    if (!parsed.formulaName || !parsed.topIngredients) return null;
    return parsed;
  } catch { return null; }
}
