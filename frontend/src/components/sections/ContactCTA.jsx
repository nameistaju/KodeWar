import React, { useEffect, useRef } from 'react';

export default function ContactCTA() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let hoverAlphaMult = 1.0;
    let targetHoverAlphaMult = 1.0;

    let isVisible = true;
    let animFrameId = null;
    let lastTime = 0;

    const isMobile = window.innerWidth <= 768;
    const numRings = isMobile ? 5 : 7;
    const rings = [];
    const burstRings = [];

    function createRings() {
      rings.length = 0;
      const baseMinR = isMobile ? 25 : 45;
      const baseMaxR = isMobile ? 260 : 440;

      for (let i = 0; i < numRings; i++) {
        const progress = i / numRings;
        const radius = baseMinR + (baseMaxR - baseMinR) * progress;
        const speed = 18 + (i % 3) * 6 + Math.random() * 3;
        const baseAlpha = 0.16 + (i % 3) * 0.08;
        const lineWidth = i % 2 === 0 ? 1.2 : 0.9;
        const rotationSpeed = (i % 2 === 0 ? 1 : -1) * (0.015 + Math.random() * 0.01);

        let gaps = [];
        if (i === 1) {
          gaps = [{ start: 0.2 * Math.PI, end: 1.7 * Math.PI }, { start: 1.8 * Math.PI, end: 2.1 * Math.PI }];
        } else if (i === 3) {
          gaps = [{ start: 0.1 * Math.PI, end: 1.1 * Math.PI }, { start: 1.25 * Math.PI, end: 1.95 * Math.PI }];
        } else if (i === 5) {
          gaps = [{ start: 0.35 * Math.PI, end: 1.85 * Math.PI }];
        } else {
          gaps = [{ start: 0, end: 2 * Math.PI }];
        }

        rings.push({
          radius,
          minRadius: baseMinR,
          maxRadius: baseMaxR,
          speed,
          baseAlpha,
          lineWidth,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed,
          gaps
        });
      }
    }

    function resize() {
      const rect = section.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      createRings();

      if (prefersReducedMotion.matches) {
        drawStatic();
      }
    }

    const onMouseMove = (e) => {
      const rect = section.getBoundingClientRect();
      const cX = width / 2;
      const cY = height * 0.48;
      const relX = e.clientX - rect.left - cX;
      const relY = e.clientY - rect.top - cY;
      const maxOffset = 25;
      targetMouseX = Math.max(-maxOffset, Math.min(maxOffset, relX * 0.08));
      targetMouseY = Math.max(-maxOffset, Math.min(maxOffset, relY * 0.08));
    };

    const onMouseEnter = () => {
      targetHoverAlphaMult = 1.3;
    };

    const onMouseLeave = () => {
      targetHoverAlphaMult = 1.0;
      targetMouseX = 0;
      targetMouseY = 0;
    };

    const onClick = (e) => {
      if (prefersReducedMotion.matches) return;
      const rect = section.getBoundingClientRect();
      const cX = width / 2;
      const cY = height * 0.48;
      const clickX = (e.clientX - rect.left - cX) * 0.15;
      const clickY = (e.clientY - rect.top - cY) * 0.15;

      burstRings.push({
        xOffset: clickX,
        yOffset: clickY,
        radius: 15,
        maxRadius: Math.min(width, height) * 0.45,
        speed: 380,
        alpha: 0.65,
        lineWidth: 1.8
      });
    };

    section.addEventListener('mousemove', onMouseMove);
    section.addEventListener('mouseenter', onMouseEnter);
    section.addEventListener('mouseleave', onMouseLeave);
    section.addEventListener('click', onClick);

    function drawStatic() {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height * 0.48;

      rings.forEach((ring) => {
        const opacity = ring.baseAlpha * 0.7;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity.toFixed(3)})`;
        ctx.lineWidth = ring.lineWidth;
        ctx.beginPath();
        ring.gaps.forEach((arcSeg) => {
          ctx.arc(centerX, centerY, ring.radius, arcSeg.start, arcSeg.end);
        });
        ctx.stroke();
      });
    }

    function render(time) {
      if (!isVisible || prefersReducedMotion.matches) return;

      if (!lastTime) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      hoverAlphaMult += (targetHoverAlphaMult - hoverAlphaMult) * 0.05;

      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2 + mouseX;
      const centerY = height * 0.48 + mouseY;

      rings.forEach((ring) => {
        ring.radius += ring.speed * dt;
        if (ring.radius > ring.maxRadius) {
          ring.radius = ring.minRadius;
        }

        ring.rotation += ring.rotationSpeed * dt;

        const normR = (ring.radius - ring.minRadius) / (ring.maxRadius - ring.minRadius);
        let opacityFactor = 1.0;
        if (normR < 0.15) {
          opacityFactor = normR / 0.15;
        } else {
          opacityFactor = Math.pow(1 - normR, 1.2);
        }

        const opacity = Math.max(0, Math.min(1, ring.baseAlpha * opacityFactor * hoverAlphaMult));

        if (opacity > 0.005) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity.toFixed(3)})`;
          ctx.lineWidth = ring.lineWidth;
          ctx.beginPath();
          ring.gaps.forEach((arcSeg) => {
            ctx.arc(
              centerX,
              centerY,
              ring.radius,
              arcSeg.start + ring.rotation,
              arcSeg.end + ring.rotation
            );
          });
          ctx.stroke();
        }
      });

      for (let i = burstRings.length - 1; i >= 0; i--) {
        const burst = burstRings[i];
        burst.radius += burst.speed * dt;

        const normR = burst.radius / burst.maxRadius;
        const opacity = Math.max(0, burst.alpha * (1 - normR));

        if (burst.radius >= burst.maxRadius || opacity <= 0.01) {
          burstRings.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity.toFixed(3)})`;
        ctx.lineWidth = burst.lineWidth * (1 - normR * 0.5);
        ctx.beginPath();
        ctx.arc(centerX + burst.xOffset, centerY + burst.yOffset, burst.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      animFrameId = requestAnimationFrame(render);
    }

    function startAnimation() {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      lastTime = 0;
      animFrameId = requestAnimationFrame(render);
    }

    function stopAnimation() {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible = true;
          startAnimation();
        } else {
          isVisible = false;
          stopAnimation();
        }
      });
    }, { threshold: 0.05 });

    observer.observe(section);

    window.addEventListener('resize', resize);
    resize();

    return () => {
      observer.disconnect();
      stopAnimation();
      section.removeEventListener('mousemove', onMouseMove);
      section.removeEventListener('mouseenter', onMouseEnter);
      section.removeEventListener('mouseleave', onMouseLeave);
      section.removeEventListener('click', onClick);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section id="final" ref={sectionRef}>
      <canvas className="magic-rings-canvas" ref={canvasRef} id="magicRingsCanvas"></canvas>
      <div className="final-glow"></div>
      <div className="final-content">
        <div className="eyebrow reveal" style={{ justifyContent: 'center' }}>Let's build</div>
        <h2 className="reveal" style={{ marginTop: '20px' }}>
          Ready when<br />you are.
        </h2>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '40px' }}>
          <a href="mailto:kodewartechnologies@gmail.com" className="btn-primary reveal">
            Email the studio
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
