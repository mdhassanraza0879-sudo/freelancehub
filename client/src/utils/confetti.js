import confetti from 'canvas-confetti';

export const triggerCelebration = () => {
  // Center burst
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
  });

  // Left cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'],
    });
  }, 150);

  // Right cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#ec4899', '#10b981', '#6366f1', '#8b5cf6'],
    });
  }, 300);
};

export const triggerStarBurst = () => {
  confetti({
    shapes: ['star'],
    particleCount: 60,
    spread: 360,
    ticks: 60,
    origin: { y: 0.5 },
    colors: ['#ffd700', '#f59e0b', '#6366f1', '#10b981'],
  });
};
