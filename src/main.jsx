/**
 * @fileoverview main.jsx – Punto de entrada de la aplicación UMAY
 *
 * Monta el árbol de componentes React en el elemento #root del DOM.
 * StrictMode está activo en desarrollo para detectar efectos secundarios
 * no puros y usos de APIs obsoletas.
 *
 * @module main
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Obtener el elemento root — error explícito si no existe
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('[UMAY] No se encontró el elemento #root en el DOM. Verifica index.html.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
