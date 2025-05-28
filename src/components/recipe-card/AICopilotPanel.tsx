
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Bot, ChevronDown, ChevronUp, Lightbulb, Loader2 } from 'lucide-react';
import { getRecipeAssistance } from '@/services/aiService';
import { toast } from 'sonner';
import { RecipeCard } from '@/components/RecipeCardEditor';

interface AICopilotPanelProps {
  formData: RecipeCard;
  currentField?: string;
  onSuggestionApply: (field: keyof RecipeCard, value: any) => void;
}

const AICopilotPanel: React.FC<AICopilotPanelProps> = ({ 
  formData, 
  currentField, 
  onSuggestionApply 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Record<string, any>>({});

  const getSuggestion = async (field: keyof RecipeCard) => {
    if (loadingSuggestions.includes(field)) return;

    setLoadingSuggestions(prev => [...prev, field]);
    try {
      const currentValue = formData[field];
      const suggestion = await getRecipeAssistance(
        field, 
        Array.isArray(currentValue) ? currentValue.join(', ') : String(currentValue || ''), 
        formData
      );
      
      setSuggestions(prev => ({ ...prev, [field]: suggestion }));
    } catch (error) {
      console.error('Error getting suggestion:', error);
      toast.error(`Failed to get suggestion for ${field}`);
    } finally {
      setLoadingSuggestions(prev => prev.filter(f => f !== field));
    }
  };

  const applySuggestion = (field: keyof RecipeCard, suggestion: any) => {
    try {
      // Try to parse JSON suggestions for arrays
      if (field === 'steps' || field === 'tips' || field === 'examplePrompts') {
        const parsed = JSON.parse(suggestion);
        onSuggestionApply(field, parsed);
      } else {
        onSuggestionApply(field, suggestion);
      }
      toast.success(`Applied AI suggestion to ${field}`);
    } catch (error) {
      // If JSON parsing fails, use as plain text
      onSuggestionApply(field, suggestion);
      toast.success(`Applied AI suggestion to ${field}`);
    }
  };

  const getQualityScore = () => {
    let score = 0;
    let maxScore = 7;
    
    if (formData.name.length > 3) score++;
    if (formData.whatItDoes.length > 50) score++;
    if (formData.whoItsFor.length > 20) score++;
    if (formData.steps.length >= 3) score++;
    if (formData.examplePrompts.length >= 1) score++;
    if (formData.promptTemplate.length > 20) score++;
    if (formData.tips.length >= 3) score++;
    
    return Math.round((score / maxScore) * 100);
  };

  const qualityScore = getQualityScore();

  return (
    <div className="w-80 border-l border-gray-200 bg-gray-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-between p-4 h-auto font-semibold"
          >
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-600" />
              AI Co-pilot
            </div>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="px-4 pb-4">
          <div className="space-y-4">
            {/* Quality Score */}
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  Content Quality
                  <Badge variant={qualityScore >= 80 ? "default" : qualityScore >= 60 ? "secondary" : "destructive"}>
                    {qualityScore}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-gray-600">
                  {qualityScore >= 80 ? "Excellent! Your recipe is well-structured." :
                   qualityScore >= 60 ? "Good progress. Consider adding more details." :
                   "Needs work. Fill in more sections for a complete recipe."}
                </div>
              </CardContent>
            </Card>

            {/* Field Suggestions */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">AI Suggestions</h4>
              
              {['name', 'whatItDoes', 'whoItsFor', 'steps', 'examplePrompts', 'tips'].map((field) => (
                <Card key={field} className="bg-white">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium capitalize text-gray-600">
                        {field === 'whatItDoes' ? 'What it does' : 
                         field === 'whoItsFor' ? 'Who it\'s for' :
                         field === 'examplePrompts' ? 'Examples' : field}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => getSuggestion(field as keyof RecipeCard)}
                        disabled={loadingSuggestions.includes(field)}
                        className="h-6 px-2 text-xs"
                      >
                        {loadingSuggestions.includes(field) ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Lightbulb className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    
                    {suggestions[field] && (
                      <div className="space-y-2">
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded max-h-20 overflow-y-auto">
                          {typeof suggestions[field] === 'string' 
                            ? suggestions[field] 
                            : JSON.stringify(suggestions[field], null, 2)}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => applySuggestion(field as keyof RecipeCard, suggestions[field])}
                          className="w-full h-6 text-xs"
                        >
                          Apply
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AICopilotPanel;
