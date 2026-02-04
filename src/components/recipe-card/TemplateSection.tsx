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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="exampleInAction" className="text-sm font-medium text-foreground">
          Example in Action
        </Label>
        <Textarea
          id="exampleInAction"
          value={formData.exampleInAction}
          onChange={(e) => updateField('exampleInAction', e.target.value)}
          placeholder="Brief description of what the screenshot/link shows..."
          className="min-h-[80px] px-4 py-3 bg-secondary/50 border-0 rounded-xl resize-none focus:bg-background focus:ring-2 focus:ring-accent/20 transition-all duration-200"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="promptTemplate" className="text-sm font-medium text-foreground">
          Prompt Template
        </Label>
        <Textarea
          id="promptTemplate"
          value={formData.promptTemplate}
          onChange={(e) => updateField('promptTemplate', e.target.value)}
          placeholder="Provide a copy-paste ready template with clear placeholders..."
          className="min-h-[160px] px-4 py-3 bg-secondary/50 border-0 rounded-xl resize-none font-mono text-sm focus:bg-background focus:ring-2 focus:ring-accent/20 transition-all duration-200"
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="perplexityChatLink" className="text-sm font-medium text-foreground">
          Live Demo Link
        </Label>
        <Input
          id="perplexityChatLink"
          value={formData.perplexityChatLink}
          onChange={(e) => updateField('perplexityChatLink', e.target.value)}
          placeholder="https://... (Link to a live example or demo)"
          className="h-12 px-4 bg-secondary/50 border-0 rounded-xl focus:bg-background focus:ring-2 focus:ring-accent/20 transition-all duration-200"
        />
      </div>
    </div>
  );
};

export default TemplateSection;
