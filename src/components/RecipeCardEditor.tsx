import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Eye } from 'lucide-react';
import BasicInfoSection from '@/components/recipe-card/BasicInfoSection';
import StepsSection from '@/components/recipe-card/StepsSection';
import ExamplePromptsSection from '@/components/recipe-card/ExamplePromptsSection';
import TemplateSection from '@/components/recipe-card/TemplateSection';
import TipsSection from '@/components/recipe-card/TipsSection';
import MultiCardImportSection from '@/components/recipe-card/MultiCardImportSection';
import AICopilotPanel from '@/components/recipe-card/AICopilotPanel';
import APIKeyStatus from '@/components/recipe-card/APIKeyStatus';

export interface RecipeCard {
  id: string;
  name: string;
  whatItDoes: string;
  whoItsFor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: string[];
  examplePrompts: { title: string; prompt: string }[];
  exampleInAction: string;
  promptTemplate: string;
  perplexityChatLink: string;
  tips: string[];
}

interface RecipeCardEditorProps {
  card?: RecipeCard;
  onSave: (card: RecipeCard) => void;
  onPreview: (card: RecipeCard) => void;
  onBulkSave?: (cards: RecipeCard[]) => void;
}

const RecipeCardEditor: React.FC<RecipeCardEditorProps> = ({ 
  card, 
  onSave, 
  onPreview, 
  onBulkSave 
}) => {
  const [formData, setFormData] = useState<RecipeCard>(
    card || {
      id: '',
      name: '',
      whatItDoes: '',
      whoItsFor: '',
      difficulty: 'Beginner',
      steps: [''],
      examplePrompts: [{ title: '', prompt: '' }],
      exampleInAction: '',
      promptTemplate: '',
      perplexityChatLink: '',
      tips: ['']
    }
  );

  const updateField = (field: keyof RecipeCard, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSmartImport = (parsedCards: Partial<RecipeCard>[]) => {
    if (parsedCards.length === 1) {
      // Single card import - update current form
      const parsedData = parsedCards[0];
      setFormData(prev => ({
        ...prev,
        name: parsedData.name || prev.name,
        whatItDoes: parsedData.whatItDoes || (parsedData as any).what_it_does || prev.whatItDoes,
        whoItsFor: parsedData.whoItsFor || (parsedData as any).who_its_for || prev.whoItsFor,
        difficulty: parsedData.difficulty || prev.difficulty,
        steps: parsedData.steps || prev.steps,
        examplePrompts: parsedData.examplePrompts || (parsedData as any).example_prompts || prev.examplePrompts,
        exampleInAction: parsedData.exampleInAction || (parsedData as any).example_in_action || prev.exampleInAction,
        promptTemplate: parsedData.promptTemplate || (parsedData as any).prompt_template || prev.promptTemplate,
        tips: parsedData.tips || prev.tips,
        id: prev.id // Keep the existing ID
      }));
    } else if (parsedCards.length > 1 && onBulkSave) {
      // Multi-card import - use bulk save
      const cards: RecipeCard[] = parsedCards.map((data, index) => ({
        id: '', // Let the database handle ID generation
        name: data.name || (data as any).name || `Untitled Card ${index + 1}`,
        whatItDoes: data.whatItDoes || (data as any).what_it_does || '',
        whoItsFor: data.whoItsFor || (data as any).who_its_for || '',
        difficulty: data.difficulty || 'Beginner',
        steps: data.steps || (data as any).steps || [''],
        examplePrompts: data.examplePrompts || (data as any).example_prompts || [{ title: '', prompt: '' }],
        exampleInAction: data.exampleInAction || (data as any).example_in_action || '',
        promptTemplate: data.promptTemplate || (data as any).prompt_template || '',
        perplexityChatLink: '',
        tips: data.tips || (data as any).tips || ['']
      }));
      
      onBulkSave(cards);
    }
  };

  const updateArrayField = (field: 'steps' | 'tips', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    updateField(field, newArray);
  };

  const addArrayField = (field: 'steps' | 'tips') => {
    updateField(field, [...formData[field], '']);
  };

  const removeArrayField = (field: 'steps' | 'tips', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    updateField(field, newArray);
  };

  const updateExamplePrompt = (index: number, field: 'title' | 'prompt', value: string) => {
    const newPrompts = [...formData.examplePrompts];
    newPrompts[index] = { ...newPrompts[index], [field]: value };
    updateField('examplePrompts', newPrompts);
  };

  const addExamplePrompt = () => {
    updateField('examplePrompts', [...formData.examplePrompts, { title: '', prompt: '' }]);
  };

  const removeExamplePrompt = (index: number) => {
    const newPrompts = formData.examplePrompts.filter((_, i) => i !== index);
    updateField('examplePrompts', newPrompts);
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handlePreview = () => {
    onPreview(formData);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Editor */}
      <div className="flex-1 max-w-4xl mx-auto p-6 space-y-6">
        {!card && (
          <>
            <APIKeyStatus />
            <MultiCardImportSection onImport={handleSmartImport} />
          </>
        )}
        
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {card ? 'Edit Recipe Card' : 'Create New Recipe Card'}
              <div className="flex gap-2 ml-auto">
                <Button onClick={handlePreview} variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={handleSave} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <BasicInfoSection formData={formData} updateField={updateField} />
            
            <StepsSection
              steps={formData.steps}
              updateArrayField={updateArrayField}
              addArrayField={addArrayField}
              removeArrayField={removeArrayField}
            />

            <ExamplePromptsSection
              examplePrompts={formData.examplePrompts}
              updateExamplePrompt={updateExamplePrompt}
              addExamplePrompt={addExamplePrompt}
              removeExamplePrompt={removeExamplePrompt}
            />

            <TemplateSection formData={formData} updateField={updateField} />

            <TipsSection
              tips={formData.tips}
              updateArrayField={updateArrayField}
              addArrayField={addArrayField}
              removeArrayField={removeArrayField}
            />
          </CardContent>
        </Card>
      </div>

      {/* AI Co-pilot Panel */}
      <AICopilotPanel
        formData={formData}
        onSuggestionApply={updateField}
      />
    </div>
  );
};

export default RecipeCardEditor;
