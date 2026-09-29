import confetti from "canvas-confetti";

/**
 * Fires an intense explosion of confetti for the specified duration (default 0.30s).
 */
export function triggerIntenseConfetti(durationSeconds = 0.30) {
  const durationMs = durationSeconds * 1000;
  const animationEnd = Date.now() + durationMs;
  const colors = [
    "#D4F050", // Acid Lime
    "#141413", // Pitch Black
    "#FF6B35", // Coral Orange
    "#FFFFFF", // Pure White
    "#4ECDC4", // Teal Cyan
    "#FF007F", // Electric Rose
    "#FFE66D", // Golden Yellow
  ];

  // Immediate high-density center blast
  confetti({
    particleCount: 160,
    spread: 140,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.55 },
    colors,
    ticks: 300,
    gravity: 1.1,
    scalar: 1.15,
    zIndex: 99999,
  });

  // Continuous rapid dual-cannon bursts for 0.30s
  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    // Left cannon spray
    confetti({
      particleCount: 70,
      angle: 55,
      spread: 85,
      startVelocity: 55,
      origin: { x: 0, y: 0.65 },
      colors,
      ticks: 300,
      gravity: 1.1,
      scalar: 1.1,
      zIndex: 99999,
    });

    // Right cannon spray
    confetti({
      particleCount: 70,
      angle: 125,
      spread: 85,
      startVelocity: 55,
      origin: { x: 1, y: 0.65 },
      colors,
      ticks: 300,
      gravity: 1.1,
      scalar: 1.1,
      zIndex: 99999,
    });
  }, 40);
}
