
import { supabase } from '@/integrations/supabase/client';

export interface AIProvider {
  name: string;
  displayName: string;
  available: boolean;
}

export const getAvailableAIProviders = async (): Promise<AIProvider[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('check-ai-providers');
    if (error) {
      console.error('Error checking AI providers:', error);
      return [];
    }
    return data.providers || [];
  } catch (error) {
    console.error('Error checking AI providers:', error);
    return [];
  }
};

export const generateWithAI = async (prompt: string, provider: 'gemini' | 'claude' = 'gemini'): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-with-ai', {
      body: { prompt, provider }
    });

    if (error) {
      console.error('Error generating with AI:', error);
      throw new Error('Failed to generate content with AI');
    }

    return data.generatedText || '';
  } catch (error) {
    console.error('Error generating with AI:', error);
    throw error;
  }
};

export const improveRecipeCard = async (cardData: any, provider: 'gemini' | 'claude' = 'gemini'): Promise<any> => {
  try {
    const { data, error } = await supabase.functions.invoke('improve-recipe-card', {
      body: { cardData, provider }
    });

    if (error) {
      console.error('Error improving recipe card:', error);
      throw new Error('Failed to improve recipe card with AI');
    }

    return data.improvedCard || cardData;
  } catch (error) {
    console.error('Error improving recipe card:', error);
    throw error;
  }
};

export const parseRecipeContent = async (content: string, provider: 'gemini' | 'claude' = 'gemini'): Promise<any> => {
  try {
    const { data, error } = await supabase.functions.invoke('parse-recipe-content', {
      body: { content, provider }
    });

    if (error) {
      console.error('Error parsing recipe content:', error);
      throw new Error('Failed to parse recipe content');
    }

    return data.parsedData || {};
  } catch (error) {
    console.error('Error parsing recipe content:', error);
    throw error;
  }
};

export const getRecipeAssistance = async (
  field: string, 
  currentValue: string, 
  context: any, 
  provider: 'gemini' | 'claude' = 'gemini'
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('recipe-assistant', {
      body: { field, currentValue, context, provider }
    });

    if (error) {
      console.error('Error getting recipe assistance:', error);
      throw new Error('Failed to get recipe assistance');
    }

    return data.suggestion || '';
  } catch (error) {
    console.error('Error getting recipe assistance:', error);
    throw error;
  }
};
