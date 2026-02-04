import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Lightbulb, Loader2, X } from 'lucide-react';
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
      if (field === 'steps' || field === 'tips' || field === 'examplePrompts') {
        const parsed = JSON.parse(suggestion);
        onSuggestionApply(field, parsed);
      } else {
        onSuggestionApply(field, suggestion);
      }
      toast.success(`Applied AI suggestion to ${field}`);
      setSuggestions(prev => {
        const newSuggestions = { ...prev };
        delete newSuggestions[field];
        return newSuggestions;
      });
    } catch (error) {
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
  const getScoreColor = () => {
    if (qualityScore >= 80) return 'text-difficulty-beginner';
    if (qualityScore >= 60) return 'text-difficulty-intermediate';
    return 'text-difficulty-advanced';
  };

  const fieldLabels: Record<string, string> = {
    name: 'Title',
    whatItDoes: 'Description',
    whoItsFor: 'Audience',
    steps: 'Steps',
    examplePrompts: 'Examples',
    tips: 'Tips'
  };

  return (
    <Card className="w-80 border border-border rounded-2xl shadow-glass-lg bg-card/95 backdrop-blur-xl overflow-hidden">
      <CardHeader className="pb-4 border-b border-border">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Sparkles className="w-4 h-4 text-accent" />
          AI Copilot
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
        {/* Quality Score */}
        <div className="bg-secondary/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Content Quality</span>
            <span className={`text-2xl font-semibold ${getScoreColor()}`}>{qualityScore}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                qualityScore >= 80 ? 'bg-difficulty-beginner' : 
                qualityScore >= 60 ? 'bg-difficulty-intermediate' : 
                'bg-difficulty-advanced'
              }`}
              style={{ width: `${qualityScore}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {qualityScore >= 80 ? "Excellent! Your pattern is well-structured." :
             qualityScore >= 60 ? "Good progress. Consider adding more details." :
             "Fill in more sections for a complete pattern."}
          </p>
        </div>

        {/* Field Suggestions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Get AI Suggestions</h4>
          
          {['name', 'whatItDoes', 'whoItsFor', 'steps', 'examplePrompts', 'tips'].map((field) => (
            <div key={field} className="bg-secondary/20 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {fieldLabels[field] || field}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => getSuggestion(field as keyof RecipeCard)}
                  disabled={loadingSuggestions.includes(field)}
                  className="h-7 px-2 rounded-lg press-effect"
                >
                  {loadingSuggestions.includes(field) ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Lightbulb className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
              
              {suggestions[field] && (
                <div className="space-y-2 animate-fade-up">
                  <div className="text-xs text-muted-foreground bg-background p-2 rounded-lg max-h-24 overflow-y-auto">
                    {typeof suggestions[field] === 'string' 
                      ? suggestions[field] 
                      : JSON.stringify(suggestions[field], null, 2)}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => applySuggestion(field as keyof RecipeCard, suggestions[field])}
                    className="w-full h-7 text-xs rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 press-effect"
                  >
                    Apply Suggestion
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AICopilotPanel;
