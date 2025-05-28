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
