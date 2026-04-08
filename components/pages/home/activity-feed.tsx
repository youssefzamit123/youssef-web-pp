'use client';

import type { ActivityFeedItem } from '@/lib/types';
import { CheckCircle, Upload, RefreshCw } from 'lucide-react';

interface ActivityFeedProps {
  items: ActivityFeedItem[];
}

const iconMap = {
  analysis: <CheckCircle className="w-4 h-4" />,
  upload: <Upload className="w-4 h-4" />,
  update: <RefreshCw className="w-4 h-4" />,
};

const colorMap = {
  analysis: 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30',
  upload: 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30',
  update: 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30',
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4">Activité récente</h3>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorMap[item.type]}`}>
              {iconMap[item.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{item.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
