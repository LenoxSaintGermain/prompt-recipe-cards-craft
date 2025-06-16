
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Wand2, Loader2, AlertCircle, Brain, Plus, FileText } from 'lucide-react';
import { parseRecipeContent } from '@/services/aiService';
import { toast } from 'sonner';
import { RecipeCard } from '@/components/RecipeCardEditor';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useContentAnalysis, CollectionSuggestion } from '@/hooks/useContentAnalysis';

interface DetectedCard {
  data: Partial<RecipeCard>;
  suggestions: CollectionSuggestion[];
  selected: boolean;
}

interface MultiCardImportSectionProps {
  onImport: (parsedCards: Partial<RecipeCard>[]) => void;
}

const MultiCardImportSection: React.FC<MultiCardImportSectionProps> = ({ onImport }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedCards, setDetectedCards] = useState<DetectedCard[]>([]);
  const { analyzeCardForCollections } = useContentAnalysis();

  const handleParseContent = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content to parse');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDetectedCards([]);
    
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
      
      // Handle both single card and multi-card responses
      const cards = parsedData.cards || [parsedData];
      
      const processedCards: DetectedCard[] = cards.map((cardData: any) => {
        // Normalize the card data to handle both camelCase and snake_case properties
        const normalizedCardData = {
          name: cardData.name || '',
          whatItDoes: cardData.whatItDoes || cardData.what_it_does || '',
          whoItsFor: cardData.whoItsFor || cardData.who_its_for || '',
          difficulty: cardData.difficulty || 'Beginner',
          steps: cardData.steps || [],
          examplePrompts: cardData.examplePrompts || cardData.example_prompts || [],
          tips: cardData.tips || [],
          promptTemplate: cardData.promptTemplate || cardData.prompt_template || '',
          exampleInAction: cardData.exampleInAction || cardData.example_in_action || '',
          perplexityChatLink: ''
        };

        const mockCard: RecipeCard = {
          id: 'temp',
          ...normalizedCardData
        };
        
        const suggestions = analyzeCardForCollections(mockCard);
        
        return {
          data: normalizedCardData,
          suggestions,
          selected: true
        };
      });
      
      setDetectedCards(processedCards);
      setContent('');
      setError(null);
      
      const totalCards = processedCards.length;
      const topSuggestions = processedCards
        .flatMap(card => card.suggestions.slice(0, 1))
        .filter((suggestion, index, self) => 
          index === self.findIndex(s => s.collectionName === suggestion.collectionName)
        );
      
      if (totalCards > 1) {
        toast.success(
          `${totalCards} recipe cards detected! ${topSuggestions.length > 0 ? 
            `Recommended collections: ${topSuggestions.map(s => s.collectionName).join(', ')}` : 
            'Review and select cards to import.'}`
        );
      } else {
        const topSuggestion = processedCards[0]?.suggestions[0];
        toast.success(
          topSuggestion ? 
            `Content parsed successfully! Recommended for "${topSuggestion.collectionName}" collection (${Math.round(topSuggestion.confidence * 100)}% confidence)` :
            'Content parsed successfully! Review and edit the populated fields.'
        );
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

  const handleCardSelection = (index: number, selected: boolean) => {
    setDetectedCards(prev => prev.map((card, i) => 
      i === index ? { ...card, selected } : card
    ));
  };

  const handleImportSelected = () => {
    const selectedCards = detectedCards.filter(card => card.selected);
    if (selectedCards.length === 0) {
      toast.error('Please select at least one card to import');
      return;
    }
    
    onImport(selectedCards.map(card => card.data));
    setDetectedCards([]);
    toast.success(`${selectedCards.length} cards imported successfully!`);
  };

  return (
    <Card className="mb-6 border-dashed border-2 border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-blue-800 flex items-center gap-2">
          <Wand2 className="w-5 h-5" />
          Smart Multi-Card Import with Auto-Categorization
        </CardTitle>
        <p className="text-sm text-blue-600">
          Paste content containing multiple recipe cards and AI will automatically detect, parse, and suggest collections for each card.
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

        {detectedCards.length > 0 && (
          <Alert className="border-green-200 bg-green-50">
            <Brain className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="space-y-3">
                <p className="font-medium text-green-800">
                  {detectedCards.length} recipe card{detectedCards.length > 1 ? 's' : ''} detected! Review and select which ones to import:
                </p>
                <div className="space-y-3">
                  {detectedCards.map((card, index) => (
                    <div key={index} className="border border-green-200 rounded-md p-3 bg-white">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={card.selected}
                          onCheckedChange={(checked) => handleCardSelection(index, checked as boolean)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-gray-800">{card.data.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {card.data.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {card.data.whatItDoes}
                          </p>
                          {card.suggestions.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {card.suggestions.slice(0, 2).map((suggestion, suggestionIndex) => (
                                <Badge 
                                  key={suggestionIndex}
                                  variant="secondary" 
                                  className="bg-blue-100 text-blue-800 text-xs"
                                >
                                  {suggestion.collectionName} ({Math.round(suggestion.confidence * 100)}%)
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleImportSelected}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Import Selected Cards ({detectedCards.filter(c => c.selected).length})
                  </Button>
                  <Button 
                    onClick={() => setDetectedCards([])}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
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
            placeholder="Paste your content here... For example:&#10;&#10;Multiple 'Prompt Recipe Cards' separated by sections...&#10;OR&#10;Training documents with embedded recipe cards...&#10;OR&#10;Workflow outlines containing multiple procedures..."
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

export default MultiCardImportSection;
