
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import { parseRecipeContent } from '@/services/aiService';
import { toast } from 'sonner';
import { RecipeCard } from '@/components/RecipeCardEditor';

interface SmartImportSectionProps {
  onImport: (parsedData: Partial<RecipeCard>) => void;
}

const SmartImportSection: React.FC<SmartImportSectionProps> = ({ onImport }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleParseContent = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content to parse');
      return;
    }

    setIsLoading(true);
    try {
      const parsedData = await parseRecipeContent(content);
      onImport(parsedData);
      setContent('');
      toast.success('Content parsed successfully! Review and edit the populated fields.');
    } catch (error) {
      console.error('Error parsing content:', error);
      toast.error('Failed to parse content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6 border-dashed border-2 border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-blue-800 flex items-center gap-2">
          <Wand2 className="w-5 h-5" />
          Smart Import
        </CardTitle>
        <p className="text-sm text-blue-600">
          Paste any content (meeting notes, documentation, etc.) and AI will automatically populate the recipe card fields.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="import-content">Content to Parse</Label>
          <Textarea
            id="import-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your content here... For example:&#10;&#10;Meeting notes about creating email templates for customer onboarding...&#10;OR&#10;Documentation about analyzing survey data...&#10;OR&#10;Any other content you want to turn into a prompt recipe."
            className="mt-1 min-h-[120px]"
          />
        </div>
        <Button 
          onClick={handleParseContent} 
          disabled={isLoading || !content.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Parsing Content...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Parse & Populate Form
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SmartImportSection;
