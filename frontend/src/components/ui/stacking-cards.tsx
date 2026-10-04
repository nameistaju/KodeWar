"use client";

import React, {
  createContext,
  useContext,
  useRef,
  type HTMLAttributes,
  type PropsWithChildren,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  type UseScrollOptions,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface StackingCardsProps
  extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  scrollOptions?: UseScrollOptions;
  scaleMultiplier?: number;
  totalCards: number;
}

interface StackingCardItemProps
  extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
  index: number;
  topPosition?: string;
}

interface StackingCardsContextType {
  progress: MotionValue<number>;
  scaleMultiplier?: number;
  totalCards?: number;
}

const StackingCardsContext = createContext<StackingCardsContextType | null>(null);

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
}: StackingCardsProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
    ...scrollOptions,
  });

  return (
    <StackingCardsContext.Provider
      value={{ progress: scrollYProgress, scaleMultiplier, totalCards }}
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
}: StackingCardItemProps) {
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
