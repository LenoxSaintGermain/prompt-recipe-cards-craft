
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';

interface TipsSectionProps {
  tips: string[];
  updateArrayField: (field: 'steps' | 'tips', index: number, value: string) => void;
  addArrayField: (field: 'steps' | 'tips') => void;
  removeArrayField: (field: 'steps' | 'tips', index: number) => void;
}

const TipsSection: React.FC<TipsSectionProps> = ({
  tips,
  updateArrayField,
  addArrayField,
  removeArrayField
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label>Tips for Best Results</Label>
        <Button onClick={() => addArrayField('tips')} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Tip
        </Button>
      </div>
      {tips.map((tip, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <span className="text-sm font-medium text-gray-500 mt-2 min-w-[50px]">
            Tip {index + 1}:
          </span>
          <Textarea
            value={tip}
            onChange={(e) => updateArrayField('tips', index, e.target.value)}
            placeholder="Helpful tip for better results..."
            className="flex-1"
            rows={2}
          />
          {tips.length > 1 && (
            <Button
              onClick={() => removeArrayField('tips', index)}
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

export default TipsSection;
