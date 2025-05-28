
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus } from 'lucide-react';
import { RecipeCard } from '@/components/RecipeCardEditor';

interface ExamplePromptsSectionProps {
  examplePrompts: RecipeCard['examplePrompts'];
  updateExamplePrompt: (index: number, field: 'title' | 'prompt', value: string) => void;
  addExamplePrompt: () => void;
  removeExamplePrompt: (index: number) => void;
}

const ExamplePromptsSection: React.FC<ExamplePromptsSectionProps> = ({
  examplePrompts,
  updateExamplePrompt,
  addExamplePrompt,
  removeExamplePrompt
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label>Example Prompts</Label>
        <Button onClick={addExamplePrompt} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Example
        </Button>
      </div>
      {examplePrompts.map((example, index) => (
        <Card key={index} className="mb-4 border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Example {index + 1}</span>
              {examplePrompts.length > 1 && (
                <Button
                  onClick={() => removeExamplePrompt(index)}
                  variant="ghost"
                  size="sm"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              )}
            </div>
            <Input
              value={example.title}
              onChange={(e) => updateExamplePrompt(index, 'title', e.target.value)}
              placeholder="Brief description of prompt's goal..."
              className="mb-2"
            />
            <Textarea
              value={example.prompt}
              onChange={(e) => updateExamplePrompt(index, 'prompt', e.target.value)}
              placeholder="Paste example prompt here..."
              rows={4}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExamplePromptsSection;
