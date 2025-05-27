
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import RecipeCardSection from './RecipeCardSection';

interface DraggableSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  isLayoutEditor?: boolean;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({
  id,
  title,
  children,
  bgColor = 'bg-white',
  borderColor = 'border-purple-200',
  isLayoutEditor = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!isLayoutEditor) {
    return (
      <RecipeCardSection 
        title={title} 
        bgColor={bgColor} 
        borderColor={borderColor} 
        isSlideMode
      >
        {children}
      </RecipeCardSection>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className={`${bgColor} p-3 rounded-lg border-2 ${isDragging ? 'border-blue-400' : 'border-gray-200'} transition-colors`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-sm font-bold text-gray-800 border-b ${borderColor} pb-1 flex-1`}>
            {title}
          </h3>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-4 h-4 text-gray-500" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default DraggableSection;
