import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Combined component for 404 page
export default function NotFoundPage() {
  return (
    <div style={{
      width: "100%",
      height: "100vh",
      backgroundColor: "#000000",
      overflowX: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative"
    }}>
      <MessageDisplay />
      <CharactersAnimation />
      <CircleAnimation />
    </div>
  );
}

// 1. Message Display Component
function MessageDisplay() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "90%",
      height: "90%",
      zIndex: 100,
      pointerEvents: "auto"
    }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "opacity 500ms ease",
          opacity: isVisible ? 1 : 0
        }}
      >
        <div style={{
          fontSize: "35px",
          fontWeight: 700,
          color: "#000000",
          margin: "1%",
          fontFamily: "'Sora', 'Inter', sans-serif"
        }}>
          Page Not Found
        </div>
        <div style={{
          fontSize: "80px",
          fontWeight: 900,
          color: "#000000",
          margin: "1%",
          lineHeight: 1,
          fontFamily: "'Sora', 'Inter', sans-serif"
        }}>
          404
        </div>
        <div style={{
          fontSize: "15px",
          width: "50%",
          minWidth: "300px",
          textAlign: "center",
          color: "#000000",
          margin: "1%",
          lineHeight: 1.5,
          fontFamily: "'Inter', sans-serif"
        }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </div>

        <div style={{
          display: "flex",
          gap: "24px",
          marginTop: "32px"
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              color: "#000000",
              border: "2px solid #000000",
              backgroundColor: "transparent",
              padding: "10px 24px",
              fontSize: "16px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              borderRadius: "4px",
              transition: "all 300ms ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#000000";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#000000";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
              border: "2px solid #000000",
              padding: "10px 24px",
              fontSize: "16px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              borderRadius: "4px",
              transition: "all 300ms ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1a1a1a";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#000000";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Characters Animation Component
function CharactersAnimation() {
  const charactersRef = useRef(null);

  useEffect(() => {
    const stickFigures = [
      {
        top: '0%',
        src: 'https://cdn.21st.dev/assets/mirror/54/54f366bdbf75b7a2d3b9f2264c3ada12aefcaf6e6a467bcecc856ffcd686e52e.svg',
        transform: 'rotateZ(-90deg)',
        speedX: 1500,
      },
      {
        top: '10%',
        src: 'https://cdn.21st.dev/assets/mirror/7e/7e48603d6fd3fac9720b25b4b6a06d107feea2d21ef8fa0720921808b9808514.svg',
        speedX: 3000,
        speedRotation: 2000,
      },
      {
        top: '20%',
        src: 'https://cdn.21st.dev/assets/mirror/4f/4fd3a604a36cc8811c341ef3221010ed11e2563d4add29901922d7464c28c186.svg',
        speedX: 5000,
        speedRotation: 1000,
      },
      {
        top: '25%',
        src: 'https://cdn.21st.dev/assets/mirror/54/54f366bdbf75b7a2d3b9f2264c3ada12aefcaf6e6a467bcecc856ffcd686e52e.svg',
        speedX: 2500,
        speedRotation: 1500,
      },
      {
        top: '35%',
        src: 'https://cdn.21st.dev/assets/mirror/54/54f366bdbf75b7a2d3b9f2264c3ada12aefcaf6e6a467bcecc856ffcd686e52e.svg',
        speedX: 2000,
        speedRotation: 300,
      },
      {
        bottom: '5%',
        left: '5%',
        src: 'https://cdn.21st.dev/assets/mirror/66/668d66f4c4d1dbc5c421692b4e5ad644c0f11f0327da214bcae21f78816c6b2f.svg',
        speedX: 0,
      },
    ];

    if (charactersRef.current) {
      charactersRef.current.innerHTML = '';
    }

    stickFigures.forEach((figure, index) => {
      const stick = document.createElement('img');
      stick.classList.add('characters');
      stick.style.position = 'absolute';
      stick.style.width = '18%';
      stick.style.height = '18%';
      stick.style.zIndex = '50';

      if (figure.top) stick.style.top = figure.top;
      if (figure.bottom) stick.style.bottom = figure.bottom;
      if (figure.left) stick.style.left = figure.left;

      stick.src = figure.src;

      if (figure.transform) stick.style.transform = figure.transform;

      charactersRef.current?.appendChild(stick);

      if (index === 5) return;

      stick.animate(
        [{ left: '100%' }, { left: '-20%' }],
        { duration: figure.speedX, easing: 'linear', fill: 'forwards' }
      );

      if (index === 0) return;

      if (figure.speedRotation) {
        stick.animate(
          [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-360deg)' }],
          { duration: figure.speedRotation, iterations: Infinity, easing: 'linear' }
        );
      }
    });

    return () => {
      if (charactersRef.current) {
        charactersRef.current.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (charactersRef.current) {
        charactersRef.current.innerHTML = '';
        charactersRef.current.dispatchEvent(new Event('contentchanged'));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={charactersRef}
      style={{
        position: "absolute",
        width: "99%",
        height: "95%",
        pointerEvents: "none",
        zIndex: 50
      }}
    />
  );
}

// 3. Circle Animation Component
function CircleAnimation() {
  const canvasRef = useRef(null);
  const requestIdRef = useRef(null);
  const timerRef = useRef(0);
  const circulosRef = useRef([]);

  const initArr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    circulosRef.current = [];

    for (let index = 0; index < 300; index++) {
      const randomX = Math.floor(
        Math.random() * ((canvas.width * 3) - (canvas.width * 1.2) + 1)
      ) + (canvas.width * 1.2);

      const randomY = Math.floor(
        Math.random() * ((canvas.height) - (canvas.height * (-0.2) + 1))
      ) + (canvas.height * (-0.2));

      const size = canvas.width / 1000;

      circulosRef.current.push({ x: randomX, y: randomY, size });
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    timerRef.current++;
    context.setTransform(1, 0, 0, 1, 0, 0);

    const distanceX = canvas.width / 80;
    const growthRate = canvas.width / 1000;

    context.fillStyle = 'white';
    context.clearRect(0, 0, canvas.width, canvas.height);

    circulosRef.current.forEach((circulo) => {
      context.beginPath();

      if (timerRef.current < 65) {
        circulo.x = circulo.x - distanceX;
        circulo.size = circulo.size + growthRate;
      }

      if (timerRef.current > 65 && timerRef.current < 500) {
        circulo.x = circulo.x - (distanceX * 0.02);
        circulo.size = circulo.size + (growthRate * 0.2);
      }

      context.arc(circulo.x, circulo.y, circulo.size, 0, 360);
      context.fill();
    });

    if (timerRef.current > 500) {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
      return;
    }

    requestIdRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    timerRef.current = 0;
    initArr();
    draw();

    const handleResize = () => {
      if (!canvas) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      timerRef.current = 0;
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }

      const context = canvas.getContext('2d');
      if (context) {
        context.reset();
      }

      initArr();
      draw();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block"
      }}
    />
  );
}
