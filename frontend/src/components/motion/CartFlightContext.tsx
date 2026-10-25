"use client";

/**
 * ============================================================================
 * GROCIFY CURVED FLY-TO-CART CHOREOGRAPHY
 * ============================================================================
 * Clones product image and animates it along a parabolic curved trajectory
 * into the header shopping bag indicator.
 * Upon arrival, triggers cart indicator bounce and spring badge pop.
 *
 * TUNABLE PARAMETERS:
 * - FLIGHT_DURATION: 0.72s (Organic flight travel time)
 * - PEAK_ARC_Y: -60px (Upward parabolic arc height)
 * - FINAL_SCALE: 0.22 (Thumbnail scale down into the bag)
 * - ROTATION_DEG: 15deg (Slight playful tilt while flying)
 * ============================================================================
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export const FLIGHT_TUNABLES = {
  flightDuration: 0.72,
  peakArcY: -60,
  finalScale: 0.22,
  rotationDeg: 14,
  ease: [0.19, 1, 0.22, 1] as const,
};

interface FlightItem {
  id: number;
  imageUrl: string;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  targetX: number;
  targetY: number;
}

interface CartFlightContextValue {
  flyToCart: (imageUrl: string, sourceElement: HTMLElement) => void;
  isCartBouncing: boolean;
}

const CartFlightContext = createContext<CartFlightContextValue>({
  flyToCart: () => {},
  isCartBouncing: false,
});

export const useCartFlight = () => useContext(CartFlightContext);

export function CartFlightProvider({ children }: { children: React.ReactNode }) {
  const [flights, setFlights] = useState<FlightItem[]>([]);
  const [isCartBouncing, setIsCartBouncing] = useState(false);

  const flyToCart = useCallback((imageUrl: string, sourceElement: HTMLElement) => {
    if (typeof window === "undefined") return;

    // Check reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsCartBouncing(true);
      setTimeout(() => setIsCartBouncing(false), 400);
      return;
    }

    const startRect = sourceElement.getBoundingClientRect();
    const cartElement = document.getElementById("header-cart-indicator");
    const targetRect = cartElement
      ? cartElement.getBoundingClientRect()
      : { left: window.innerWidth - 65, top: 35, width: 44, height: 44 };

    const newItem: FlightItem = {
      id: Date.now() + Math.random(),
      imageUrl,
      startX: startRect.left,
      startY: startRect.top,
      startWidth: Math.min(startRect.width, 140),
      startHeight: Math.min(startRect.height, 140),
      targetX: targetRect.left + (targetRect.width || 44) / 2 - 16,
      targetY: targetRect.top + (targetRect.height || 44) / 2 - 16,
    };

    setFlights((prev) => [...prev, newItem]);
  }, []);

  const handleFlightComplete = (id: number) => {
    setFlights((prev) => prev.filter((f) => f.id !== id));
    setIsCartBouncing(true);
    setTimeout(() => setIsCartBouncing(false), 450);
  };

  return (
    <CartFlightContext.Provider value={{ flyToCart, isCartBouncing }}>
      {children}

      {/* Flying Image Clones */}
      <AnimatePresence>
        {flights.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              position: "fixed",
              left: item.startX,
              top: item.startY,
              width: item.startWidth,
              height: item.startHeight,
              borderRadius: "8px",
              opacity: 0.95,
              scale: 1,
              rotate: 0,
              zIndex: 9999,
              pointerEvents: "none",
            }}
            animate={{
              left: [item.startX, item.startX + (item.targetX - item.startX) * 0.45, item.targetX],
              top: [
                item.startY,
                Math.min(item.startY, item.targetY) + FLIGHT_TUNABLES.peakArcY,
                item.targetY,
              ],
              scale: [1, 0.65, FLIGHT_TUNABLES.finalScale],
              rotate: [0, -FLIGHT_TUNABLES.rotationDeg, FLIGHT_TUNABLES.rotationDeg],
              opacity: [0.95, 0.9, 0],
            }}
            transition={{
              duration: FLIGHT_TUNABLES.flightDuration,
              ease: "easeInOut",
            }}
            onAnimationComplete={() => handleFlightComplete(item.id)}
            className="overflow-hidden shadow-modal border-2 border-electric-citrus bg-warm-ivory"
          >
            <div className="relative w-full h-full">
              <Image
                src={item.imageUrl}
                alt="Adding product"
                fill
                sizes="140px"
                className="object-cover"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </CartFlightContext.Provider>
  );
}
