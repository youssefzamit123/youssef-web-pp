'use client';

import type { RiskPrediction } from '@/lib/types';
import { Download, RefreshCw } from 'lucide-react';

interface RiskPredictionCardProps {
  predictions: RiskPrediction[];
}

const colorMap = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

const barColorMap = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-green-500',
};

export function RiskPredictionCard({ predictions }: RiskPredictionCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
      <h3 className="font-semibold text-foreground mb-6">Prédictions de risque</h3>

      <div className="space-y-4 mb-6">
        {predictions.map((pred, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">{pred.metric}</p>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colorMap[pred.color]}`}>
                {pred.percentage}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${barColorMap[pred.color]}`}
                style={{ width: `${pred.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm">
          <Download className="w-4 h-4" />
          Exporter rapport
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 border border-border text-foreground font-medium py-2.5 rounded-lg hover:bg-secondary transition-colors text-sm">
          <RefreshCw className="w-4 h-4" />
          Nouvelle analyse
        </button>
      </div>
    </div>
  );
}
