import { useEffect, useState } from 'react';

interface ConfettiProps {
  trigger: boolean;
}

export function Confetti({ trigger }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'][Math.floor(Math.random() * 7)],
        delay: Math.random() * 0.3,
      }));
      setParticles(newParticles);

      setTimeout(() => {
        setParticles([]);
      }, 3000);
    }
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${particle.x}%`,
            top: '-10px',
            animationDelay: `${particle.delay}s`,
          }}
        >
          <div
            className="w-3 h-3 rounded-full animate-spin"
            style={{
              backgroundColor: particle.color,
            }}
          />
        </div>
      ))}
    </div>
  );
}
