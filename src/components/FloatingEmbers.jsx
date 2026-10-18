import React, { useMemo } from 'react';

export function FloatingEmbers({ count = 28 }) {
  const embers = useMemo(() => {
    const colors = [
      'rgba(255, 42, 68, 0.75)',   // Crimson red
      'rgba(245, 197, 24, 0.7)',   // Golden bough amber
      'rgba(176, 38, 255, 0.65)',  // WAW purple
      'rgba(255, 87, 34, 0.7)'     // Fiery orange
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // 0% - 100%
      size: Math.random() * 3.5 + 2, // 2px - 5.5px
      duration: Math.random() * 14 + 10, // 10s - 24s
      delay: Math.random() * 10, // 0s - 10s
      color: colors[Math.floor(Math.random() * colors.length)],
      blur: Math.random() * 3 + 1
    }));
  }, [count]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
    >
      {embers.map((ember) => (
        <span
          key={ember.id}
          style={{
            position: 'absolute',
            bottom: '-20px',
            left: `${ember.left}%`,
            width: `${ember.size}px`,
            height: `${ember.size}px`,
            borderRadius: '50%',
            background: ember.color,
            boxShadow: `0 0 ${ember.blur * 4}px ${ember.color}`,
            animation: `driftUp ${ember.duration}s linear infinite`,
            animationDelay: `${ember.delay}s`,
            opacity: 0
          }}
        />
      ))}

      <style>{`
        @keyframes driftUp {
          0% {
            transform: translateY(0) translateX(0) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          50% {
            transform: translateY(-50vh) translateX(18px) scale(1.1);
            opacity: 0.9;
          }
          85% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-105vh) translateX(-18px) scale(0.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
