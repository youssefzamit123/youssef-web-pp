'use client';

import { Upload } from 'lucide-react';
import { useRef } from 'react';

export function UploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/50 transition-all"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".dcm,.png,.jpg,.jpeg"
        className="hidden"
      />
      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
      <p className="font-medium text-foreground mb-1">Importer radiographie</p>
      <p className="text-xs text-muted-foreground">DICOM, PNG, JPG</p>
    </div>
  );
}
