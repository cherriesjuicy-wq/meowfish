import { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  char: string;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  createdAt: number;
}

export default function CursorTrail() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const particleId = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const dist = Math.hypot(clientX - lastPos.current.x, clientY - lastPos.current.y);

      // Only spawn if mouse has moved a tiny bit to avoid clumping
      if (dist > 8) {
        lastPos.current = { x: clientX, y: clientY };
        
        const chars = ['✨', '💖', '⭐', '💕', '🌸', '🍬', '💫'];
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        
        // Add random dispersion velocities
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.5;
        const vx = Math.cos(angle) * speed;
        // Gravity style falling effect (slightly down)
        const vy = Math.sin(angle) * speed + 0.5; 

        const newParticle: Particle = {
          id: particleId.current++,
          x: clientX,
          y: clientY,
          char: randomChar,
          vx,
          vy,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 5,
          scale: Math.random() * 0.4 + 0.8, // size variation
          createdAt: Date.now(),
        };

        setParticles((prev) => [...prev, newParticle]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update particles loop
  useEffect(() => {
    let animFrame: number;
    
    const update = () => {
      const now = Date.now();
      const lifeSpan = 800; // 0.8s

      setParticles((prev) =>
        prev
          .map((p) => {
            const age = now - p.createdAt;
            const progress = age / lifeSpan;
            return {
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy + 0.3, // apply small gravity
              vy: p.vy + 0.05, // accelerate downward slightly
              rotation: p.rotation + p.rotationSpeed,
              scale: (1 - progress) * p.scale, // shrink over time
            };
          })
          // Filter out particles older than 800ms
          .filter((p) => now - p.createdAt < lifeSpan)
      );

      animFrame = requestAnimationFrame(update);
    };

    animFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
      {particles.map((p) => {
        const now = Date.now();
        const age = now - p.createdAt;
        const opacity = Math.max(0, 1 - age / 800);

        return (
          <span
            key={p.id}
            className="absolute text-sm leading-none font-sans filter drop-shadow-[0_1px_4px_rgba(255,105,180,0.4)]"
            style={{
              left: p.x,
              top: p.y,
              opacity,
              transform: `translate(-50%, -50%) scale(${p.scale}) rotate(${p.rotation}deg)`,
            }}
          >
            {p.char}
          </span>
        );
      })}
    </div>
  );
}
