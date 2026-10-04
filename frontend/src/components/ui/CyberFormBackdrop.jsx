import React, { useEffect, useRef } from 'react';

export default function CyberFormBackdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let ps = [];

    const setSize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || window.innerWidth;
      canvas.height = rect.height || 800;
    };
    setSize();

    const make = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      v: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.35 + 0.15,
    });

    const init = () => {
      ps = [];
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      for (let i = 0; i < count; i++) ps.push(make());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ps.forEach((p) => {
        p.y -= p.v;
        if (p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + Math.random() * 40;
          p.v = Math.random() * 0.25 + 0.05;
          p.o = Math.random() * 0.35 + 0.15;
        }
        ctx.fillStyle = `rgba(250, 250, 250, ${p.o})`;
        ctx.fillRect(p.x, p.y, 0.8, 2.4);
      });
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      setSize();
      init();
    };

    window.addEventListener('resize', onResize);
    init();
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Subtle vignette */}
      <div className="cyber-form-vignette" />

      {/* Animated accent lines */}
      <div className="cyber-accent-lines">
        <div className="cyber-hline" />
        <div className="cyber-hline" />
        <div className="cyber-hline" />
        <div className="cyber-vline" />
        <div className="cyber-vline" />
        <div className="cyber-vline" />
      </div>

      {/* Particles canvas */}
      <canvas ref={canvasRef} className="cyber-form-canvas" />
    </>
  );
}
