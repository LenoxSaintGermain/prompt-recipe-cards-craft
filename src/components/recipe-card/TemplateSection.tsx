
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RecipeCard } from '@/components/RecipeCardEditor';

interface TemplateSectionProps {
  formData: RecipeCard;
  updateField: (field: keyof RecipeCard, value: any) => void;
}

const TemplateSection: React.FC<TemplateSectionProps> = ({ formData, updateField }) => {
  return (
    <>
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
    </>
  );
};

export default TemplateSection;
