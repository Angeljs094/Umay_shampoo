/**
 * @fileoverview App.jsx – Componente raíz de la SPA UMAY
 * Único punto de estado global: quiz + carrito.
 * @module App
 */

import { useState } from 'react';
import Navbar       from '@/components/Navbar.jsx';
import Hero         from '@/components/Hero.jsx';
import IngredientsGrid from '@/components/IngredientsGrid.jsx';
import QuizWizard   from '@/components/QuizWizard.jsx';
import CartDrawer   from '@/components/CartDrawer.jsx';
import Checkout     from '@/components/Checkout.jsx';
import Footer       from '@/components/Footer.jsx';
import { useShampooQuiz } from '@/hooks/useShampooQuiz.js';

export default function App() {
  const quiz = useShampooQuiz();

  const [isCartOpen,     setIsCartOpen]     = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleHeroStartQuiz = () => {
    quiz.startQuiz();
    setTimeout(() => {
      document.querySelector('#quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <Navbar
        cartCount={quiz.cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main id="main-content">
        <Hero onStartQuiz={handleHeroStartQuiz} />
        <IngredientsGrid />
        <QuizWizard quiz={quiz} />
      </main>

      <Footer />

      {/* Panel lateral del carrito */}
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

      {/* Flujo de checkout */}
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
