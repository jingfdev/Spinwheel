import type { WheelSegment } from "@shared/schema";

// Available color gradients for wheel segments
const colorGradients = [
  'from-red-500 to-red-600',
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
  'from-yellow-500 to-yellow-600',
  'from-purple-500 to-purple-600',
  'from-pink-500 to-pink-600',
  'from-indigo-500 to-indigo-600',
  'from-orange-500 to-orange-600',
  'from-teal-500 to-teal-600',
  'from-amber-500 to-amber-600',
  'from-cyan-500 to-cyan-600',
  'from-lime-500 to-lime-600',
];

/**
 * Get a random color gradient for wheel segments
 */
export function getRandomColor(): string {
  const randomIndex = Math.floor(Math.random() * colorGradients.length);
  return colorGradients[randomIndex];
}

/**
 * Calculate which segment wins based on the final rotation
 */
export function calculateWinningSegment(finalRotation: number, segments: WheelSegment[]): WheelSegment {
  if (segments.length === 0) {
    throw new Error("No segments available");
  }
  
  const segmentAngle = 360 / segments.length;
  
  // Normalize rotation to 0-360 range
  const normalizedRotation = ((finalRotation % 360) + 360) % 360;
  
  // The pointer is at the top (0 degrees), so we need to calculate which segment is under it
  // Since the wheel rotates clockwise, we need to find which segment is at the top
  const pointerAngle = (360 - normalizedRotation) % 360;
  
  // Find which segment the pointer is pointing to
  const winningSegmentIndex = Math.floor(pointerAngle / segmentAngle);
  
  // Make sure the index is within bounds
  const segmentIndex = winningSegmentIndex % segments.length;
  
  return segments[segmentIndex];
}

/**
 * Generate wheel segment angles for rendering
 */
export function generateSegmentAngles(segmentCount: number): number[] {
  const anglePerSegment = 360 / segmentCount;
  return Array.from({ length: segmentCount }, (_, index) => index * anglePerSegment);
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Generate a random spin rotation value
 */
export function generateSpinRotation(): number {
  // 5+ full rotations (1800°) plus random position (0-360°)
  const minRotations = 5;
  const maxRotations = 8;
  const fullRotations = minRotations + Math.random() * (maxRotations - minRotations);
  const randomPosition = Math.random() * 360;
  
  return fullRotations * 360 + randomPosition;
}
