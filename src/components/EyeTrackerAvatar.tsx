import React, { useEffect, useRef, useState } from "react";

interface EyeTrackerAvatarProps {
  size?: number; // default 40
  className?: string;
}

export const EyeTrackerAvatar: React.FC<EyeTrackerAvatarProps> = ({
  size = 40,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Track mouse coordinates and calculate pupil offsets
  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate for Left Eye
        if (leftEyeRef.current) {
          const rect = leftEyeRef.current.getBoundingClientRect();
          const eyeCenterX = rect.left + rect.width / 2;
          const eyeCenterY = rect.top + rect.height / 2;
          const dx = mouseX - eyeCenterX;
          const dy = mouseY - eyeCenterY;
          const angle = Math.atan2(dy, dx);
          // Maximum pupil travel distance inside eye socket (approx 2.5px for 40px avatar)
          const maxDistance = size * 0.07;
          const distance = Math.min(maxDistance, Math.hypot(dx, dy) / 35);
          setLeftPupil({
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
          });
        }

        // Calculate for Right Eye
        if (rightEyeRef.current) {
          const rect = rightEyeRef.current.getBoundingClientRect();
          const eyeCenterX = rect.left + rect.width / 2;
          const eyeCenterY = rect.top + rect.height / 2;
          const dx = mouseX - eyeCenterX;
          const dy = mouseY - eyeCenterY;
          const angle = Math.atan2(dy, dx);
          const maxDistance = size * 0.07;
          const distance = Math.min(maxDistance, Math.hypot(dx, dy) / 35);
          setRightPupil({
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [size]);

  // Periodic natural blinking
  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 140);
    };

    const interval = setInterval(() => {
      // 80% chance of single blink, 20% double blink
      triggerBlink();
      if (Math.random() > 0.75) {
        setTimeout(triggerBlink, 260);
      }
    }, 4200 + Math.random() * 2500);

    return () => clearInterval(interval);
  }, []);

  // Proportional sizing based on `size`
  const eyeWidth = size * 0.26; // ~10.4px
  const eyeHeight = size * 0.32; // ~12.8px
  const pupilSize = size * 0.16; // ~6.4px
  const highlightSize = size * 0.055; // ~2.2px

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: size, height: size }}
      className={`relative rounded-full bg-[#D4F050] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] flex items-center justify-center select-none overflow-hidden transition-transform duration-200 group-hover:scale-105 ${className}`}
      title="Avdhesh's Interactive Mascot"
      aria-label="Interactive Green Mascot Logo"
    >
      {/* Subtle 3D glossy highlight on top curve */}
      <div className="absolute top-1 left-2 w-3/5 h-2/5 rounded-full bg-white/25 blur-[1px] pointer-events-none" />

      {/* Cheeks Blush */}
      <div
        className="absolute w-2 h-1 rounded-full bg-[#bfdd34] opacity-80"
        style={{ left: size * 0.12, top: size * 0.52 }}
      />
      <div
        className="absolute w-2 h-1 rounded-full bg-[#bfdd34] opacity-80"
        style={{ right: size * 0.12, top: size * 0.52 }}
      />

      {/* Eyes Container */}
      <div
        className="flex items-center justify-between"
        style={{ width: size * 0.62, marginTop: -size * 0.1 }}
      >
        {/* Left Eye */}
        <div
          ref={leftEyeRef}
          style={{
            width: eyeWidth,
            height: isBlinking ? 2 : eyeHeight,
            transition: "height 0.08s ease-in-out",
          }}
          className="relative bg-white rounded-full border-[1.5px] border-[#141413] flex items-center justify-center overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]"
        >
          {!isBlinking && (
            <div
              style={{
                width: pupilSize,
                height: pupilSize,
                transform: `translate(${leftPupil.x}px, ${leftPupil.y}px)`,
                transition: "transform 0.05s ease-out",
              }}
              className="relative bg-[#141413] rounded-full flex items-center justify-center shrink-0"
            >
              {/* Specular White Catchlight in Pupil */}
              <div
                style={{
                  width: highlightSize,
                  height: highlightSize,
                  top: highlightSize * 0.5,
                  right: highlightSize * 0.5,
                }}
                className="absolute bg-white rounded-full pointer-events-none"
              />
            </div>
          )}
        </div>

        {/* Right Eye */}
        <div
          ref={rightEyeRef}
          style={{
            width: eyeWidth,
            height: isBlinking ? 2 : eyeHeight,
            transition: "height 0.08s ease-in-out",
          }}
          className="relative bg-white rounded-full border-[1.5px] border-[#141413] flex items-center justify-center overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]"
        >
          {!isBlinking && (
            <div
              style={{
                width: pupilSize,
                height: pupilSize,
                transform: `translate(${rightPupil.x}px, ${rightPupil.y}px)`,
                transition: "transform 0.05s ease-out",
              }}
              className="relative bg-[#141413] rounded-full flex items-center justify-center shrink-0"
            >
              {/* Specular White Catchlight in Pupil */}
              <div
                style={{
                  width: highlightSize,
                  height: highlightSize,
                  top: highlightSize * 0.5,
                  right: highlightSize * 0.5,
                }}
                className="absolute bg-white rounded-full pointer-events-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Cute Expressive Smile / Mouth */}
      <div
        className="absolute transition-all duration-200"
        style={{
          bottom: size * 0.18,
          width: isHovered ? size * 0.32 : size * 0.24,
          height: isHovered ? size * 0.16 : size * 0.1,
        }}
      >
        <svg
          viewBox="0 0 24 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {isHovered ? (
            // Big open happy smile when hovered
            <path
              d="M2 3C4 12 20 12 22 3"
              stroke="#141413"
              strokeWidth="3"
              strokeLinecap="round"
              fill="#141413"
            />
          ) : (
            // Cute gentle curve smile
            <path
              d="M3 4C6 11 18 11 21 4"
              stroke="#141413"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>
    </div>
  );
};
