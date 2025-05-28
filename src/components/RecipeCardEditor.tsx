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
      name: 'Create a Comparison Table from Unstructured Data',
      whatItDoes: 'This task leverages AI\'s natural language processing and information synthesis capabilities, available through platforms like Perplexity AI and other tools powered by Large Language Models (LLMs). It takes multiple pieces of unstructured text – such as product descriptions, summaries of studies, evaluations of approaches, or notes on different options – and analyzes them to identify key features, characteristics, or points of comparison mentioned within the text. The AI then organizes this extracted information into a structured comparison table, highlighting both similarities and differences between the items described. This transforms raw, potentially lengthy text into a clear, easy-to-read format for evaluation.',
      whoItsFor: 'Scientific Services, Marketing, and Decision-makers evaluating options. This also directly applies to Researchers and Academics comparing findings from multiple studies, Product/Project Managers evaluating different tools or strategic approaches, Business Analysts comparing market trends or competitive offerings, and Content Creators/Writers synthesizing information from multiple sources for articles or reports.',
      difficulty: 'Intermediate',
      steps: [
        'Gather Your Unstructured Data: Collect the text descriptions for the items you want to compare. This could be paragraphs, notes, or excerpts from documents.',
        'Identify Key Comparison Criteria (Optional but Recommended): Determine the specific aspects you want the AI to focus on for the comparison (e.g., features, benefits, limitations, cost, performance metrics). Listing these explicitly in the prompt often leads to better results.',
        'Craft a Clear Prompt: Write a prompt instructing the AI to create a comparison table. State the task, introduce the items to be compared, provide the unstructured text for each item with clear separators, include key comparison criteria, and specify the desired table format.',
        'Submit the Query: Enter your prompt and text data into the AI interface. Using models like GPT-4o or Claude 3.5 Sonnet (available via Perplexity Pro) might handle the complexity better. Consider using "Pro Search" or "Co-Pilot" features if available.',
        'Review the Generated Table: Examine the output table. Check that all items are included, the criteria are relevant and correctly extracted from the text, and the information presented is accurate according to your source texts. Be mindful of potential AI hallucinations or misinterpretations.',
        'Refine and Edit: If the table isn\'t quite right, use follow-up prompts to request changes (e.g., "Add a column for [Criterion X]," "Correct the information for [Item Y]," "Reformat the table"). Manual editing may also be necessary to ensure perfect accuracy and clarity.'
      ],
      examplePrompts: [
        {
          title: 'Implicit Criteria Comparison',
          prompt: `Please create a comparison table based on the following descriptions of two different AI search tools. Identify the key features and benefits mentioned for each.

Tool A: Perplexity AI
This AI-powered search engine provides direct, contextual answers using LLMs and real-time information retrieval. It offers source citations for its responses, enhancing credibility. Perplexity AI has a conversational interface and suggests follow-up questions to refine searches. It's available in Standard, Pro, and Enterprise tiers, with Pro offering access to models like GPT-4o and Claude 3.5 Sonnet, unlimited searches, and file uploads. It's known for accuracy in research tasks.

Tool B: ChatGPT
This is a powerful conversational AI model known for generating human-like text. It's versatile for content creation, coding, and summarizing. ChatGPT supports multimodal inputs (text, image, audio) and integrates with DALL-E for image generation. It offers custom GPTs for specialized uses. Available in free and paid tiers, though free tiers may have usage limits and less current information compared to paid tiers like Plus or Pro. Sometimes prone to providing inaccurate or "hallucinated" information.`
        },
        {
          title: 'Explicit Criteria Comparison',
          prompt: `Compare the two AI research methodologies described below using a table. Focus the comparison specifically on the following criteria:

1. Primary Goal
2. Key Steps Involved
3. Main Output/Result
4. Advantages
5. Potential Limitations

Method 1: Literature Review Builder (Perplexity AI)
This method uses an AI prompt to find major studies on a topic, summarize key findings, and provide publication details. It speeds up background reading and helps researchers stay organized. The process involves asking the AI to identify cited articles, request summaries, and get publication info. The output is concise summaries and source details. Advantages include speed and organization.

Method 2: Research Gap Identifier (Perplexity AI)
This involves requesting the AI to analyze recent publications on a topic to highlight overlooked angles or missing data. It helps researchers identify current trends deserving deeper analysis to shape fresh lines of inquiry. The process involves prompting the AI to analyze publications and identify gaps. The output highlights areas for further study. It helps generate fresh research questions.`
        }
      ],
      exampleInAction: 'A structured comparison table that transforms scattered text descriptions into organized rows and columns. For example, comparing AI tools would result in a table with columns for features like "Primary Function," "Information Type," "Source Handling," "Interface," "Model Access," and "Accuracy Notes," with each tool\'s characteristics clearly laid out in separate rows for easy comparison and decision-making.',
      promptTemplate: `Create a comparison table from the following information.

Items to Compare:
[ITEM 1 NAME]: [DESCRIPTION/TEXT FOR ITEM 1]

[ITEM 2 NAME]: [DESCRIPTION/TEXT FOR ITEM 2]

[ITEM 3 NAME]: [DESCRIPTION/TEXT FOR ITEM 3]

Compare these based on the following criteria: [LIST YOUR DESIRED CRITERIA]
OR
Analyze the text and identify the key similarities and differences.

Present the output in a table format.`,
      perplexityChatLink: '',
      tips: [
        'Be specific about comparison criteria in your prompt - explicit criteria usually produce better, more focused tables than letting the AI choose.',
        'Use clear separators (headings, numbers, bullets) between different items in your prompt to help the AI distinguish between them.',
        'For complex comparisons, consider using follow-up prompts to add specific columns or refine criteria rather than trying to get everything perfect in one prompt.',
        'Always verify the accuracy of extracted information against your original source texts - AI can misinterpret nuanced or contradictory information.',
        'If working with technical or specialized content, consider specifying the audience level (e.g., "for technical experts" vs "for general audience") in your prompt.',
        'Use models like GPT-4o or Claude 3.5 Sonnet when available for better handling of complex synthesis tasks.'
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
