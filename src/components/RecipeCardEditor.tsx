import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Minus, Save, Eye } from 'lucide-react';

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
}

const RecipeCardEditor: React.FC<RecipeCardEditorProps> = ({ card, onSave, onPreview }) => {
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
    const cardToSave = {
      ...formData,
      id: formData.id || Date.now().toString()
    };
    onSave(cardToSave);
  };

  const handlePreview = () => {
    onPreview(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Recipe Card Editor
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Recipe Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., Generate a Client Intelligence Brief"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={formData.difficulty} onValueChange={(value) => updateField('difficulty', value as any)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="whatItDoes">What it does</Label>
            <Textarea
              id="whatItDoes"
              value={formData.whatItDoes}
              onChange={(e) => updateField('whatItDoes', e.target.value)}
              placeholder="Briefly explain the outcome of using this recipe..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="whoItsFor">Who it's for</Label>
            <Textarea
              id="whoItsFor"
              value={formData.whoItsFor}
              onChange={(e) => updateField('whoItsFor', e.target.value)}
              placeholder="Identify the primary target roles who would benefit..."
              className="mt-1"
              rows={2}
            />
          </div>

          {/* Steps */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>How it's done (Steps)</Label>
              <Button onClick={() => addArrayField('steps')} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Step
              </Button>
            </div>
            {formData.steps.map((step, index) => (
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
                {formData.steps.length > 1 && (
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

          {/* Example Prompts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Example Prompts</Label>
              <Button onClick={addExamplePrompt} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Example
              </Button>
            </div>
            {formData.examplePrompts.map((example, index) => (
              <Card key={index} className="mb-4 border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Example {index + 1}</span>
                    {formData.examplePrompts.length > 1 && (
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

          <div>
            <Label htmlFor="exampleInAction">Example in Action</Label>
            <Textarea
              id="exampleInAction"
              value={formData.exampleInAction}
              onChange={(e) => updateField('exampleInAction', e.target.value)}
              placeholder="Brief description of what the screenshot/link shows..."
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="promptTemplate">Prompt Template</Label>
            <Textarea
              id="promptTemplate"
              value={formData.promptTemplate}
              onChange={(e) => updateField('promptTemplate', e.target.value)}
              placeholder="Provide a copy-paste ready template with clear placeholders..."
              className="mt-1"
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="perplexityChatLink">Perplexity Chat Link</Label>
            <Input
              id="perplexityChatLink"
              value={formData.perplexityChatLink}
              onChange={(e) => updateField('perplexityChatLink', e.target.value)}
              placeholder="https://www.perplexity.ai/search/... (Link to Perplexity chat example)"
              className="mt-1"
            />
          </div>

          {/* Tips */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Tips for Best Results</Label>
              <Button onClick={() => addArrayField('tips')} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Tip
              </Button>
            </div>
            {formData.tips.map((tip, index) => (
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
                {formData.tips.length > 1 && (
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
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeCardEditor;
