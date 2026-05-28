/**
 * @fileoverview Estructuras de datos y constantes del Quiz UMAY
 * Modela de forma estricta las preguntas, respuestas, ingredientes y la fórmula final.
 * Reemplaza TypeScript con JSDoc para tipado estático sin compilador adicional.
 *
 * @module types/quiz
 */

// ─── ESTADOS DE LA MÁQUINA DE ESTADOS ────────────────────────────────────────

/**
 * Enum de estados válidos del quiz.
 * @readonly
 * @enum {string}
 */
export const QUIZ_STATES = {
  WELCOME: 'WELCOME',
  STEP_HAIR_TYPE: 'STEP_HAIR_TYPE',
  STEP_GOAL: 'STEP_GOAL',
  STEP_SCENT: 'STEP_SCENT',
  LOADING_AI: 'LOADING_AI',
  RESULT: 'RESULT',
};

// ─── CATÁLOGO DE INGREDIENTES ────────────────────────────────────────────────

/**
 * Catálogo completo de ingredientes activos UMAY.
 * Cada ingrediente tiene: id, nombre, descripción científica, beneficios, color representativo.
 *
 * @typedef {Object} Ingredient
 * @property {string} id          - Identificador único del ingrediente
 * @property {string} name        - Nombre comercial/botánico
 * @property {string} latin       - Nombre científico en latín
 * @property {string} origin      - Origen geográfico del ingrediente
 * @property {string} description - Descripción de beneficios científicos
 * @property {string[]} benefits  - Lista de beneficios clave
 * @property {string} color       - Color HEX representativo para visualizaciones
 * @property {string} icon        - Emoji / ícono del ingrediente
 * @property {number} score       - Puntuación acumulada (calculada en tiempo de ejecución)
 */
export const INGREDIENTS_CATALOG = {
  muna: {
    id: 'muna',
    name: 'Muña Andina',
    latin: 'Minthostachys mollis',
    origin: 'Andes Peruanos (2800–3800 msnm)',
    description:
      'La muña es una hierba aromática de los Andes con potentes propiedades antimicrobianas y antifúngicas. Sus aceites esenciales (mentol, pulegona) combaten la caspa y estimulan el folículo piloso para promover el crecimiento.',
    benefits: [
      'Combate caspa y exceso de sebo',
      'Estimula la circulación del cuero cabelludo',
      'Efecto refrescante y purificante',
      'Propiedades antimicrobianas naturales',
    ],
    color: '#2C4A3E',
    bgColor: '#D6E8E2',
    icon: '🌿',
  },
  sabila: {
    id: 'sabila',
    name: 'Sábila Andina',
    latin: 'Aloe barbadensis miller',
    origin: 'Valles interandinos del Perú',
    description:
      'La sábila (Aloe vera) concentra polisacáridos, enzimas y vitaminas A, C, E. Hidrata en profundidad el tallo del cabello, sella la cutícula y restaura el pH natural del cuero cabelludo seco o irritado.',
    benefits: [
      'Hidratación profunda y duradera',
      'Restaura cutícula dañada',
      'Reduce el frizz intensamente',
      'Calma irritaciones del cuero cabelludo',
    ],
    color: '#4A7060',
    bgColor: '#D6E8E2',
    icon: '🍃',
  },
  arcillaVerde: {
    id: 'arcillaVerde',
    name: 'Arcilla Verde Andina',
    latin: 'Illite / Montmorillonita',
    origin: 'Formaciones volcánicas de los Andes',
    description:
      'La arcilla verde andina absorbe hasta 3 veces su peso en sebo e impurezas mediante carga iónica negativa. Destoxifica el folículo piloso y añade minerales (sílice, magnesio, hierro) que fortalecen la fibra capilar.',
    benefits: [
      'Limpieza profunda del cuero cabelludo',
      'Absorbe el exceso de sebo',
      'Aporta minerales esenciales',
      'Equilibra el microbioma capilar',
    ],
    color: '#8B7355',
    bgColor: '#F2E8D9',
    icon: '🪨',
  },
  romero: {
    id: 'romero',
    name: 'Aceite de Romero',
    latin: 'Rosmarinus officinalis',
    origin: 'Cultivado en costa peruana',
    description:
      'El aceite de romero contiene ácido rosmarínico y carnosol que inhiben la 5-alfa-reductasa (enzima ligada a la caída del cabello). Estudios publicados en Skinmed Journal confirman su eficacia comparable al minoxidil al 2% sin efectos secundarios.',
    benefits: [
      'Reduce la caída del cabello',
      'Estimula nuevos folículos pilosos',
      'Previene el adelgazamiento capilar',
      'Efecto antioxidante potente',
    ],
    color: '#3D6B5A',
    bgColor: '#D6E8E2',
    icon: '🌱',
  },
  karite: {
    id: 'karite',
    name: 'Manteca de Karité',
    latin: 'Vitellaria paradoxa',
    origin: 'África (importado sostenible)',
    description:
      'La manteca de karité aporta ácidos grasos (oleico, esteárico, linoleico) y vitaminas A, E, F que forman una barrera lipídica sobre el cabello. Ideal para cabello rizado o muy seco: sella la humedad, previene el quiebre y da brillo sin pesarlo.',
    benefits: [
      'Nutrición intensiva para cabello seco',
      'Sella puntas abiertas',
      'Define rizos sin efecto graso',
      'Protección térmica natural',
    ],
    color: '#C5A880',
    bgColor: '#FBF7F2',
    icon: '🥜',
  },
  aceiteCocos: {
    id: 'aceiteCocos',
    name: 'Aceite de Coco Virgen',
    latin: 'Cocos nucifera',
    origin: 'Costa norte del Perú',
    description:
      'El aceite de coco virgen penetra la corteza capilar gracias a su bajo peso molecular y su abundancia en ácido láurico. Previene la pérdida proteica durante el lavado, aporta brillo intenso y mantiene la elasticidad del cabello.',
    benefits: [
      'Penetración profunda en la fibra capilar',
      'Previene pérdida de proteínas',
      'Brillo intenso y sedosidad',
      'Nutrición para cabello fino o maltratado',
    ],
    color: '#D4BC9A',
    bgColor: '#FBF7F2',
    icon: '🥥',
  },
};

// ─── PREGUNTAS DEL QUIZ ───────────────────────────────────────────────────────

/**
 * @typedef {Object} QuizOption
 * @property {string} id          - ID único de la opción
 * @property {string} label       - Texto visible en la UI
 * @property {string} emoji       - Ícono visual
 * @property {string} description - Descripción breve para accesibilidad
 * @property {Object.<string, number>} weights - Mapa ingredienteId → puntos que suma esta opción
 */

/**
 * @typedef {Object} QuizQuestion
 * @property {string}       state   - Estado al que pertenece esta pregunta
 * @property {number}       step    - Número de paso (1-based)
 * @property {string}       title   - Título principal de la pregunta
 * @property {string}       subtitle - Subtítulo de contexto
 * @property {QuizOption[]} options - Opciones de respuesta
 */

/** @type {QuizQuestion[]} */
export const QUIZ_QUESTIONS = [
  {
    state: QUIZ_STATES.STEP_HAIR_TYPE,
    step: 1,
    title: '¿Cómo describirías tu cuero cabelludo?',
    subtitle: 'Esto nos ayuda a seleccionar la base activa de tu fórmula',
    options: [
      {
        id: 'dry_scalp',
        label: 'Seco o irritado',
        emoji: '🌵',
        description: 'Siento el cuero cabelludo tirante, a veces con descamación blanca',
        weights: { sabila: 3, karite: 2, aceiteCocos: 1 },
      },
      {
        id: 'oily_scalp',
        label: 'Graso',
        emoji: '✨',
        description: 'Al día siguiente de lavar, ya se ve brilloso y pesado',
        weights: { arcillaVerde: 3, muna: 2, romero: 1 },
      },
      {
        id: 'dandruff',
        label: 'Con caspa',
        emoji: '❄️',
        description: 'Veo pequeñas escamas blancas o amarillentas',
        weights: { muna: 3, romero: 1, arcillaVerde: 2 },
      },
      {
        id: 'normal',
        label: 'Normal y equilibrado',
        emoji: '⚖️',
        description: 'No tengo problemas específicos, busco mantener el equilibrio',
        weights: { sabila: 2, aceiteCocos: 2, romero: 1 },
      },
    ],
  },
  {
    state: QUIZ_STATES.STEP_GOAL,
    step: 2,
    title: '¿Cuál es tu principal objetivo capilar?',
    subtitle: 'Nuestro algoritmo botánico ajustará la concentración de activos',
    options: [
      {
        id: 'growth',
        label: 'Estimular el crecimiento',
        emoji: '🌱',
        description: 'Quiero pelo más largo y denso en menos tiempo',
        weights: { romero: 3, muna: 2, aceiteCocos: 1 },
      },
      {
        id: 'hydration',
        label: 'Hidratación profunda',
        emoji: '💧',
        description: 'Mi cabello está seco, quebradizo y sin vida',
        weights: { sabila: 3, karite: 3, aceiteCocos: 2 },
      },
      {
        id: 'shine',
        label: 'Brillo y sedosidad',
        emoji: '💫',
        description: 'Quiero que mi cabello luzca sano y brillante',
        weights: { aceiteCocos: 3, sabila: 2, karite: 1 },
      },
      {
        id: 'anti_frizz',
        label: 'Control del frizz',
        emoji: '🌊',
        description: 'El clima húmedo esponja mi cabello y pierde la forma',
        weights: { karite: 3, sabila: 2, aceiteCocos: 2 },
      },
    ],
  },
  {
    state: QUIZ_STATES.STEP_SCENT,
    step: 3,
    title: '¿Qué aroma prefieres en tu shampoo?',
    subtitle: 'Cada esencia proviene de plantas peruanas cultivadas de forma sostenible',
    options: [
      {
        id: 'herbal',
        label: 'Herbal y refrescante',
        emoji: '🌿',
        description: 'Notas de muña, romero y hierbas andinas',
        weights: { muna: 2, romero: 2 },
      },
      {
        id: 'floral',
        label: 'Floral y suave',
        emoji: '🌸',
        description: 'Flores andinas como la cantuta y el maíz morado',
        weights: { sabila: 2, karite: 1 },
      },
      {
        id: 'woody',
        label: 'Terroso y amaderado',
        emoji: '🪵',
        description: 'Madera de cedro, arcilla y notas ahumadas sutiles',
        weights: { arcillaVerde: 2, karite: 1 },
      },
      {
        id: 'fresh',
        label: 'Cítrico y energizante',
        emoji: '🍋',
        description: 'Cítricos de Lima, tangelo y mandarina peruana',
        weights: { aceiteCocos: 2, romero: 1 },
      },
    ],
  },
];

// ─── CATÁLOGO DE NOMBRES DE FÓRMULAS ─────────────────────────────────────────

/**
 * Nombres creativos para fórmulas según combinación de ingredientes top.
 * El motor de recomendación selecciona el nombre basado en los IDs de los 3 top ingredientes.
 *
 * @type {Object.<string, {name: string, tagline: string, description: string}>}
 */
export const FORMULA_NAMES = {
  // Fórmulas con muña predominante
  muna_sabila_romero: {
    name: 'Fórmula Andina Purificante',
    tagline: 'El poder de los Andes en tu cabello',
    description:
      'Una fórmula de equilibrio perfecto que combina la acción antimicrobiana de la muña con la hidratación de la sábila y el estímulo folicular del romero. Diseñada para cueros cabelludos exigentes que buscan limpieza profunda sin resecar.',
  },
  muna_arcillaVerde_romero: {
    name: 'Fórmula Andina Detox',
    tagline: 'Pureza mineral desde las alturas',
    description:
      'La triple acción purificante de la muña, la arcilla verde y el romero remueve toxinas, sebo y residuos con una eficiencia mineral única. Perfecta para cabellos con tendencia grasa y cuero cabelludo con caspa.',
  },
  // Fórmulas con sábila predominante
  sabila_karite_aceiteCocos: {
    name: 'Fórmula Néctar Selvático',
    tagline: 'Nutrición ancestral profunda',
    description:
      'Una mezcla ultra-nutritiva que fusiona la sábila andina, la manteca de karité y el aceite de coco virgen para restaurar cabellos extremadamente secos. Repone la barrera lipídica y deja cada hebra suave y sedosa.',
  },
  sabila_aceiteCocos_karite: {
    name: 'Fórmula Luz Andina',
    tagline: 'Brillo que nace desde adentro',
    description:
      'La sábila y el aceite de coco trabajan en sinergia para aportar hidratación y brillo sin efecto graso. La manteca de karité sella la cutícula para un acabado de salón en tu hogar.',
  },
  // Fórmulas con arcilla verde predominante
  arcillaVerde_muna_sabila: {
    name: 'Fórmula Equilibrio Mineral',
    tagline: 'La ciencia de la tierra andina',
    description:
      'La arcilla verde andina absorbe el exceso de sebo mientras la muña purifica y la sábila repone la hidratación exacta. Una fórmula de balance inteligente para todo tipo de cabello.',
  },
  // Fórmulas con romero predominante
  romero_muna_aceiteCocos: {
    name: 'Fórmula Renacimiento Andino',
    tagline: 'Despierta cada folículo dormido',
    description:
      'El romero y la muña se combinan con el aceite de coco para estimular la microcirculación capilar y despertar los folículos inactivos. Ideal para quienes buscan densidad y crecimiento acelerado.',
  },
  // Fórmulas con karité predominante
  karite_sabila_aceiteCocos: {
    name: 'Fórmula Oro Verde',
    tagline: 'Riqueza botánica para rizos perfectos',
    description:
      'El trío dorado de karité, sábila y aceite de coco define y nutre rizos y cabellos ondulados. Elimina el frizz con una riqueza natural que deja el cabello en su máximo esplendor.',
  },
  // Fórmula por defecto si ninguna combinación hace match exacto
  default: {
    name: 'Fórmula Botánica Personalizada',
    tagline: 'Creada exclusivamente para ti',
    description:
      'Una fórmula única elaborada con los ingredientes que más se adaptan a tu perfil capilar específico. Cada componente fue seleccionado por nuestro algoritmo botánico para maximizar los resultados en tu tipo de cabello.',
  },
};

/**
 * Precios base por fórmula (en soles peruanos).
 * La personalización añade un valor premium sobre el precio base.
 */
export const PRICING = {
  base: 34.9,
  premium: 44.9,
  deluxe: 54.9,
};
