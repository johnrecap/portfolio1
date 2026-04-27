import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Candidate } from '../../store/useStore';
import { Clock, Star, Mail } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  isOverlay?: boolean;
}

export function CandidateCard({ candidate, isOverlay }: CandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-card p-4 rounded-lg shadow-sm border ${
        isOverlay ? 'border-primary-500 shadow-md rotate-2 scale-105' : 'border-border'
      } cursor-grab active:cursor-grabbing hover:border-primary-300 transition-colors`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-foreground">{candidate.name}</h4>
        {candidate.rating && (
          <div className="flex items-center text-amber-500 text-xs font-semibold gap-0.5">
            <Star className="w-3 h-3 fill-current" />
            {candidate.rating}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-3 font-medium">{candidate.role}</p>
      
      <div className="pt-3 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {new Date(candidate.dateApplied).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
        <div className="flex items-center gap-1 truncate">
          <Mail className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{candidate.email}</span>
        </div>
      </div>
    </div>
  );
}
