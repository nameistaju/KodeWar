'use client';

import React, {
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useAnimate } from 'motion/react';
import { cn } from '@/lib/utils';
import './image-trail.css';

/**
 * Helper functions
 */
const MathUtils = {
  // linear interpolation
  lerp: (a, b, n) => (1 - n) * a + n * b,
  // distance between two points
  distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
};

export const ImageTrail = ({
  className,
  as = 'div',
  children,
  threshold = 80,
  intensity = 0.25,
  keyframes,
  keyframesOptions,
  repeatChildren = 8,
  trailElementAnimationKeyframes = {
    x: { duration: 0.35, type: 'tween', ease: 'easeOut' },
    y: { duration: 0.35, type: 'tween', ease: 'easeOut' },
  },
  baseZIndex = 0,
  zIndexDirection = 'new-on-top',
  ...props
}) => {
  const allImages = useRef(null);
  const currentId = useRef(0);
  const lastMousePos = useRef(null);
  const cachedMousePos = useRef(null);
  const [containerRef, animate] = useAnimate();
  const zIndices = useRef([]);

  const clampedIntensity = useMemo(
    () => Math.max(0.0001, Math.min(1, intensity)),
    [intensity]
  );

  const containerRectRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      allImages.current = containerRef.current.querySelectorAll('.image-trail-item');

      zIndices.current = Array.from(
        { length: allImages.current.length },
        (_, index) => index
      );

      const updateRect = () => {
        if (containerRef.current) {
          containerRectRef.current = containerRef.current.getBoundingClientRect();
        }
      };
      updateRect();
      window.addEventListener('resize', updateRect);
      return () => window.removeEventListener('resize', updateRect);
    }
  }, [containerRef]);

  const handleMouseEnter = () => {
    if (containerRef.current) {
      containerRectRef.current = containerRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current || !allImages.current || allImages.current.length === 0)
      return;

    if (!containerRectRef.current) {
      containerRectRef.current = containerRef.current.getBoundingClientRect();
    }
    const containerRect = containerRectRef.current;
    const mousePos = {
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top,
    };

    const lastCachedX = cachedMousePos.current ? cachedMousePos.current.x : mousePos.x;
    const lastCachedY = cachedMousePos.current ? cachedMousePos.current.y : mousePos.y;

    cachedMousePos.current = {
      x: MathUtils.lerp(lastCachedX, mousePos.x, clampedIntensity),
      y: MathUtils.lerp(lastCachedY, mousePos.y, clampedIntensity),
    };

    if (!lastMousePos.current) {
      lastMousePos.current = { x: mousePos.x, y: mousePos.y };
      return;
    }

    const prevX = lastMousePos.current.x;
    const prevY = lastMousePos.current.y;

    const distance = MathUtils.distance(mousePos.x, mousePos.y, prevX, prevY);

    if (distance > threshold) {
      const steps = Math.floor(distance / threshold);
      const N = allImages.current.length;

      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const interpX = MathUtils.lerp(prevX, mousePos.x, t);
        const interpY = MathUtils.lerp(prevY, mousePos.y, t);

        const interpCachedX = MathUtils.lerp(lastCachedX, cachedMousePos.current.x, t);
        const interpCachedY = MathUtils.lerp(lastCachedY, cachedMousePos.current.y, t);

        const current = currentId.current;

        if (zIndexDirection === 'new-on-top') {
          for (let i = 0; i < N; i++) {
            if (i !== current) {
              zIndices.current[i] -= 1;
            }
          }
          zIndices.current[current] = N - 1;
        } else {
          for (let i = 0; i < N; i++) {
            if (i !== current) {
              zIndices.current[i] += 1;
            }
          }
          zIndices.current[current] = 0;
        }

        const activeEl = allImages.current[current];
        if (activeEl) {
          activeEl.style.display = 'block';
          allImages.current.forEach((img, index) => {
            img.style.zIndex = String(zIndices.current[index] + baseZIndex);
          });

          const startX = interpCachedX - activeEl.offsetWidth / 2;
          const endX = interpX - activeEl.offsetWidth / 2;
          const startY = interpCachedY - activeEl.offsetHeight / 2;
          const endY = interpY - activeEl.offsetHeight / 2;

          animate(
            activeEl,
            {
              x: [startX, endX],
              y: [startY, endY],
              ...keyframes,
            },
            {
              ...trailElementAnimationKeyframes.x,
              ...trailElementAnimationKeyframes.y,
              ...keyframesOptions,
            }
          );
          currentId.current = (current + 1) % N;
        }
      }

      lastMousePos.current = { x: mousePos.x, y: mousePos.y };
    }
  };

  const ElementTag = as;

  return (
    <ElementTag
      className={cn('image-trail-container', className)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      ref={containerRef}
      {...props}
    >
      {Array.from({ length: repeatChildren }).map((_, i) => (
        <React.Fragment key={i}>{children}</React.Fragment>
      ))}
    </ElementTag>
  );
};

export const ImageTrailItem = ({
  className,
  children,
  as = 'div',
  ...props
}) => {
  const ElementTag = as;
  return (
    <ElementTag
      {...props}
      className={cn('image-trail-item', className)}
    >
      {children}
    </ElementTag>
  );
};

export default ImageTrail;
