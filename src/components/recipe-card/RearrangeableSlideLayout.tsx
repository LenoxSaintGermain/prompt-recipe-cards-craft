
import React, { useState, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { RecipeCard } from '../RecipeCardEditor';
import DraggableSection from './DraggableSection';
import LayoutEditor from './LayoutEditor';

interface RearrangeableSlideLayoutProps {
  card: RecipeCard;
}

interface SectionData {
  id: string;
  title: string;
  content: React.ReactNode;
  bgColor: string;
  borderColor: string;
  column: 'left' | 'right';
}

const RearrangeableSlideLayout: React.FC<RearrangeableSlideLayoutProps> = ({ card }) => {
  const [isLayoutEditor, setIsLayoutEditor] = useState(false);
  
  // Define default section order
  const defaultSections: SectionData[] = useMemo(() => [
    {
      id: 'what-it-does',
      title: 'What it does:',
      content: <p className="text-sm text-gray-700 leading-relaxed">{card.whatItDoes}</p>,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      column: 'left' as const
    },
    {
      id: 'who-its-for',
      title: 'Who it\'s for:',
      content: <p className="text-sm text-gray-700 leading-relaxed">{card.whoItsFor}</p>,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      column: 'left' as const
    },
    ...(card.tips.some(tip => tip.trim()) ? [{
      id: 'tips',
      title: 'Tips for Best Results:',
      content: (
        <ul className="space-y-1">
          {card.tips.filter(tip => tip.trim()).map((tip, index) => (
            <li key={index} className="flex gap-2 text-sm">
              <span className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-1"></span>
              <p className="text-gray-700 leading-relaxed">{tip}</p>
            </li>
          ))}
        </ul>
      ),
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      column: 'left' as const
    }] : []),
    {
      id: 'steps',
      title: 'How it\'s done (Steps):',
      content: (
        <ol className="space-y-2">
          {card.steps.filter(step => step.trim()).map((step, index) => (
            <li key={index} className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed flex-1">{step}</p>
            </li>
          ))}
        </ol>
      ),
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      column: 'right' as const
    },
    ...(card.examplePrompts.some(p => p.title || p.prompt) ? [{
      id: 'example-prompts',
      title: 'Example Prompt(s):',
      content: (
        <div className="space-y-3">
          {card.examplePrompts.filter(p => p.title || p.prompt).map((example, index) => (
            <div key={index} className="bg-white rounded p-3 border border-gray-200">
              {example.title && (
                <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                  Example {index + 1}: {example.title}
                </h4>
              )}
              {example.prompt && (
                <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-gray-50 p-2 rounded border font-mono">
                  {example.prompt}
                </pre>
              )}
            </div>
          ))}
        </div>
      ),
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      column: 'right' as const
    }] : []),
    ...(card.exampleInAction ? [{
      id: 'example-in-action',
      title: 'Example in Action:',
      content: <p className="text-sm text-gray-700 leading-relaxed">{card.exampleInAction}</p>,
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      column: 'right' as const
    }] : []),
    ...(card.promptTemplate ? [{
      id: 'prompt-template',
      title: 'Prompt Template:',
      content: (
        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono bg-white p-2 rounded border">
          {card.promptTemplate}
        </pre>
      ),
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      column: 'right' as const
    }] : [])
  ], [card]);

  const [leftSections, setLeftSections] = useState(() => 
    defaultSections.filter(s => s.column === 'left').map(s => s.id)
  );
  const [rightSections, setRightSections] = useState(() => 
    defaultSections.filter(s => s.column === 'right').map(s => s.id)
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Determine which column the dragged item came from and where it's going
    const activeInLeft = leftSections.includes(activeId);
    const activeInRight = rightSections.includes(activeId);
    const overInLeft = leftSections.includes(overId);
    const overInRight = rightSections.includes(overId);

    // Handle moving within the same column
    if ((activeInLeft && overInLeft) || (activeInRight && overInRight)) {
      const sections = activeInLeft ? leftSections : rightSections;
      const setSections = activeInLeft ? setLeftSections : setRightSections;
      
      const oldIndex = sections.indexOf(activeId);
      const newIndex = sections.indexOf(overId);
      
      setSections(arrayMove(sections, oldIndex, newIndex));
    }
    // Handle moving between columns
    else if (activeInLeft && overInRight) {
      setLeftSections(prev => prev.filter(id => id !== activeId));
      const newIndex = rightSections.indexOf(overId);
      setRightSections(prev => [
        ...prev.slice(0, newIndex),
        activeId,
        ...prev.slice(newIndex)
      ]);
    }
    else if (activeInRight && overInLeft) {
      setRightSections(prev => prev.filter(id => id !== activeId));
      const newIndex = leftSections.indexOf(overId);
      setLeftSections(prev => [
        ...prev.slice(0, newIndex),
        activeId,
        ...prev.slice(newIndex)
      ]);
    }
  };

  const handleResetLayout = () => {
    setLeftSections(defaultSections.filter(s => s.column === 'left').map(s => s.id));
    setRightSections(defaultSections.filter(s => s.column === 'right').map(s => s.id));
  };

  const getSectionById = (id: string) => defaultSections.find(s => s.id === id);

  const renderColumn = (sectionIds: string[], columnName: string) => (
    <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
      <div className="space-y-4">
        {isLayoutEditor && (
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide p-2 bg-gray-100 rounded border-2 border-dashed border-gray-300">
            {columnName} Column
          </div>
        )}
        {sectionIds.map(sectionId => {
          const section = getSectionById(sectionId);
          if (!section) return null;
          
          return (
            <DraggableSection
              key={section.id}
              id={section.id}
              title={section.title}
              bgColor={section.bgColor}
              borderColor={section.borderColor}
              isLayoutEditor={isLayoutEditor}
            >
              {section.content}
            </DraggableSection>
          );
        })}
      </div>
    </SortableContext>
  );

  return (
    <CardContent className="p-4">
      <LayoutEditor
        isLayoutEditor={isLayoutEditor}
        onToggleLayoutEditor={() => setIsLayoutEditor(!isLayoutEditor)}
        onResetLayout={handleResetLayout}
      />
      
      <div className="mt-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-2 gap-6">
            {renderColumn(leftSections, 'Left')}
            {renderColumn(rightSections, 'Right')}
          </div>
        </DndContext>
      </div>
    </CardContent>
  );
};

export default RearrangeableSlideLayout;
