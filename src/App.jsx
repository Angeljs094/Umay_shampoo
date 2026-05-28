/**
 * @fileoverview App.jsx – Componente raíz de la SPA UMAY
 *
 * Ensambla todos los componentes y provee el estado global del quiz.
 * El hook useShampooQuiz es el único "store" de estado: se pasa hacia abajo
 * como prop a los componentes que lo necesiten (patrón prop-drilling controlado,
 * suficiente para un MVP sin necesidad de Redux/Zustand).
 *
 * @module App
 */

import Navbar from '@/components/Navbar.jsx';
import Hero from '@/components/Hero.jsx';
import IngredientsGrid from '@/components/IngredientsGrid.jsx';
import QuizWizard from '@/components/QuizWizard.jsx';
import Footer from '@/components/Footer.jsx';
import { useShampooQuiz } from '@/hooks/useShampooQuiz.js';

export default function App() {
  // Estado global del quiz y carrito — único punto de verdad
  const quiz = useShampooQuiz();

  /**
   * Handler para el CTA del Hero: hace scroll al quiz Y lo inicia.
   */
  const handleHeroStartQuiz = () => {
    // 1. Iniciar la máquina de estados
    quiz.startQuiz();
    // 2. Scroll suave a la sección del quiz
    setTimeout(() => {
      document.querySelector('#quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <>
      {/* Navbar fija con contador del carrito actualizado en tiempo real */}
      <Navbar cartCount={quiz.cartCount} />

      {/* Contenido principal de la SPA */}
      <main id="main-content">
        {/* Sección Hero con CTA que inicia el quiz */}
        <Hero onStartQuiz={handleHeroStartQuiz} />

        {/* Vitrina interactiva de ingredientes botánicos */}
        <IngredientsGrid />

        {/* Quiz de personalización: el componente estrella */}
        <QuizWizard quiz={quiz} />
      </main>

      {/* Pie de página con info de marca y créditos */}
      <Footer />
    </>
  );
}
