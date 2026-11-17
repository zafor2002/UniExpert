import React, { useEffect, useRef } from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 80,
  strokeWidth = 7,
  label,
}) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const clampedScore = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;
    circle.style.strokeDashoffset = String(circumference);
    requestAnimationFrame(() => {
      circle.style.transition = 'stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.2, 1)';
      circle.style.strokeDashoffset = String(offset);
    });
  }, [circumference, offset]);

  // Soft pastel colors
  const strokeColor =
    clampedScore >= 80
      ? '#22A375' // Mint green for high match success
      : clampedScore >= 50
      ? '#4285F4' // Soft primary blue
      : '#D97706'; // Warm amber

  return (
    <div className="flex flex-col items-center justify-center" style={{ width: size }}>
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {/* Track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
        </svg>

        {/* Value text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span 
            className="font-bold text-[#1E293B] leading-none"
            style={{ fontSize: size <= 48 ? '12px' : size <= 68 ? '15px' : '18px' }}
          >
            {clampedScore}%
          </span>
        </div>
      </div>

      {label && (
        <span className="text-[10px] text-[#64748B] font-medium mt-1 text-center truncate max-w-full">
          {label}
        </span>
      )}
    </div>
  );
};

export default ScoreRing;
