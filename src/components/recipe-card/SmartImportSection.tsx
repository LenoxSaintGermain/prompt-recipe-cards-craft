
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wand2, Loader2, AlertCircle, Brain } from 'lucide-react';
import { parseRecipeContent } from '@/services/aiService';
import { toast } from 'sonner';
import { RecipeCard } from '@/components/RecipeCardEditor';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useContentAnalysis, CollectionSuggestion } from '@/hooks/useContentAnalysis';

interface SmartImportSectionProps {
  onImport: (parsedData: Partial<RecipeCard>) => void;
}

const SmartImportSection: React.FC<SmartImportSectionProps> = ({ onImport }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<CollectionSuggestion[]>([]);
  const { analyzeCardForCollections } = useContentAnalysis();

  const handleParseContent = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content to parse');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    
    try {
      console.log('Attempting to parse content with Gemini...');
      let parsedData;
      
      try {
        parsedData = await parseRecipeContent(content, 'gemini');
      } catch (geminiError) {
        console.log('Gemini failed, trying Claude...', geminiError);
        toast.warning('Gemini API unavailable, trying Claude...');
        parsedData = await parseRecipeContent(content, 'claude');
      }
      
      // Analyze content for collection suggestions
      const mockCard: RecipeCard = {
        id: 'temp',
        name: parsedData.name || '',
        what_it_does: parsedData.what_it_does || '',
        who_its_for: parsedData.who_its_for || '',
        difficulty: parsedData.difficulty || 'Beginner',
        steps: parsedData.steps || [],
        example_prompts: parsedData.example_prompts || [],
        tips: parsedData.tips || [],
        prompt_template: parsedData.prompt_template || '',
        department: parsedData.department || [],
        tags: parsedData.tags || []
      };
      
      const collectionSuggestions = analyzeCardForCollections(mockCard);
      setSuggestions(collectionSuggestions);
      
      onImport(parsedData);
      setContent('');
      setError(null);
      
      if (collectionSuggestions.length > 0) {
        const topSuggestion = collectionSuggestions[0];
        toast.success(
          `Content parsed successfully! Recommended for "${topSuggestion.collectionName}" collection (${Math.round(topSuggestion.confidence * 100)}% confidence)`
        );
      } else {
        toast.success('Content parsed successfully! Review and edit the populated fields.');
      }
    } catch (error) {
      console.error('Error parsing content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse content';
      setError(errorMessage);
      
      if (errorMessage.includes('API key not configured')) {
        toast.error('AI API keys not configured. Please contact your administrator.');
      } else {
        toast.error('Failed to parse content. Please try again or check the content format.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6 border-dashed border-2 border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-blue-800 flex items-center gap-2">
          <Wand2 className="w-5 h-5" />
          Smart Import with Auto-Categorization
        </CardTitle>
        <p className="text-sm text-blue-600">
          Paste any content and AI will automatically populate the recipe card fields and suggest relevant collections.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {suggestions.length > 0 && (
          <Alert className="border-green-200 bg-green-50">
            <Brain className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium text-green-800">Collection Recommendations:</p>
                {suggestions.slice(0, 2).map((suggestion, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-green-100 text-green-800"
                    >
                      {suggestion.collectionName}
                    </Badge>
                    <span className="text-sm text-green-700">
                      {Math.round(suggestion.confidence * 100)}% confidence
                    </span>
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div>
          <Label htmlFor="import-content">Content to Parse</Label>
          <Textarea
            id="import-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your content here... For example:&#10;&#10;'Here is a Prompt Recipe Card for Customizing Emails for Business Development Outreach...'&#10;OR&#10;Meeting notes about Perplexity research workflows...&#10;OR&#10;Any other content you want to turn into a prompt recipe."
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
              Parsing & Analyzing Content...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Parse & Auto-Categorize
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SmartImportSection;
