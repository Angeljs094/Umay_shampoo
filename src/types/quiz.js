/**
 * @fileoverview Tipos y catálogos de datos para el quiz UMAY
 * @module types/quiz
 */

// ─── ESTADOS FSM ──────────────────────────────────────────────────────────────

export const QUIZ_STATES = {
  WELCOME:        'WELCOME',
  STEP_HAIR_TYPE: 'STEP_HAIR_TYPE',
  STEP_GOAL:      'STEP_GOAL',
  STEP_SCENT:     'STEP_SCENT',
  LOADING_AI:     'LOADING_AI',
  RESULT:         'RESULT',
};

// ─── CATÁLOGO DE INGREDIENTES ─────────────────────────────────────────────────

export const INGREDIENTS_CATALOG = {
  muna: {
    id:          'muna',
    name:        'Muña Andina',
    latin:       'Minthostachys mollis',
    origin:      'Andes del Perú (2500–3800 m)',
    description: 'Planta aromática sagrada de los Andes peruanos. Sus aceites esenciales (pulegona y mentol) tienen propiedades antimicrobianas y estimulantes del cuero cabelludo únicas.',
    benefits:    [
      'Estimula la microcirculación del folículo piloso',
      'Propiedades antimicrobianas naturales contra la caspa',
      'Refresca y equilibra el cuero cabelludo graso',
      'Aceites esenciales con mentol natural andino',
    ],
    color:   '#5B8C5A',
    bgColor: '#EDF6EC',
    icon:    '🌿',
  },
  sabila: {
    id:          'sabila',
    name:        'Sábila',
    latin:       'Aloe barbadensis',
    origin:      'Cultivada en valles andinos del Perú',
    description: 'El gel puro de sábila contiene más de 75 compuestos activos incluyendo polisacáridos, vitaminas A, C, E y aminoácidos esenciales para la fibra capilar.',
    benefits:    [
      'Hidratación profunda: retiene hasta 1000x su peso en agua',
      'Sella la cutícula y aporta brillo natural',
      'Equilibra el pH del cuero cabelludo (4.5–5.5)',
      'Efecto calmante en cuero cabelludo irritado',
    ],
    color:   '#7AB87A',
    bgColor: '#F0F9EE',
    icon:    '🌱',
  },
  arcillaVerde: {
    id:          'arcillaVerde',
    name:        'Arcilla Verde',
    latin:       'Montmorillonita andina',
    origin:      'Depósitos volcánicos, Sierra peruana',
    description: 'Arcilla volcánica de origen andino con alto contenido en sílice, magnesio y hierro. Absorbe impurezas, sebo y metales pesados sin agredir la cutícula.',
    benefits:    [
      'Purificación profunda del folículo piloso',
      'Absorbe el exceso de sebo sin resecar',
      'Aporta minerales: sílice, magnesio, potasio',
      'Ideal para cuero cabelludo con caspa y exceso de grasa',
    ],
    color:   '#8FAF7A',
    bgColor: '#F3F7EE',
    icon:    '🏔️',
  },
  romero: {
    id:          'romero',
    name:        'Romero',
    latin:       'Rosmarinus officinalis',
    origin:      'Cultivado en zonas altoandinas del Perú',
    description: 'El ácido rosmarínico y el carnosol del romero son antioxidantes de alta potencia que protegen el folículo. Estudios clínicos lo comparan con el minoxidil 2% para el crecimiento.',
    benefits:    [
      'Inhibe la 5-alfa-reductasa (enzima de la caída capilar)',
      'Antioxidante potente: protege la fibra del daño ambiental',
      'Estimula el crecimiento según estudios en Skinmed Journal',
      'Fortalece la corteza del cabello desde adentro',
    ],
    color:   '#4A7A5E',
    bgColor: '#EBF5F0',
    icon:    '🌾',
  },
  karite: {
    id:          'karite',
    name:        'Manteca de Karité',
    latin:       'Butyrospermum parkii',
    origin:      'Importada — África Occidental',
    description: 'Rica en ácidos grasos esenciales (oleico 43%, esteárico 42%) y vitaminas A, E y F. Forma una barrera lipídica que sella la humedad y nutre el cabello más seco.',
    benefits:    [
      'Nutrición profunda para cabello muy seco o rizado',
      'Forma barrera lipídica que sella la humedad',
      'Vitaminas A, E y F para restaurar la fibra dañada',
      'Controla el frizz con efecto "mantequilla" natural',
    ],
    color:   '#C5A870',
    bgColor: '#FBF6EE',
    icon:    '🧈',
  },
  aceiteCocos: {
    id:          'aceiteCocos',
    name:        'Aceite de Coco Virgen',
    latin:       'Cocos nucifera',
    origin:      'Costa peruana — Piura y Tumbes',
    description: 'El único aceite vegetal con bajo peso molecular que penetra el córtex capilar (no solo lo recubre). El ácido láurico previene la pérdida de proteínas y aporta brillo intenso.',
    benefits:    [
      'Penetra el tallo capilar desde adentro (no solo recubre)',
      'Ácido láurico: previene pérdida de proteínas capilares',
      'Brillo intenso y suavidad al tacto inmediata',
      'Propiedades antibacterianas naturales del ácido láurico',
    ],
    color:   '#D4A574',
    bgColor: '#FDF5EE',
    icon:    '🥥',
  },
};

// ─── PREGUNTAS DEL QUIZ ───────────────────────────────────────────────────────

export const QUIZ_QUESTIONS = [
  {
    state:    QUIZ_STATES.STEP_HAIR_TYPE,
    step:     1,
    title:    '¿Cómo es tu cuero cabelludo?',
    subtitle: 'Selecciona la opción que mejor te describa',
    options: [
      {
        id:          'dry_scalp',
        emoji:       '🏜️',
        label:       'Seco e irritado',
        description: 'Tirantez, picazón frecuente y descamación fina',
        weights: { muna: 2, sabila: 5, arcillaVerde: 1, romero: 2, karite: 5, aceiteCocos: 3 },
      },
      {
        id:          'oily_scalp',
        emoji:       '💧',
        label:       'Graso y brillante',
        description: 'Se engrasa rápido, cabello pesado al día siguiente',
        weights: { muna: 4, sabila: 2, arcillaVerde: 5, romero: 3, karite: 1, aceiteCocos: 1 },
      },
      {
        id:          'dandruff',
        emoji:       '❄️',
        label:       'Con caspa',
        description: 'Escamas visibles, picazón e incomodidad constante',
        weights: { muna: 5, sabila: 3, arcillaVerde: 4, romero: 2, karite: 1, aceiteCocos: 1 },
      },
      {
        id:          'normal',
        emoji:       '✨',
        label:       'Normal / Mixto',
        description: 'Sin problemas mayores, busco optimizarlo',
        weights: { muna: 2, sabila: 3, arcillaVerde: 2, romero: 4, karite: 2, aceiteCocos: 3 },
      },
    ],
  },
  {
    state:    QUIZ_STATES.STEP_GOAL,
    step:     2,
    title:    '¿Cuál es tu objetivo principal?',
    subtitle: 'Elige la transformación que quieres lograr',
    options: [
      {
        id:          'growth',
        emoji:       '🌱',
        label:       'Estimular el crecimiento',
        description: 'Más densidad, menos caída, crecimiento acelerado',
        weights: { muna: 3, sabila: 1, arcillaVerde: 2, romero: 5, karite: 2, aceiteCocos: 3 },
      },
      {
        id:          'hydration',
        emoji:       '💦',
        label:       'Hidratación profunda',
        description: 'Cabello seco, sin vida, necesita nutrición urgente',
        weights: { muna: 1, sabila: 5, arcillaVerde: 1, romero: 1, karite: 4, aceiteCocos: 4 },
      },
      {
        id:          'shine',
        emoji:       '✨',
        label:       'Brillo y suavidad',
        description: 'Aspecto opaco, quiero brillo y sedosidad',
        weights: { muna: 1, sabila: 4, arcillaVerde: 1, romero: 2, karite: 3, aceiteCocos: 5 },
      },
      {
        id:          'anti_frizz',
        emoji:       '🌀',
        label:       'Control del frizz',
        description: 'Cabello esponjado, rebelde, difícil de dominar',
        weights: { muna: 1, sabila: 3, arcillaVerde: 1, romero: 2, karite: 5, aceiteCocos: 4 },
      },
    ],
  },
  {
    state:    QUIZ_STATES.STEP_SCENT,
    step:     3,
    title:    '¿Qué aroma prefieres?',
    subtitle: 'El aroma complementa la experiencia botánica',
    options: [
      {
        id:          'herbal',
        emoji:       '🌿',
        label:       'Herbal fresco',
        description: 'Notas verdes, mentoladas y refrescantes de los Andes',
        weights: { muna: 4, sabila: 2, arcillaVerde: 2, romero: 4, karite: 1, aceiteCocos: 1 },
      },
      {
        id:          'floral',
        emoji:       '🌸',
        label:       'Floral suave',
        description: 'Delicado, femenino, con notas de flores andinas',
        weights: { muna: 1, sabila: 4, arcillaVerde: 1, romero: 2, karite: 3, aceiteCocos: 3 },
      },
      {
        id:          'earthy',
        emoji:       '🏔️',
        label:       'Terroso mineral',
        description: 'Profundo, natural, a tierra húmeda y arcilla andina',
        weights: { muna: 2, sabila: 1, arcillaVerde: 5, romero: 3, karite: 2, aceiteCocos: 1 },
      },
      {
        id:          'tropical',
        emoji:       '🥥',
        label:       'Tropical dulce',
        description: 'Cálido, exótico, a coco y manteca natural peruana',
        weights: { muna: 1, sabila: 2, arcillaVerde: 1, romero: 1, karite: 4, aceiteCocos: 5 },
      },
    ],
  },
];

// ─── NOMBRES DE FÓRMULAS ──────────────────────────────────────────────────────

export const FORMULA_NAMES = {
  'romero_muna_aceiteCocos':    { name: 'Fuerza Andina',      tagline: 'Crecimiento y vitalidad desde las alturas', description: 'Fórmula estimulante para máximo crecimiento capilar' },
  'romero_aceiteCocos_muna':    { name: 'Raíz Viva',          tagline: 'Activa el folículo con botánica pura',       description: 'Combinación potente para crecimiento y brillo' },
  'sabila_karite_aceiteCocos':  { name: 'Néctar Profundo',    tagline: 'Hidratación sin límites de la naturaleza',  description: 'Triple hidratación para cabello muy seco' },
  'karite_aceiteCocos_sabila':  { name: 'Mantequilla Verde',  tagline: 'Nutrición pura para el cabello rebelde',    description: 'Máxima nutrición y control del frizz' },
  'aceiteCocos_karite_sabila':  { name: 'Luz Tropical',       tagline: 'Brillo y suavidad desde la costa peruana',  description: 'Brillo intenso con nutrición profunda' },
  'muna_arcillaVerde_romero':   { name: 'Pureza Inca',        tagline: 'Limpieza profunda con minerales andinos',   description: 'Purificación intensa para cuero cabelludo graso' },
  'arcillaVerde_muna_romero':   { name: 'Volcán Andino',      tagline: 'Minerales volcánicos para tu cabello',      description: 'Detox profundo y equilibrio del cuero cabelludo' },
  'sabila_aceiteCocos_karite':  { name: 'Oasis Botánico',     tagline: 'Agua y aceite en perfecta armonía',         description: 'Hidratación y nutrición en un solo paso' },
  'romero_karite_aceiteCocos':  { name: 'Bosque Eterno',      tagline: 'Fuerza y nutrición desde la naturaleza',   description: 'Crecimiento con nutrición intensiva' },
  'muna_sabila_arcillaVerde':   { name: 'Brisa Andina',       tagline: 'Frescura y limpieza de los Andes',          description: 'Equilibrio perfecto para el cuero cabelludo' },
  'arcillaVerde_sabila_karite': { name: 'Tierra Sagrada',     tagline: 'Minerales que transforman tu cabello',      description: 'Purificación suave con hidratación profunda' },
  'karite_muna_romero':         { name: 'Cumbre Verde',       tagline: 'La energía de los Andes en tu cabello',     description: 'Nutrición y estimulación para cabello sano' },
  default:                      { name: 'Esencia Botánica',   tagline: 'Tu fórmula personalizada de los Andes',     description: 'Fórmula única creada por el algoritmo botánico UMAY' },
};

// ─── PRECIOS POR TIER ─────────────────────────────────────────────────────────

export const PRICING = {
  base:    34.90,
  premium: 44.90,
  deluxe:  54.90,
};
