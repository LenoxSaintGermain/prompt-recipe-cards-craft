
import { RecipeCard } from '@/components/RecipeCardEditor';

export interface CollectionSuggestion {
  collectionName: string;
  confidence: number;
  reasons: string[];
}

export const useContentAnalysis = () => {
  const analyzeCardForCollections = (card: RecipeCard): CollectionSuggestion[] => {
    const suggestions: CollectionSuggestion[] = [];
    const content = `${card.name} ${card.whatItDoes} ${card.whoItsFor} ${card.steps?.join(' ') || ''} ${card.tips?.join(' ') || ''} ${card.prompt_template || ''}`.toLowerCase();
    
    // Perplexity Training Detection
    const perplexityKeywords = [
      'perplexity', 'enterprise', 'research', 'search', 'citations', 'sources',
      'fact-checking', 'academic', 'business intelligence', 'ai-powered search',
      'web search', 'real-time', 'current events', 'news analysis'
    ];
    
    const perplexityMatches = perplexityKeywords.filter(keyword => 
      content.includes(keyword)
    );
    
    if (perplexityMatches.length > 0) {
      suggestions.push({
        collectionName: 'Perplexity Training',
        confidence: Math.min(0.9, perplexityMatches.length * 0.2 + 0.3),
        reasons: [
          `Found ${perplexityMatches.length} Perplexity-related keywords`,
          `Keywords: ${perplexityMatches.slice(0, 3).join(', ')}`
        ]
      });
    }
    
    // Business Development Detection
    const bizdevKeywords = [
      'outreach', 'email', 'sales', 'client', 'business development',
      'linkedin', 'networking', 'lead generation', 'prospecting'
    ];
    
    const bizdevMatches = bizdevKeywords.filter(keyword => 
      content.includes(keyword)
    );
    
    if (bizdevMatches.length > 0) {
      suggestions.push({
        collectionName: 'Business Development',
        confidence: Math.min(0.8, bizdevMatches.length * 0.15 + 0.25),
        reasons: [
          `Found ${bizdevMatches.length} business development keywords`,
          `Keywords: ${bizdevMatches.slice(0, 3).join(', ')}`
        ]
      });
    }
    
    // Content Creation Detection
    const contentKeywords = [
      'writing', 'content', 'blog', 'article', 'social media',
      'marketing', 'copywriting', 'creative', 'storytelling'
    ];
    
    const contentMatches = contentKeywords.filter(keyword => 
      content.includes(keyword)
    );
    
    if (contentMatches.length > 0) {
      suggestions.push({
        collectionName: 'Content Creation',
        confidence: Math.min(0.75, contentMatches.length * 0.12 + 0.25),
        reasons: [
          `Found ${contentMatches.length} content creation keywords`,
          `Keywords: ${contentMatches.slice(0, 3).join(', ')}`
        ]
      });
    }
    
    return suggestions.sort((a, b) => b.confidence - a.confidence);
  };

  const suggestCollectionForImport = (cardTemplates: any[]): Record<string, CollectionSuggestion[]> => {
    const suggestions: Record<string, CollectionSuggestion[]> = {};
    
    cardTemplates.forEach((template, index) => {
      const mockCard: RecipeCard = {
        id: `temp-${index}`,
        name: template.name || '',
        what_it_does: template.what_it_does || '',
        who_its_for: template.who_its_for || '',
        difficulty: 'Beginner',
        steps: template.steps || [],
        example_prompts: template.example_prompts || [],
        tips: template.tips || [],
        prompt_template: template.prompt_template || '',
        department: template.target_departments || [],
        tags: [template.primary_llm_skill].filter(Boolean) || []
      };
      
      suggestions[template.name] = analyzeCardForCollections(mockCard);
    });
    
    return suggestions;
  };

  return {
    analyzeCardForCollections,
    suggestCollectionForImport
  };
};
