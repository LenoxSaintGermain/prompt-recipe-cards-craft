
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';
import { RecipeCard } from '@/components/RecipeCardEditor';

interface StepsSectionProps {
  steps: string[];
  updateArrayField: (field: 'steps' | 'tips', index: number, value: string) => void;
  addArrayField: (field: 'steps' | 'tips') => void;
  removeArrayField: (field: 'steps' | 'tips', index: number) => void;
}

const StepsSection: React.FC<StepsSectionProps> = ({
  steps,
  updateArrayField,
  addArrayField,
  removeArrayField
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label>How it's done (Steps)</Label>
        <Button onClick={() => addArrayField('steps')} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Step
        </Button>
      </div>
      {steps.map((step, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <span className="text-sm font-medium text-gray-500 mt-2 min-w-[60px]">
            Step {index + 1}:
          </span>
          <Textarea
            value={step}
            onChange={(e) => updateArrayField('steps', index, e.target.value)}
            placeholder="Clear, concise action for this step..."
            className="flex-1"
            rows={2}
          />
          {steps.length > 1 && (
            <Button
              onClick={() => removeArrayField('steps', index)}
              variant="ghost"
              size="sm"
              className="mt-1"
            >
              <Minus className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepsSection;
