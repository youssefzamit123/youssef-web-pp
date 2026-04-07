'use client';

import type { CariesDetection } from '@/lib/types';

interface XrayViewerProps {
  detections: CariesDetection[];
}

export function XrayViewer({ detections }: XrayViewerProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-lg p-8 flex items-center justify-center min-h-96 relative overflow-hidden">
        {/* SVG Dental Arch */}
        <svg viewBox="0 0 400 200" className="w-full h-full max-h-80 opacity-30">
          <path
            d="M50,100 Q200,20 350,100"
            stroke="white"
            strokeWidth="3"
            fill="none"
          />
          {/* Teeth */}
          {Array.from({ length: 16 }).map((_, i) => (
            <g key={i}>
              <rect
                x={50 + i * 18.75}
                y={85}
                width="15"
                height="30"
                stroke="white"
                strokeWidth="1"
                fill="none"
              />
            </g>
          ))}
        </svg>

        {/* Pulsing Detection Dots */}
        {detections.map(detection => {
          const angle = (detection.toothNumber / 16) * Math.PI;
          const x = 200 + Math.cos(angle) * 100;
          const y = 100 + Math.sin(angle) * 50;

          return (
            <div
              key={detection.toothNumber}
              className="absolute w-4 h-4 bg-red-500 rounded-full opacity-75 animate-pulse"
              style={{
                left: `${(x / 400) * 100}%`,
                top: `${(y / 200) * 100}%`,
                transform: 'translate(-50%, -50%)',
                animation: 'pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
          );
        })}
      </div>

      {/* Detections List */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Caries détectées</h3>
        <div className="space-y-2">
          {detections.map(detection => (
            <div
              key={detection.toothNumber}
              className="flex items-center justify-between bg-white rounded-lg p-3 border border-border"
            >
              <div>
                <p className="font-medium text-foreground">Dent {detection.toothNumber}</p>
                <p className="text-xs text-muted-foreground">{detection.location}</p>
              </div>
              <p className="font-semibold text-red-600">{detection.confidence}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
