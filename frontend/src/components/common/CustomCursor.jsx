'use client';

import React, { useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const SPRING = {
  mass: 0.12,
  damping: 14,
  stiffness: 140,
};

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for floating logo follower
  const xSpring = useSpring(mouseX, SPRING);
  const ySpring = useSpring(mouseY, SPRING);
  const opacitySpring = useSpring(0, SPRING);
  const scaleSpring = useSpring(1, SPRING);

  useEffect(() => {
    // Disable on touch / mobile devices
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches) {
      return;
    }

    let pointerMoveRaf = null;
    let hoverRaf = null;
    let pendingX = -100;
    let pendingY = -100;

    const handlePointerMove = (e) => {
      pendingX = e.clientX + 14;
      pendingY = e.clientY + 14;
      if (!pointerMoveRaf) {
        pointerMoveRaf = requestAnimationFrame(() => {
          mouseX.set(pendingX);
          mouseY.set(pendingY);
          opacitySpring.set(1);
          pointerMoveRaf = null;
        });
      }
    };

    const handlePointerLeave = () => {
      opacitySpring.set(0);
    };

    const handlePointerEnter = () => {
      opacitySpring.set(1);
    };

    const handleMouseOver = (e) => {
      if (hoverRaf) return;
      hoverRaf = requestAnimationFrame(() => {
        const target = e.target.closest('a, button, input, textarea, select, .cursor-pointer, [role="button"]');
        if (target) {
          scaleSpring.set(1.25);
        } else {
          scaleSpring.set(1);
        }
        hoverRaf = null;
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerover', handleMouseOver, { passive: true });
    document.body.addEventListener('pointerleave', handlePointerLeave);
    document.body.addEventListener('pointerenter', handlePointerEnter);

    return () => {
      if (pointerMoveRaf) cancelAnimationFrame(pointerMoveRaf);
      if (hoverRaf) cancelAnimationFrame(hoverRaf);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerover', handleMouseOver);
      document.body.removeEventListener('pointerleave', handlePointerLeave);
      document.body.removeEventListener('pointerenter', handlePointerEnter);
    };
  }, [mouseX, mouseY, opacitySpring, scaleSpring]);

  return (
    <motion.div
      style={{
        x: xSpring,
        y: ySpring,
        opacity: opacitySpring,
        scale: scaleSpring,
      }}
      className="custom-cursor-follower"
      aria-hidden="true"
    >
      <img
        src="/favicon.svg"
        alt=""
        className="custom-cursor-favicon"
      />
    </motion.div>
  );
}
