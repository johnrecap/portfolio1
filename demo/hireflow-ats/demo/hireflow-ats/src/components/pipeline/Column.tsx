import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface ColumnProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function Column({ id, title, children }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col w-80 shrink-0 h-full max-h-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">{title}</h3>
      </div>
      <div 
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto p-3 rounded-xl bg-muted/50 border-2 border-transparent transition-colors ${
          isOver ? 'bg-primary-50/50 border-primary-200' : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
}
