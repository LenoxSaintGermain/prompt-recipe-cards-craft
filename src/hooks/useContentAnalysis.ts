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
    
    // Research & Discovery Detection
    const researchKeywords = [
      'research', 'search', 'citations', 'sources', 'fact-checking', 'academic',
      'web search', 'real-time', 'current events', 'news analysis', 'market scan',
      'innovation', 'deep research', 'source verification', 'discovery',
      'investigate', 'analyze', 'explore', 'find', 'gather'
    ];
    
    const researchMatches = researchKeywords.filter(keyword => 
      content.includes(keyword)
    );
    
    if (researchMatches.length > 0) {
      suggestions.push({
        collectionName: 'Research & Discovery',
        confidence: Math.min(0.95, researchMatches.length * 0.15 + 0.4),
        reasons: [
          `Found ${researchMatches.length} research-related keywords`,
          `Keywords: ${researchMatches.slice(0, 4).join(', ')}`
        ]
      });
    }
    
    // Business Development Detection
    const bizdevKeywords = [
      'outreach', 'email', 'sales', 'client', 'business development',
      'linkedin', 'networking', 'lead generation', 'prospecting', 'partnerships',
      'strategic alliances', 'stakeholder', 'competitive analysis', 'enterprise'
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
      'marketing', 'copywriting', 'creative', 'storytelling', 'communication',
      'draft', 'compose', 'generate', 'create'
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

    // Data Analysis Detection
    const dataKeywords = [
      'data', 'analysis', 'analytics', 'metrics', 'insights',
      'visualization', 'statistics', 'trends', 'patterns', 'reports',
      'dashboard', 'kpi', 'measure', 'track'
    ];
    
    const dataMatches = dataKeywords.filter(keyword => 
      content.includes(keyword)
    );
    
    if (dataMatches.length > 0) {
      suggestions.push({
        collectionName: 'Data Analysis',
        confidence: Math.min(0.85, dataMatches.length * 0.12 + 0.3),
        reasons: [
          `Found ${dataMatches.length} data analysis keywords`,
          `Keywords: ${dataMatches.slice(0, 3).join(', ')}`
        ]
      });
    }

    // Code Generation Detection
    const codeKeywords = [
      'code', 'programming', 'developer', 'software', 'api',
      'function', 'script', 'automation', 'debug', 'refactor',
      'typescript', 'javascript', 'python', 'sql'
    ];
    
    const codeMatches = codeKeywords.filter(keyword => 
      content.includes(keyword)
    );
    
    if (codeMatches.length > 0) {
      suggestions.push({
        collectionName: 'Code Generation',
        confidence: Math.min(0.9, codeMatches.length * 0.15 + 0.35),
        reasons: [
          `Found ${codeMatches.length} coding-related keywords`,
          `Keywords: ${codeMatches.slice(0, 3).join(', ')}`
        ]
      });
    }

    // Learning & Education Detection
    const learningKeywords = [
      'learn', 'teach', 'explain', 'understand', 'tutorial',
      'guide', 'course', 'training', 'education', 'lesson',
      'concept', 'principle', 'methodology'
    ];
    
    const learningMatches = learningKeywords.filter(keyword => 
      content.includes(keyword)
    );
    
    if (learningMatches.length > 0) {
      suggestions.push({
        collectionName: 'Learning & Education',
        confidence: Math.min(0.75, learningMatches.length * 0.12 + 0.25),
        reasons: [
          `Found ${learningMatches.length} learning-related keywords`,
          `Keywords: ${learningMatches.slice(0, 3).join(', ')}`
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
