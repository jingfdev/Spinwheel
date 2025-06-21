import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import WheelSegment from "./WheelSegment";
import { getRandomColor, calculateWinningSegment } from "@/lib/wheelUtils";
import type { WheelSegment as WheelSegmentType } from "@shared/schema";

interface SpinWheelProps {
  segments: WheelSegmentType[];
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinComplete: (result: string) => void;
  onResetResult: () => void;
}

export default function SpinWheel({ 
  segments, 
  isSpinning, 
  onSpinStart, 
  onSpinComplete, 
  onResetResult 
}: SpinWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSpin = () => {
    if (isSpinning || segments.length === 0) return;
    
    onSpinStart();
    onResetResult();
    
    // Generate random rotation (5+ full rotations + random position)
    const randomRotation = Math.floor(Math.random() * 360) + 1800;
    const finalRotation = rotation + randomRotation;
    
    setRotation(finalRotation);
    
    // Play spin sound if enabled
    if (soundEnabled) {
      console.log('🔊 Spin sound effect');
    }
    
    // Calculate result after animation completes
    setTimeout(() => {
      const winningSegment = calculateWinningSegment(finalRotation, segments);
      onSpinComplete(winningSegment.label);
      
      // Play win sound if enabled
      if (soundEnabled) {
        console.log('🎉 Win sound effect');
      }
    }, 4000);
  };

  const segmentAngle = segments.length > 0 ? 360 / segments.length : 0;

  return (
    <div className="flex flex-col items-center">
      
      {/* Wheel Container */}
      <div className="relative mb-8">
        {/* Pulse Ring Animation */}
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-pulse-ring opacity-30"></div>
        
        {/* Wheel Base */}
        <div className="relative w-80 h-80 md:w-96 md:h-96 bg-white rounded-full shadow-2xl border-8 border-gray-200 overflow-hidden">
          
          {/* Wheel Container with Animation */}
          <motion.div
            className="w-full h-full relative"
            animate={{ rotate: rotation }}
            transition={{ 
              duration: isSpinning ? 4 : 0,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {segments.map((segment, index) => (
              <WheelSegment
                key={segment.id}
                segment={segment}
                angle={segmentAngle}
                rotation={index * segmentAngle}
                isSpinning={isSpinning}
              />
            ))}
            
            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-xl border-4 border-white z-10">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-6 h-12 bg-gradient-to-b from-amber-400 to-yellow-600 clip-triangle shadow-lg border-2 border-white"></div>
          <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full border-2 border-white shadow-lg transform -translate-y-3"></div>
        </div>
      </div>

      {/* Spin Button */}
      <Button
        onClick={handleSpin}
        disabled={isSpinning || segments.length === 0}
        className="group relative px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-xl font-bold h-auto"
      >
        <span className="flex items-center justify-center text-white">
          <motion.i 
            className="fas fa-play mr-3"
            animate={{ rotate: isSpinning ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          />
          {isSpinning ? "Spinning..." : "SPIN!"}
        </span>
      </Button>

      {/* Sound Controls */}
      <div className="mt-6 flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sound-toggle"
            checked={soundEnabled}
            onCheckedChange={(checked) => setSoundEnabled(checked as boolean)}
          />
          <Label htmlFor="sound-toggle" className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <i className="fas fa-volume-up"></i>
            <span>Sound Effects</span>
          </Label>
        </div>
      </div>

      {segments.length === 0 && (
        <p className="text-gray-400 text-center mt-4">
          Add some segments to start spinning!
        </p>
      )}
    </div>
  );
}
