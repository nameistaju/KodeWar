import React, { useState, useEffect } from 'react';

export default function CloudWatchFace({ isTyping = false }) {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const handleMouse = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const offsetX = ((cursor.x / window.innerWidth) - 0.5) * 20;
    const offsetY = ((cursor.y / window.innerHeight) - 0.5) * 12;
    const clampedX = Math.max(-5, Math.min(5, offsetX));
    const clampedY = Math.max(-3, Math.min(3, offsetY));
    setEyePos({ x: clampedX, y: clampedY });
  }, [cursor]);

  // Blinking every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cloud-watch-face-wrap">
      <div className="cloud-watch-face-container">
        <img
          src="/Grayscale Watercolor Cloud Blot.png"
          alt="Watercolor Cloud Character"
          className="cloud-watch-face-img"
        />

        {['left', 'right'].map((side, idx) => (
          <div
            key={side}
            className="cloud-watch-eye"
            style={{
              top: 66,
              left: idx === 0 ? 88 : 154,
              width: 26,
              height: isTyping
                ? 4 // fully closed when typing password
                : blink
                ? 6 // temporary blink
                : 38, // open eye
              borderRadius: isTyping || blink ? '2px' : '50% / 60%',
              backgroundColor: isTyping ? '#111216' : '#FFFFFF',
              boxShadow: isTyping ? 'none' : '0 2px 6px rgba(0, 0, 0, 0.4), inset 0 0 2px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.15s ease',
            }}
          >
            {!isTyping && (
              <div
                className="cloud-watch-pupil"
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: '50%',
                  backgroundColor: '#050505',
                  marginBottom: 3,
                  transform: `translate(${eyePos.x}px, ${eyePos.y}px)`,
                  transition: 'transform 0.08s ease-out',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
