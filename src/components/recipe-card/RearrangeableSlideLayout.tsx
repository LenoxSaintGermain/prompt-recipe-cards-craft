
import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CardContent } from '@/components/ui/card';
import { RecipeCard } from '../RecipeCardEditor';
import DraggableSection from './DraggableSection';

interface RearrangeableSlideLayoutProps {
  card: RecipeCard;
}

const RearrangeableSlideLayout: React.FC<RearrangeableSlideLayoutProps> = ({ card }) => {
  const [sections, setSections] = useState([
    { 
      id: 'what-it-does', 
      title: 'What it does', 
      content: <p className="text-gray-700 leading-relaxed text-sm">{card.whatItDoes}</p>,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      id: 'who-its-for', 
      title: "Who it's for", 
      content: <p className="text-gray-700 leading-relaxed text-sm">{card.whoItsFor}</p>,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    { 
      id: 'how-its-done', 
      title: "How it's done", 
      content: null, // This will use enhanced steps
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      steps: card.steps
    },
    { 
      id: 'example-prompts', 
      title: 'Example Prompts', 
      content: (
        <div className="space-y-2">
          {card.examplePrompts.slice(0, 2).map((example, index) => (
            <div key={index} className="bg-white p-2 rounded border border-yellow-200">
              <h5 className="font-semibold text-gray-800 text-xs mb-1">{example.title}</h5>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap bg-gray-50 p-2 rounded max-h-20 overflow-y-auto">
                {example.prompt.length > 200 ? example.prompt.substring(0, 200) + '...' : example.prompt}
              </pre>
            </div>
          ))}
        </div>
      ),
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    { 
      id: 'tips', 
      title: 'Tips for Best Results', 
      content: (
        <ul className="list-disc list-inside space-y-1 text-sm">
          {card.tips.slice(0, 4).map((tip, index) => (
            <li key={index} className="text-gray-700 leading-relaxed text-xs">
              {tip.length > 100 ? tip.substring(0, 100) + '...' : tip}
            </li>
          ))}
        </ul>
      ),
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
    }
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <CardContent className="p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => (
              <DraggableSection
                key={section.id}
                id={section.id}
                title={section.title}
                bgColor={section.bgColor}
                borderColor={section.borderColor}
                isSlideMode={true}
                steps={section.steps} // Pass steps for enhanced formatting
              >
                {section.content}
              </DraggableSection>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </CardContent>
  );
};

export default RearrangeableSlideLayout;
