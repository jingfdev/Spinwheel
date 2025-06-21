import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import SpinWheel from "@/components/SpinWheel";
import ControlPanel from "@/components/ControlPanel";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { WheelSegment, WheelSession } from "@shared/schema";

export default function SpinWheelPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch segments
  const { data: segments = [], isLoading: segmentsLoading } = useQuery<WheelSegment[]>({
    queryKey: ["/api/segments"],
  });

  // Fetch session
  const { data: session } = useQuery<WheelSession>({
    queryKey: ["/api/session"],
  });

  // Increment spin count mutation
  const spinMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/session/spin");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/session"] });
    },
  });

  const handleSpinComplete = (result: string) => {
    setCurrentResult(result);
    setIsSpinning(false);
    spinMutation.mutate();
  };

  const handleSpinStart = () => {
    setIsSpinning(true);
    setCurrentResult(null);
  };

  const handleResetResult = () => {
    setCurrentResult(null);
  };

  if (segmentsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading wheel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900">
      {/* Header */}
      <header className="text-center py-8">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          <i className="fas fa-dharmachakra mr-3"></i>Spin Wheel
        </h1>
        <p className="text-gray-300 text-lg">Customize your wheel and spin to win!</p>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* Wheel Section */}
          <div className="xl:col-span-2 flex flex-col items-center">
            
            {/* Result Display */}
            {currentResult && (
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-300 mb-3">🎉 Winner!</h2>
                <Card className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 border-0 shadow-2xl animate-bounce-in">
                  <span className="text-3xl font-bold text-white">{currentResult}</span>
                </Card>
              </div>
            )}

            <SpinWheel
              segments={segments}
              isSpinning={isSpinning}
              onSpinStart={handleSpinStart}
              onSpinComplete={handleSpinComplete}
              onResetResult={handleResetResult}
            />
          </div>

          {/* Control Panel */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-700">
            <ControlPanel 
              segments={segments}
              session={session}
              onSegmentUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/segments"] });
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400">
        <Separator className="mb-4 bg-gray-700" />
        <p className="text-sm">
          <i className="fas fa-heart text-red-500 mr-1"></i>
          Made with love for spinning wheels everywhere
        </p>
      </footer>
    </div>
  );
}
