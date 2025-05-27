
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
      name: 'Extract Key Points from Scientific Literature',
      whatItDoes: 'This process leverages Perplexity Enterprise\'s (PE) capabilities to analyze scientific papers, studies, or medical literature from web-based sources and potentially uploaded documents. It identifies, summarizes, and presents the key findings, methodologies, and implications of the research in a structured and digestible format. This streamlines the literature review process, saving time compared to manually sifting through extensive content.',
      whoItsFor: 'This is highly relevant for professionals who need to quickly understand the core contributions of scientific research, including Medical Writers, individuals in Scientific Affairs roles, and members of Publications teams. It is also broadly applicable to anyone doing academic research.',
      difficulty: 'Intermediate',
      steps: [
        'Define Your Research Scope: Clearly identify the topic, the type of scientific literature you are interested in (e.g., specific studies, review articles), and the key types of information you need to extract (e.g., primary findings, experimental setup, key conclusions, future implications).',
        'Craft a Specific Initial Prompt: Use a detailed prompt that includes the topic, the desired output format (e.g., bullet points, structured sections), and the specific elements you want extracted (findings, methodology, implications). Request a specific persona, such as a research assistant or scientific analyst, to tailor the output style.',
        'Use \'Academic\' Focus Mode: Before submitting your query, select the \'Academic\' focus mode in Perplexity to prioritize scholarly sources like peer-reviewed journals and research papers. You can also use date filters (e.g., `after:YYYY-MM-DD`) to focus on recent publications.',
        'Upload Specific Papers (Optional but Recommended): If you have specific scientific papers as PDF files, upload them to Perplexity. In your prompt, instruct Perplexity to analyze these specific documents and extract information from them, explicitly referencing the filename(s), e.g., "Analyze the attached paper \'[filename.pdf]\' and extract the key findings and methodology section". Note: Extracting data from complex formats like tables within PDFs may have limitations.',
        'Request Summarization and Extraction: Ask Perplexity to summarize the key points or specific sections of the literature. Prompts can include phrases like "Summarize the key findings of recent studies on [topic]" or "Extract the methodology used in the attached paper \'[filename.pdf]\'".',
        'Engage in Conversational Refinement: Review the initial response. Use follow-up questions to clarify details, request more information on specific aspects (e.g., "Can you elaborate on the statistical methods used?"), or ask for the implications for future research or practice. This iterative approach helps refine the results.',
        'Critically Review and Verify Sources: ALWAYS critically review the extracted information for accuracy. Perplexity provides citations for its responses. Click on these citations to verify the information in the original source. Be aware that AI can occasionally "hallucinate" or provide incorrect citations or summaries. Cross-referencing information from multiple sources or other tools is recommended.',
        'Organize Findings: Use Perplexity\'s features like \'Pages\' (if available in PE) or copy the extracted information into a separate document or note-taking tool to organize the key points according to your needs.',
        'Add Human Expertise: Integrate the AI-extracted information with your own understanding, background knowledge, and critical analysis to produce a comprehensive and insightful summary or report. AI is a research assistant, not a replacement for your expertise.'
      ],
      examplePrompts: [
        {
          title: 'General Literature Review',
          prompt: `Act as a scientific research assistant.

Synthesize the key points from the most impactful recent studies (published in the last 2 years) on [Specific Scientific Topic].

For each study, extract and summarize:
- Primary Finding(s)
- Key Methodology
- Main Conclusion(s)
- Implications for the field or future research

Present the information as a bulleted list under clear headings for each study. Ensure all information is supported by citations from peer-reviewed sources.

Use 'Academic' Focus mode for this prompt.`
        },
        {
          title: 'Document Analysis & Key Point Extraction',
          prompt: `Analyze the attached scientific paper, '[Specific Paper Title].pdf'.

Extract the following key information:
1. The research question or objective addressed by the study.
2. A summary of the experimental methodology used.
3. The primary results or findings.
4. The authors' main conclusions.
5. Any stated limitations of the study.
6. The suggested future directions or implications.

Present the information in a clear, structured format using numbered points or headings. Reference the attached document as the source for all extracted information.

Upload the specified PDF file before submitting this prompt.`
        }
      ],
      exampleInAction: 'A structured response that directly addresses the prompt\'s request for specific information types. For a general review prompt, it would list studies found (perhaps with a brief intro on the search parameters), followed by extracted bullet points for each study under headings like "Primary Finding," "Methodology," etc., with citations for each piece of information. For a document analysis prompt, it would present the requested points (Research Question, Methodology, Results, Conclusions, Limitations, Implications) derived specifically from the uploaded file, clearly indicating the source as the uploaded document. The language would be concise and factual, suitable for a scientific context.',
      promptTemplate: `Act as a scientific research assistant.

Synthesize the key points from the most impactful recent studies (published in the last [TIME PERIOD]) on [SPECIFIC SCIENTIFIC TOPIC].

For each study, extract and summarize:
- Primary Finding(s)
- Key Methodology
- Main Conclusion(s)
- Implications for the field or future research

Present the information as a bulleted list under clear headings for each study. Ensure all information is supported by citations from peer-reviewed sources.

Use 'Academic' Focus mode for this prompt.`,
      perplexityChatLink: '',
      tips: [
        'Always use \'Academic\' focus mode to prioritize peer-reviewed sources over general web content.',
        'Be specific about time frames - "published in the last 2 years" works better than "recent studies".',
        'When uploading PDFs, explicitly reference the filename in your prompt for better accuracy.',
        'Use follow-up questions to dive deeper into methodology, statistical analysis, or implications.',
        'Always verify citations by clicking through to the original sources - AI can occasionally provide incorrect references.',
        'Structure your prompts to request specific headings (Research Question, Methodology, Results, Conclusions) for consistent output format.',
        'Cross-reference findings across multiple sources when possible to ensure accuracy and completeness.'
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
