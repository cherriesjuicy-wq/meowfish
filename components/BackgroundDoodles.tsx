import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface Doodle {
  id: number;
  char: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  opacity: number;
}

export default function BackgroundDoodles() {
  const [doodles, setDoodles] = useState<Doodle[]>([]);

  useEffect(() => {
    const chars = ['🐟', '𓆝', '🫧', '💖', '✨', '𓆟', '🌸', '🍬', '🍥'];
    const generated: Doodle[] = Array.from({ length: 22 }, (_, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      return {
        id: i,
        char,
        x: Math.random() * 100, // percentage of viewport width
        y: Math.random() * 100, // percentage of viewport height
        size: Math.random() * (char === '𓆝' || char === '𓆟' ? 30 : 18) + 12,
        duration: Math.random() * 20 + 20, // 20s to 40s
        delay: Math.random() * -20, // negative delay so they are already moving
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.15 + 0.15 // 0.15 to 0.3 opacity
      };
    });
    setDoodles(generated);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {doodles.map((d) => (
        <motion.div
          key={d.id}
          className="absolute select-none font-sans"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            fontSize: `${d.size}px`,
            opacity: d.opacity,
            rotate: d.rotation,
          }}
          animate={{
            y: [0, -100, 100, 0],
            x: [0, 50, -50, 0],
            rotate: [d.rotation, d.rotation + 360],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {d.char}
        </motion.div>
      ))}
    </div>
  );
}
