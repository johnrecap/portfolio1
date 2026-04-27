import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import { useStore } from '../store/useStore';
import { Column } from '../components/pipeline/Column';
import { CandidateCard } from '../components/pipeline/CandidateCard';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const COLUMNS = [
  { id: 'applied', title: 'Applied' },
  { id: 'screening', title: 'Screening' },
  { id: 'interview', title: 'Interview' },
  { id: 'offer', title: 'Offer' },
  { id: 'hired', title: 'Hired' },
  { id: 'rejected', title: 'Rejected' }
] as const;

export const Pipeline = () => {
  const { candidates, updateCandidateStatus } = useStore();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roleFilter = searchParams.get('role');
  const [activeId, setActiveId] = useState<string | null>(null);

  const filteredCandidates = roleFilter 
    ? candidates.filter(c => c.role.toLowerCase() === roleFilter.toLowerCase())
    : candidates;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const activeCandidate = candidates.find(c => c.id === activeId);
    if (!activeCandidate) {
      setActiveId(null);
      return;
    }

    // Determine the status we are dropping into.
    // The drop target could be a column, or another card.
    let targetStatus = activeCandidate.status;

    // Is the drop target a column?
    if (COLUMNS.some(col => col.id === overId)) {
        targetStatus = overId as any;
    } else {
        // Drop target is another candidate card
        const overCandidate = candidates.find(c => c.id === overId);
        if (overCandidate) {
            targetStatus = overCandidate.status;
        }
    }

    if (activeCandidate.status !== targetStatus) {
      updateCandidateStatus(activeId, targetStatus);
    }
    
    setActiveId(null);
  };

  const activeCandidate = filteredCandidates.find(c => c.id === activeId);

  return (
    <div className="p-6 lg:p-8 h-full flex flex-col">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('pipeline.title', 'Candidate Pipeline')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {roleFilter 
              ? `${t('pipeline.showingFor', 'Showing candidates for:')} ${roleFilter}`
              : t('pipeline.description', 'Drag and drop candidates across stages.')
            }
          </p>
        </div>
        {roleFilter && (
          <button 
            onClick={() => navigate('/pipeline')}
            className="flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors text-sm font-medium"
          >
            <X className="w-4 h-4" />
            {t('pipeline.clearFilter', 'Clear Filter')}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full items-start">
            {COLUMNS.map((col) => {
              const columnCandidates = filteredCandidates.filter(c => c.status === col.id);
              
              return (
                <Column key={col.id} id={col.id} title={t(`pipeline.stages.${col.id}`, col.title)}>
                  <SortableContext 
                    items={columnCandidates.map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3 min-h-[100px]">
                      {columnCandidates.map(candidate => (
                        <CandidateCard key={candidate.id} candidate={candidate} />
                      ))}
                    </div>
                  </SortableContext>
                </Column>
              );
            })}
          </div>

          <DragOverlay>
            {activeCandidate ? <CandidateCard candidate={activeCandidate} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};
