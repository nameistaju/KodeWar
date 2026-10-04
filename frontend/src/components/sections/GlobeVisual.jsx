import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import landPoints from '../../data/globeLandPoints.json';

// Global hubs coordinates [lat, lon]
const HUBS = [
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, isHQ: true },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
  { name: 'San Francisco', lat: 37.7749, lon: -122.4194 }
];

// Helper to convert lat/lon in degrees to 3D Cartesian coordinates
function latLonToVector(latDeg, lonDeg) {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return [
    Math.cos(lat) * Math.sin(lon),
    -Math.sin(lat),
    Math.cos(lat) * Math.cos(lon)
  ];
}

const HUB_VECTORS = HUBS.map(h => ({
  ...h,
  v: latLonToVector(h.lat, h.lon)
}));

// Arcs between hubs
const ARCS = [
  { from: HUB_VECTORS[0], to: HUB_VECTORS[1] }, // Hyderabad -> Dubai
  { from: HUB_VECTORS[0], to: HUB_VECTORS[2] }, // Hyderabad -> Singapore
  { from: HUB_VECTORS[0], to: HUB_VECTORS[3] }, // Hyderabad -> London
  { from: HUB_VECTORS[3], to: HUB_VECTORS[4] }, // London -> New York
  { from: HUB_VECTORS[4], to: HUB_VECTORS[5] }  // New York -> San Francisco
];

export default function GlobeVisual() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const pointerDown = useRef(false);
  const lastPointerX = useRef(0);
  const lastPointerY = useRef(0);
  const phiRef = useRef(1.4); // Initial rotation angle
  const thetaRef = useRef(0.24); // Slight axial tilt
  const velocityPhi = useRef(0.0035);
  const velocityTheta = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let size = 480;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const baseRotationSpeed = prefersReduced ? 0 : 0.0035;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const rawSize = Math.floor(Math.min(rect.width || 480, rect.height || 480));
      size = Math.max(rawSize, 280);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    };

    resize();
    window.addEventListener('resize', resize);

    // 3D rotation math
    const rotatePoint = (p, cosP, sinP, cosT, sinT) => {
      // Rotate around Y axis (phi)
      const x1 = p[0] * cosP + p[2] * sinP;
      const z1 = -p[0] * sinP + p[2] * cosP;
      // Rotate around X axis (theta)
      const y2 = p[1] * cosT - z1 * sinT;
      const z2 = p[1] * sinT + z1 * cosT;
      return [x1, y2, z2];
    };

    let pulseTime = 0;

    const render = () => {
      // Auto-rotation when not interacting
      if (!pointerDown.current) {
        phiRef.current += velocityPhi.current;
        thetaRef.current += velocityTheta.current;
        // Dampen manual throw velocity back to base speed
        velocityPhi.current = velocityPhi.current * 0.95 + baseRotationSpeed * 0.05;
        velocityTheta.current *= 0.92;
        // Keep tilt bounded
        thetaRef.current = Math.max(-0.6, Math.min(0.6, thetaRef.current));
      }

      pulseTime += 0.035;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const cx = size / 2;
      const cy = size / 2;
      const radius = size * 0.42;

      // 1. Monochromatic Atmospheric Sphere Aura
      const haloGrad = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius * 1.15);
      haloGrad.addColorStop(0, 'rgba(255, 255, 255, 0.09)');
      haloGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.025)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Sphere base boundary (very faint dark graphite sphere)
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(12, 12, 16, 0.85)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const cosP = Math.cos(phiRef.current);
      const sinP = Math.sin(phiRef.current);
      const cosT = Math.cos(thetaRef.current);
      const sinT = Math.sin(thetaRef.current);

      // 2. Latitude rings in pure subtle gray
      const latRings = [-0.5, 0, 0.5];
      latRings.forEach(latY => {
        const ringRadius = Math.sqrt(Math.max(0, 1 - latY * latY));
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.15) {
          const pt = [ringRadius * Math.sin(a), latY, ringRadius * Math.cos(a)];
          const r = rotatePoint(pt, cosP, sinP, cosT, sinT);
          if (r[2] > -0.2) {
            const sx = cx + r[0] * radius;
            const sy = cy + r[1] * radius;
            if (a === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // 3. Render Land Points (Pure White / Silver / Gray dots with depth shading)
      const count = landPoints.length;
      for (let i = 0; i < count; i++) {
        const p = landPoints[i];
        const r = rotatePoint(p, cosP, sinP, cosT, sinT);
        const z = r[2]; // Depth: -1 is back, +1 is front

        // Only render points visible on the front or near edges
        if (z > -0.25) {
          const sx = cx + r[0] * radius;
          const sy = cy + r[1] * radius;

          // Depth attenuation: front points are crisp pure white, sides are silver
          const alpha = Math.max(0.12, (z + 0.25) / 1.25);
          const dotSize = Math.max(0.7, 0.8 + z * 0.9);

          ctx.beginPath();
          ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      // 4. Render Telemetry Arcs (Monochrome Silver/White curves)
      ARCS.forEach(arc => {
        const rFrom = rotatePoint(arc.from.v, cosP, sinP, cosT, sinT);
        const rTo = rotatePoint(arc.to.v, cosP, sinP, cosT, sinT);

        // Only draw arc if at least one endpoint is on front hemisphere
        if (rFrom[2] > -0.35 || rTo[2] > -0.35) {
          const avgZ = (rFrom[2] + rTo[2]) / 2;
          const arcAlpha = Math.max(0.15, (avgZ + 0.35) / 1.35) * 0.7;

          const sx1 = cx + rFrom[0] * radius;
          const sy1 = cy + rFrom[1] * radius;
          const sx2 = cx + rTo[0] * radius;
          const sy2 = cy + rTo[1] * radius;

          // Midpoint elevated off surface
          const midX = (rFrom[0] + rTo[0]) / 2;
          const midY = (rFrom[1] + rTo[1]) / 2;
          const midZ = (rFrom[2] + rTo[2]) / 2;
          const midLen = Math.hypot(midX, midY, midZ) || 1;
          const elevatedScale = 1.24;
          const rMidElevated = [
            (midX / midLen) * elevatedScale,
            (midY / midLen) * elevatedScale,
            (midZ / midLen) * elevatedScale
          ];
          const smx = cx + rMidElevated[0] * radius;
          const smy = cy + rMidElevated[1] * radius;

          ctx.beginPath();
          ctx.moveTo(sx1, sy1);
          ctx.quadraticCurveTo(smx, smy, sx2, sy2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${arcAlpha.toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      // 5. Render Hub Nodes (Bright white glowing dots with pulsing rings)
      HUB_VECTORS.forEach(hub => {
        const r = rotatePoint(hub.v, cosP, sinP, cosT, sinT);
        if (r[2] > -0.15) {
          const sx = cx + r[0] * radius;
          const sy = cy + r[1] * radius;
          const depthAlpha = Math.max(0.3, (r[2] + 0.15) / 1.15);

          // Pulsing halo ring
          const pulseRadius = 3 + Math.sin(pulseTime + hub.lat) * 2;
          ctx.beginPath();
          ctx.arc(sx, sy, pulseRadius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${(0.4 * depthAlpha).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Core node dot
          ctx.beginPath();
          ctx.arc(sx, sy, hub.isHQ ? 3.5 : 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha.toFixed(3)})`;
          ctx.fill();
        }
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  // Pointer Drag Interaction
  const handlePointerDown = (e) => {
    pointerDown.current = true;
    lastPointerX.current = e.clientX;
    lastPointerY.current = e.clientY;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grabbing';
    }
  };

  const handlePointerMove = (e) => {
    if (!pointerDown.current) return;
    const dx = e.clientX - lastPointerX.current;
    const dy = e.clientY - lastPointerY.current;
    lastPointerX.current = e.clientX;
    lastPointerY.current = e.clientY;

    const factor = 0.0055;
    phiRef.current += dx * factor;
    thetaRef.current = Math.max(-0.65, Math.min(0.65, thetaRef.current + dy * factor));
    velocityPhi.current = dx * 0.002;
    velocityTheta.current = dy * 0.002;
  };

  const handlePointerUp = () => {
    pointerDown.current = false;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  };

  return (
    <div ref={containerRef} className="hero-globe-wrapper">
      <div className="globe-ambient-glow"></div>
      <canvas
        ref={canvasRef}
        className="hero-globe-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      {/* Earth Top Right Portal: Businessman -> /digital-marketing */}
      <Link
        to="/digital-marketing"
        className="globe-floating-portal portal-top-right"
        title="Digital Marketing Solutions"
      >
        <img
          src="/businessMan.png"
          alt="Digital Marketing Solutions"
          className="globe-portal-img"
        />
      </Link>

      {/* Earth Bottom Left Portal: Cheerful Student -> /careers */}
      <Link
        to="/careers"
        className="globe-floating-portal portal-bottom-left"
        title="Student Careers & Training"
      >
        <img
          src="/Cheerful Student.png"
          alt="Student Careers"
          className="globe-portal-img"
        />
      </Link>
    </div>
  );
}
