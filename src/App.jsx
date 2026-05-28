/**
 * @fileoverview App.jsx – Componente raíz de la SPA UMAY
 *
 * Ensambla todos los componentes y provee el estado global del quiz y carrito.
 * El hook useShampooQuiz es el único "store" de estado.
 *
 * @module App
 */

import { useState } from 'react';
import Navbar from '@/components/Navbar.jsx';
import Hero from '@/components/Hero.jsx';
import IngredientsGrid from '@/components/IngredientsGrid.jsx';
import QuizWizard from '@/components/QuizWizard.jsx';
import CartDrawer from '@/components/CartDrawer.jsx';
import Checkout from '@/components/Checkout.jsx';
import Footer from '@/components/Footer.jsx';
import { useShampooQuiz } from '@/hooks/useShampooQuiz.js';

export default function App() {
  // Estado global del quiz y carrito — único punto de verdad
  const quiz = useShampooQuiz();

  // Control de paneles modales
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  /**
   * Handler para el CTA del Hero: hace scroll al quiz Y lo inicia.
   */
  const handleHeroStartQuiz = () => {
    quiz.startQuiz();
    setTimeout(() => {
      document.querySelector('#quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  /**
   * Desde CartDrawer → abrir flujo de checkout.
   */
  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {/* Navbar fija con contador del carrito y apertura del drawer */}
      <Navbar
        cartCount={quiz.cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Contenido principal de la SPA */}
      <main id="main-content">
        <Hero onStartQuiz={handleHeroStartQuiz} />
        <IngredientsGrid />
        <QuizWizard quiz={quiz} />
      </main>

      <Footer />

      {/* ── CARRITO LATERAL ────────────────────────────────────────────── */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={quiz.cartItems}
        cartTotal={quiz.cartTotal}
        onRemove={quiz.removeFromCart}
        onUpdateQty={quiz.updateQty}
        onClear={quiz.clearCart}
        onCheckout={handleOpenCheckout}
      />

      {/* ── FLUJO DE CHECKOUT ──────────────────────────────────────────── */}
      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={quiz.cartItems}
        cartTotal={quiz.cartTotal}
        onRemove={quiz.removeFromCart}
        onUpdateQty={quiz.updateQty}
        onClear={quiz.clearCart}
      />
    </>
  );
}
