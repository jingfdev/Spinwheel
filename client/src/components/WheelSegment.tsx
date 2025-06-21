import { motion } from "framer-motion";
import type { WheelSegment } from "@shared/schema";

interface WheelSegmentProps {
  segment: WheelSegment;
  angle: number;
  rotation: number;
  isSpinning: boolean;
}

export default function WheelSegment({ segment, angle, rotation, isSpinning }: WheelSegmentProps) {
  // Create the CSS clip-path for the segment
  const clipPath = `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((angle * Math.PI) / 180)}% ${50 - 50 * Math.sin((angle * Math.PI) / 180)}%)`;
  
  // Calculate text position and rotation
  const textAngle = angle / 2;
  const textRadius = 35; // Distance from center as percentage
  const textX = 50 + textRadius * Math.cos((textAngle * Math.PI) / 180);
  const textY = 50 - textRadius * Math.sin((textAngle * Math.PI) / 180);

  return (
    <div
      className={`wheel-segment absolute w-full h-full bg-gradient-to-br ${segment.color}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        clipPath,
      }}
    >
      <div
        className="absolute text-white text-sm font-semibold"
        style={{
          left: `${textX}%`,
          top: `${textY}%`,
          transform: `translate(-50%, -50%) rotate(${textAngle}deg)`,
          textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
          fontSize: Math.max(10, Math.min(14, 120 / segment.label.length)) + 'px'
        }}
      >
        {segment.label}
      </div>
    </div>
  );
}
