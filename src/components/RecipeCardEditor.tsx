
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
      name: 'Find Relevant Information Across Multiple Documents',
      whatItDoes: 'This process utilizes Perplexity Enterprise\'s capabilities, including file uploads and potential integrations with internal repositories (like those offered by Perplexity Enterprise Pro), to search through multiple documents. It aims to identify and extract specific information or relevant sections on a given topic, presenting the findings with citations that link back to the original source documents. This is especially useful for synthesizing information scattered across various internal reports, research papers, or policy documents.',
      whoItsFor: 'This is beneficial for anyone needing to gather specific details from a collection of internal or external documents. It\'s particularly valuable for Medical Writers, individuals in Scientific Affairs, Publications team members, or new employees who need to quickly get up to speed on a topic by pulling information from existing company documentation.',
      difficulty: 'Intermediate',
      steps: [
        'Identify the Specific Information Needed: Clearly define the precise topic or specific data points you are looking for across the documents. The more specific your objective, the better you can formulate your prompt.',
        'Gather and Prepare Documents: Collect the documents you need to search. If using standard Perplexity, you will likely need to upload them (Perplexity Pro offers unlimited uploads; Standard has limits). If your organization uses Perplexity Enterprise Pro, ensure the relevant internal repositories (like Google Drive, OneDrive, SharePoint) are connected.',
        'Craft a Targeted Prompt: Write a prompt that explicitly instructs Perplexity to search within the uploaded documents or connected repositories. Include the specific information or topic you need to find. Specify the desired output format (e.g., bullet points per document, a synthesized summary with document references) and ask for citations from the source documents. Mention the file names or repository if applicable. Using phrases like "Across the following documents..." or "Within the connected [Repository Name]..." can be helpful.',
        'Submit the Query: Use the appropriate feature within Perplexity (e.g., the file upload option, or the designated search interface for connected repositories in Enterprise Pro) to submit your prompt and the documents/context.',
        'Review the Initial Response: Examine the information provided by Perplexity. Check if it directly addresses your query and if the output format is as requested. Look for the source citations linking to the specific documents.',
        'Verify Information Against Sources: This is a critical step. Click on the provided citations or open the original documents to confirm that the information extracted by the AI is accurate and is indeed present in the cited location. Be aware that AI can sometimes "hallucinate" information or citations.',
        'Refine and Iterate (If Needed): If the initial response is incomplete, inaccurate, or doesn\'t fully capture what you need, use follow-up questions. You can ask for more details, clarification, or request a search for a slightly different aspect of the topic within the same documents.',
        'Synthesize and Organize Findings: Once you have verified the information, consolidate the relevant points. You can use Perplexity features like \'Pages\' (if available in PE) or copy the information into your own research notes or report, organizing it by theme, document, or as required for your final use.'
      ],
      examplePrompts: [
        {
          title: 'Using Uploaded Documents',
          prompt: `Analyze the following uploaded documents: '[Document A.pdf]', '[Document B.docx]', and '[Document C.txt]'.

Find all mentions of the safety profile and reported side effects of [Specific Drug Name].

For each mention found across the documents, state the side effect or safety finding, and cite which specific document it came from (e.g., [Document A.pdf]).

Present the findings as a clear, bulleted list, grouping findings by document where appropriate.

Upload the specified files before submitting.`
        },
        {
          title: 'Using Connected Repository - Enterprise',
          prompt: `Search the connected 'Company Research Archive' repository.

Locate information related to customer feedback and user satisfaction data for the '[Specific Product Name]' from Q1 and Q2 of the current year.

Extract and summarize the key positive feedback points and key negative feedback points mentioned in any relevant documents.

Present the summary in two distinct sections ('Positive Feedback' and 'Negative Feedback'), and cite the document(s) where each point or theme was found.

This prompt assumes access to a connected repository like those available in Perplexity Enterprise Pro.`
        }
      ],
      exampleInAction: 'A structured response that presents the extracted information clearly. For using uploaded documents, this might be a bulleted list where each bullet details a safety finding or side effect and is followed by a citation like [Document B.docx]. For using connected repositories, it would present information under "Positive Feedback" and "Negative Feedback" headings, with each point referencing the source document(s) from the repository. The output should aim to be concise but comprehensive based on the specified documents, always providing the necessary source links for verification.',
      promptTemplate: `Analyze the following uploaded documents: '[DOCUMENT 1]', '[DOCUMENT 2]', and '[DOCUMENT 3]'.

Find all mentions of [SPECIFIC TOPIC OR INFORMATION NEEDED].

For each mention found across the documents, state the [FINDING TYPE], and cite which specific document it came from (e.g., [Document A.pdf]).

Present the findings as a clear, bulleted list, grouping findings by document where appropriate.

Upload the specified files before submitting.`,
      perplexityChatLink: '',
      tips: [
        'Be very specific about what information you\'re looking for - vague queries will yield less useful results.',
        'Always verify AI-extracted information by checking the original source documents through the provided citations.',
        'Use clear file naming conventions to make it easier to reference specific documents in your prompts.',
        'For Enterprise Pro users: ensure your repositories are properly connected and accessible before starting your search.',
        'If initial results are incomplete, use follow-up questions to dive deeper into specific aspects or request different formatting.',
        'Consider organizing your findings by document, theme, or chronologically depending on your final use case.',
        'Be aware that complex document formats (like tables or charts) may not be perfectly extracted by AI - manual verification is crucial.',
        'Use phrases like "Across the following documents..." or "Within the connected [Repository Name]..." to ensure Perplexity searches your specific sources.'
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
