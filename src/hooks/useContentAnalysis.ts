
import { RecipeCard } from '@/components/RecipeCardEditor';

export interface CollectionSuggestion {
  collectionName: string;
  confidence: number;
  reasons: string[];
}

export const useContentAnalysis = () => {
  const analyzeCardForCollections = (card: RecipeCard): CollectionSuggestion[] => {
    const suggestions: CollectionSuggestion[] = [];
    const content = `${card.name} ${card.whatItDoes} ${card.whoItsFor} ${card.steps?.join(' ') || ''} ${card.tips?.join(' ') || ''} ${card.promptTemplate || ''}`.toLowerCase();
    
    // Enhanced Perplexity Training Detection
    const perplexityKeywords = [
      'perplexity', 'enterprise', 'research', 'search', 'citations', 'sources',
      'fact-checking', 'academic', 'business intelligence', 'ai-powered search',
      'web search', 'real-time', 'current events', 'news analysis', 'market scan',
      'innovation market scan', 'ophthalmology', 'diabetic retinopathy', 'digital health',
      'strategy team', 'competitive intelligence', 'market research', 'focus mode',
      'deep research', 'hallucination', 'source verification', 'responsible ai'
    ];
    
    const perplexityMatches = perplexityKeywords.filter(keyword => 
      content.includes(keyword)
    );
    
    if (perplexityMatches.length > 0) {
      suggestions.push({
        collectionName: 'Perplexity Training',
        confidence: Math.min(0.95, perplexityMatches.length * 0.15 + 0.4),
        reasons: [
          `Found ${perplexityMatches.length} Perplexity-related keywords`,
          `Keywords: ${perplexityMatches.slice(0, 4).join(', ')}`
        ]
      });
    }
    
    // Business Development Detection
    const bizdevKeywords = [
      'outreach', 'email', 'sales', 'client', 'business development',
      'linkedin', 'networking', 'lead generation', 'prospecting', 'partnerships',
      'strategic alliances', 'stakeholder', 'competitive analysis'
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
      'marketing', 'copywriting', 'creative', 'storytelling', 'communication'
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

    // Market Research Detection
    const marketResearchKeywords = [
      'market scan', 'competitive analysis', 'industry analysis', 'trend analysis',
      'market intelligence', 'research methodology', 'data analysis', 'insights',
      'pharmaceutical', 'healthcare', 'innovation', 'strategy team'
    ];
    
    const marketResearchMatches = marketResearchKeywords.filter(keyword => 
      content.includes(keyword)
    );
    
    if (marketResearchMatches.length > 0) {
      suggestions.push({
        collectionName: 'Market Research',
        confidence: Math.min(0.85, marketResearchMatches.length * 0.12 + 0.3),
        reasons: [
          `Found ${marketResearchMatches.length} market research keywords`,
          `Keywords: ${marketResearchMatches.slice(0, 3).join(', ')}`
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
        whatItDoes: template.what_it_does || '',
        whoItsFor: template.who_its_for || '',
        difficulty: 'Beginner',
        steps: template.steps || [],
        examplePrompts: template.example_prompts || [],
        tips: template.tips || [],
        promptTemplate: template.prompt_template || '',
        exampleInAction: '',
        perplexityChatLink: ''
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
