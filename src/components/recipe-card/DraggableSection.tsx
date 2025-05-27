
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
  isSlideMode?: boolean;
  steps?: string[];
}

const DraggableSection: React.FC<DraggableSectionProps> = ({
  id,
  title,
  children,
  bgColor = 'bg-white',
  borderColor = 'border-purple-200',
  isSlideMode = false,
  steps
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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'z-50 opacity-75' : ''}`}
    >
      <div className={`border-2 ${borderColor} rounded-lg ${bgColor} ${isDragging ? 'shadow-lg' : 'shadow-sm'} h-full`}>
        <div className="flex items-center p-2 border-b border-gray-200">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-100"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-sm font-semibold text-gray-700 ml-2">{title}</span>
        </div>
        <div className="p-3">
          <RecipeCardSection
            title={title}
            bgColor="bg-transparent"
            borderColor="border-transparent"
            isSlideMode={isSlideMode}
            steps={steps}
          >
            {children}
          </RecipeCardSection>
        </div>
      </div>
    </div>
  );
};

export default DraggableSection;
