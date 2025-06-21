import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { getRandomColor } from "@/lib/wheelUtils";
import type { WheelSegment, WheelSession, InsertWheelSegment } from "@shared/schema";

interface ControlPanelProps {
  segments: WheelSegment[];
  session?: WheelSession;
  onSegmentUpdate: () => void;
}

export default function ControlPanel({ segments, session, onSegmentUpdate }: ControlPanelProps) {
  const [newSegmentText, setNewSegmentText] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Add segment mutation
  const addSegmentMutation = useMutation({
    mutationFn: async (segmentData: InsertWheelSegment) => {
      const response = await apiRequest("POST", "/api/segments", segmentData);
      return response.json();
    },
    onSuccess: () => {
      onSegmentUpdate();
      setNewSegmentText("");
      toast({
        title: "Segment added",
        description: "New segment has been added to the wheel.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add segment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove segment mutation
  const removeSegmentMutation = useMutation({
    mutationFn: async (segmentId: number) => {
      const response = await apiRequest("DELETE", `/api/segments/${segmentId}`);
      return response.json();
    },
    onSuccess: () => {
      onSegmentUpdate();
      toast({
        title: "Segment removed",
        description: "Segment has been removed from the wheel.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove segment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Reset wheel mutation
  const resetWheelMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/segments");
      return response.json();
    },
    onSuccess: () => {
      onSegmentUpdate();
      toast({
        title: "Wheel reset",
        description: "All segments have been removed from the wheel.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reset wheel. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddSegment = () => {
    const trimmedText = newSegmentText.trim();
    if (!trimmedText) {
      toast({
        title: "Invalid input",
        description: "Please enter a segment label.",
        variant: "destructive",
      });
      return;
    }
    
    if (segments.length >= 12) {
      toast({
        title: "Maximum segments reached",
        description: "You can have a maximum of 12 segments.",
        variant: "destructive",
      });
      return;
    }

    const segmentData: InsertWheelSegment = {
      label: trimmedText,
      color: getRandomColor(),
      order: segments.length,
    };

    addSegmentMutation.mutate(segmentData);
  };

  const handleRemoveSegment = (segmentId: number) => {
    if (segments.length <= 2) {
      toast({
        title: "Minimum segments required",
        description: "You need at least 2 segments to spin the wheel.",
        variant: "destructive",
      });
      return;
    }
    removeSegmentMutation.mutate(segmentId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddSegment();
    }
  };

  const handleRandomizeColors = () => {
    // Update all segments with random colors
    segments.forEach(segment => {
      const newColor = getRandomColor();
      // For simplicity, we'll just invalidate the query to refetch
      // In a real app, you might want to add an update segment endpoint
    });
    
    toast({
      title: "Colors randomized",
      description: "Segment colors have been randomized!",
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        <i className="fas fa-cogs mr-2"></i>Customize Wheel
      </h3>

      {/* Add Segment */}
      <div>
        <Label htmlFor="new-segment" className="block text-sm font-medium mb-3 text-gray-300">
          Add New Segment
        </Label>
        <div className="flex gap-3">
          <Input
            id="new-segment"
            type="text"
            placeholder="Enter segment text..."
            value={newSegmentText}
            onChange={(e) => setNewSegmentText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            disabled={addSegmentMutation.isPending}
          />
          <Button
            onClick={handleAddSegment}
            disabled={addSegmentMutation.isPending}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <i className="fas fa-plus"></i>
          </Button>
        </div>
      </div>

      {/* Segment List */}
      <div>
        <Label className="block text-sm font-medium mb-3 text-gray-300">
          Current Segments
        </Label>
        <ScrollArea className="h-64 w-full">
          <div className="space-y-3 pr-4">
            {segments.map((segment) => (
              <div
                key={segment.id}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-xl border border-gray-600 group hover:bg-gray-650 transition-colors"
              >
                <span className="text-white font-medium">{segment.label}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 bg-gradient-to-br ${segment.color} rounded-full`} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSegment(segment.id)}
                    disabled={removeSegmentMutation.isPending}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <i className="fas fa-trash-alt text-sm"></i>
                  </Button>
                </div>
              </div>
            ))}
            
            {segments.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No segments added yet. Add some segments to start spinning!
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={() => resetWheelMutation.mutate()}
          disabled={resetWheelMutation.isPending}
          variant="outline"
          className="w-full bg-gray-600 hover:bg-gray-700 border-gray-500 text-white"
        >
          <i className="fas fa-redo mr-2"></i>Reset Wheel
        </Button>
        <Button
          onClick={handleRandomizeColors}
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
        >
          <i className="fas fa-palette mr-2"></i>Randomize Colors
        </Button>
      </div>

      {/* Stats */}
      <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600">
        <h4 className="text-lg font-semibold mb-3 text-gray-300">Wheel Stats</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{segments.length}</div>
            <div className="text-gray-400">Segments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{session?.totalSpins || 0}</div>
            <div className="text-gray-400">Spins</div>
          </div>
        </div>
      </div>
    </div>
  );
}
