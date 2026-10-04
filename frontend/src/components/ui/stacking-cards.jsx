"use client";

import React, { createContext, useContext, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const StackingCardsContext = createContext(null);

export const useStackingCardsContext = () => {
  const context = useContext(StackingCardsContext);
  if (!context) {
    throw new Error("StackingCardItem must be used within StackingCards");
  }
  return context;
};

export default function StackingCards({
  children,
  className,
  scrollOptions,
  scaleMultiplier,
  totalCards,
  ...props
}) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
    ...scrollOptions,
  });

  return (
    <StackingCardsContext.Provider
      value={{ progress: scrollYProgress, scaleMultiplier, totalCards, targetRef }}
    >
      <div className={cn("relative", className)} ref={targetRef} {...props}>
        {children}
      </div>
    </StackingCardsContext.Provider>
  );
}

export function StackingCardItem({
  index,
  topPosition,
  className,
  children,
  style,
  ...props
}) {
  const {
    progress,
    scaleMultiplier,
    totalCards = 0,
  } = useStackingCardsContext();

  const mult = scaleMultiplier ?? 0.03;
  const scaleTo = 1 - (totalCards - index) * mult;
  const rangeScale = [index * (1 / Math.max(totalCards, 1)), 1];
  const scale = useTransform(progress, rangeScale, [1, scaleTo]);
  const top = topPosition ?? `calc(90px + ${index * 18}px)`;

  return (
    <div className={cn("sticky top-0 w-full", className)} {...props}>
      <motion.div
        className="origin-top relative w-full h-full"
        style={{ top, scale, ...style }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export { StackingCards };
