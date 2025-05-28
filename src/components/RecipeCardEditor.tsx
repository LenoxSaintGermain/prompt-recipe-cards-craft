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
      name: 'Extract Action Items from Meeting Notes',
      whatItDoes: 'This task leverages the capabilities of AI models, such as Large Language Models (LLMs) that power tools like Perplexity AI and ChatGPT, to process unstructured text data. Specifically, it involves inputting raw text from meeting notes or transcripts. The AI then uses natural language processing to understand the content, identify statements that represent commitments or required tasks, and extract key details associated with those tasks, such as who is responsible and any mentioned deadlines. Finally, it structures this extracted information into a clear, organized list or table.',
      whoItsFor: 'Project Managers, Team Leads, and anyone following up after meetings. This extends to Business Analysts documenting project tasks and responsibilities, Product/Project Managers ensuring tasks are captured and assigned post-meeting, Team Leads maintaining accountability and tracking progress within a team, and anyone needing to synthesize decisions and tasks from discussions.',
      difficulty: 'Beginner',
      steps: [
        'Prepare Your Meeting Notes: Gather the text from your meeting notes or transcript. Ensure it\'s reasonably clear, even if informal.',
        'Identify Desired Output Details: Determine what specific information you want to extract for each action item (e.g., the task itself, the person responsible, a deadline, relevant context).',
        'Craft a Clear Prompt: Write a prompt instructing the AI to perform the task. State the goal ("Extract action items," "Identify tasks and owners"), provide the meeting notes text, specify the details to extract ("Include who is responsible and any deadlines mentioned"), and request a clear output format ("Present as a bulleted list," "Format as a table").',
        'Submit the Query: Enter your prompt and the meeting notes text into the AI interface.',
        'Review the Generated Output: Examine the list or table provided by the AI. Check if all relevant action items were captured, if the responsible parties and deadlines are correct according to the notes, and if the formatting is as requested. Be aware that AI can sometimes misinterpret nuances or "hallucinate" details not present in the text.',
        'Refine and Edit: If necessary, use follow-up prompts to correct omissions or errors ("You missed the task assigned to John about the report," "Could you add a column for the deadline?"). Manual editing of the generated output is often required for perfect accuracy and completeness, especially with informal notes.'
      ],
      examplePrompts: [
        {
          title: 'Basic Extraction',
          prompt: `Extract all action items and who is responsible from the following meeting notes.

Meeting Notes Summary:
We discussed the Q3 marketing campaign. Sarah needs to draft the initial social media posts by EOD Friday. John will review the draft by Monday morning. The team agreed to finalize the budget proposal, Emily offered to take the lead on that and aims to have it ready by the end of next week. We also briefly touched on the website update, but decided to defer action items until the next meeting.`
        },
        {
          title: 'Structured Output Request',
          prompt: `From the meeting notes below, create a table listing each Action Item, the Responsible Person, and the Deadline mentioned.

Meeting Notes:
- Action: Develop content strategy for new blog series. Assignee: Mark. Deadline: November 15th.
- Discussed vendor options for the new software. Need to schedule demos with Vendor A and Vendor C. Lisa will coordinate scheduling with Vendor A this week.
- Review user feedback report from Q2. This is assigned to the product team, no specific person yet. Aim to have preliminary findings by end of month.
- Follow up with Sales on lead qualification criteria. David will handle this by the end of the day tomorrow.`
        }
      ],
      exampleInAction: 'The AI produces a structured list or table format. For example: "• Draft initial social media posts: Sarah (by EOD Friday) • Review social media draft: John (by Monday morning) • Finalize budget proposal: Emily (by end of next week)" or a formatted table with columns for Action Item, Responsible Person, and Deadline.',
      promptTemplate: `Extract [list the types of information you want, e.g., action items, responsible persons, deadlines] from the following text.

[Paste or clearly indicate the meeting notes/transcript text here.]

Present the results as [e.g., a bulleted list, a table].

Optional: "Only include items with a deadline," or "Ignore discussions, only list confirmed tasks."`,
      perplexityChatLink: '',
      tips: [
        'Be specific about the output format in your prompt - "create a table with columns for Action, Owner, Deadline" works better than just "organize the action items."',
        'If your meeting notes are very informal or contain lots of discussion, consider asking the AI to "only extract confirmed commitments" to avoid capturing tentative ideas.',
        'Use follow-up prompts to refine results: "Add a priority level to each item" or "Group related action items together."',
        'Always verify the extracted information against your original notes - AI can sometimes miss context or assign tasks to the wrong person.',
        'For recurring meetings, save successful prompts as templates to maintain consistency in how action items are formatted.',
        'If working with audio transcripts, consider cleaning up obvious transcription errors before processing, as they can confuse the AI\'s understanding.'
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
