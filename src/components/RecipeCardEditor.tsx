import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Eye } from 'lucide-react';
import BasicInfoSection from '@/components/recipe-card/BasicInfoSection';
import StepsSection from '@/components/recipe-card/StepsSection';
import ExamplePromptsSection from '@/components/recipe-card/ExamplePromptsSection';
import TemplateSection from '@/components/recipe-card/TemplateSection';
import TipsSection from '@/components/recipe-card/TipsSection';

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
      name: 'Transform Bullet Points into Polished Content',
      whatItDoes: 'This task utilizes the text generation capabilities of AI models, such as the Large Language Models (LLMs) that power tools like Perplexity and others like ChatGPT or Claude. It takes a collection of raw, unformatted notes or bullet points provided by the user and converts them into cohesive, grammatically correct, and well-structured paragraphs. The goal is to produce polished content that matches a specified tone, style, or purpose, essentially acting as a writing assistant. This goes beyond simple summarization by adding structure, flow, and professional language.',
      whoItsFor: 'Content creators, Marketing teams, and anyone drafting communications. This could also be beneficial for Publications team members preparing content, Medical Writers structuring reports, Scientific Affairs personnel summarizing findings, or even academic researchers drafting sections of papers or presentations based on their notes. The ability to quickly convert notes into narrative can enhance productivity across many roles that involve writing.',
      difficulty: 'Beginner',
      steps: [
        'Prepare Your Bullet Points/Notes: Gather and organize the raw information you want to transform into polished content. Ensure the points are clear enough for the AI to understand the core ideas.',
        'Define the Desired Output: Determine the specific format, tone, purpose, and target audience for the polished content. Are you writing an email, a report section, a website blurb, or marketing copy? What style is needed (formal, informal, persuasive, informative)?',
        'Craft a Clear Prompt: Write a prompt that explicitly instructs the AI to perform the transformation. Include your prepared bullet points directly in the prompt. Clearly state the desired output characteristics (format, tone, purpose, length). For example, you might specify "Convert these notes into a persuasive paragraph for a marketing email" or "Turn these points into a concise summary for a project update document."',
        'Submit the Query: Enter your prompt and bullet points into the AI interface (e.g., Perplexity\'s main chat window, or a specific mode if available). Perplexity Pro users can choose different underlying models like GPT-4o or Claude 3.5 Sonnet which might have slightly different strengths in text generation.',
        'Review the Generated Content: Read the AI\'s output carefully. Check if it accurately reflects your original notes, if the tone and style are appropriate, and if the structure is logical and flows well.',
        'Refine and Edit: AI-generated text may sometimes require editing for accuracy, clarity, or to match very specific nuances. Use follow-up prompts to request revisions (e.g., "Make it sound more enthusiastic," "Shorten this section," "Expand on the point about [X]"), or manually edit the text yourself. Remember to verify information, especially if the notes contain specific data points.'
      ],
      examplePrompts: [
        {
          title: 'General Purpose',
          prompt: `Please transform the following bullet points into a well-structured paragraph. The tone should be informative and professional.

- Key finding 1: AI adoption increasing across industries.
- Barrier identified: Lack of leadership readiness, not employee readiness.
- Solution suggested: Leaders must invest in employee training and empower managers.
- Outcome: Companies can accelerate towards AI maturity and gain competitive advantage.`
        },
        {
          title: 'Specific Tone/Format',
          prompt: `Convert these notes into a concise, engaging blurb for a social media post announcing a new product feature. Keep it under 150 characters and use emojis.

- New feature: Real-time data sync.
- Benefit: Always see the latest info instantly.
- Benefit: Improves collaboration and decision-making.
- Call to action: Try it out today!`
        }
      ],
      exampleInAction: 'AI adoption is increasing across various industries. However, a key barrier identified is not employees\' readiness, but rather the lack of leadership preparedness. To overcome this, leaders must actively invest in employee training and empower managers to drive adoption. By doing so, companies can accelerate their progress towards AI maturity and position themselves to gain a significant competitive advantage in the future.',
      promptTemplate: `Please transform the following bullet points into a well-structured [FORMAT TYPE - paragraph/summary/email section]. The tone should be [TONE - informative/professional/persuasive/casual].

- [BULLET POINT 1]
- [BULLET POINT 2]
- [BULLET POINT 3]
- [BULLET POINT 4]

Additional requirements: [SPECIFY LENGTH, SPECIAL FORMATTING, TARGET AUDIENCE, etc.]`,
      perplexityChatLink: '',
      tips: [
        'Be specific about the desired tone and format - "professional email tone" works better than just "professional".',
        'Provide clear, well-organized bullet points as input - the better your notes, the better the output.',
        'Use follow-up prompts to refine: "Make it sound more enthusiastic," "Shorten this section," or "Expand on point X".',
        'Different AI models may have different strengths in text generation - experiment with available options.',
        'Always review and verify the generated content, especially if your notes contain specific data points or claims.',
        'For marketing content, specify target audience and desired call-to-action in your prompt.'
      ]
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
  );
};

export default RecipeCardEditor;
