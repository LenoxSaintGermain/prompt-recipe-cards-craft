import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Eye, Sparkles } from 'lucide-react';
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
  const [showCopilot, setShowCopilot] = useState(false);

  const updateField = (field: keyof RecipeCard, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSmartImport = (parsedCards: Partial<RecipeCard>[]) => {
    if (parsedCards.length === 1) {
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
        id: prev.id
      }));
    } else if (parsedCards.length > 1 && onBulkSave) {
      const cards: RecipeCard[] = parsedCards.map((data, index) => ({
        id: '',
        name: data.name || (data as any).name || `Untitled Pattern ${index + 1}`,
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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6 animate-fade-up">
        {!card && (
          <>
            <APIKeyStatus />
            <MultiCardImportSection onImport={handleSmartImport} />
          </>
        )}
        
        <Card className="border border-border rounded-2xl shadow-subtle overflow-hidden">
          <CardHeader className="bg-secondary/30 border-b border-border px-8 py-6">
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl font-semibold text-foreground">
                {card ? 'Edit Pattern' : 'Create New Pattern'}
              </span>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowCopilot(!showCopilot)} 
                  variant="outline" 
                  size="sm"
                  className="rounded-xl press-effect"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Copilot
                </Button>
                <Button 
                  onClick={handlePreview} 
                  variant="outline" 
                  size="sm"
                  className="rounded-xl press-effect"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  onClick={handleSave} 
                  size="sm"
                  className="rounded-xl bg-foreground text-background hover:bg-foreground/90 press-effect"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <BasicInfoSection formData={formData} updateField={updateField} />
            
            <div className="h-px bg-border" />
            
            <StepsSection
              steps={formData.steps}
              updateArrayField={updateArrayField}
              addArrayField={addArrayField}
              removeArrayField={removeArrayField}
            />

            <div className="h-px bg-border" />

            <ExamplePromptsSection
              examplePrompts={formData.examplePrompts}
              updateExamplePrompt={updateExamplePrompt}
              addExamplePrompt={addExamplePrompt}
              removeExamplePrompt={removeExamplePrompt}
            />

            <div className="h-px bg-border" />

            <TemplateSection formData={formData} updateField={updateField} />

            <div className="h-px bg-border" />

            <TipsSection
              tips={formData.tips}
              updateArrayField={updateArrayField}
              addArrayField={addArrayField}
              removeArrayField={removeArrayField}
            />
          </CardContent>
        </Card>
      </div>

      {/* Floating AI Copilot Panel */}
      {showCopilot && (
        <div className="fixed right-6 bottom-6 z-50 animate-slide-in-bottom">
          <AICopilotPanel
            formData={formData}
            onSuggestionApply={updateField}
          />
        </div>
      )}
    </div>
  );
};

export default RecipeCardEditor;
