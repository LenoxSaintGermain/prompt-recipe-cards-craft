
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RecipeCard } from '@/components/RecipeCardEditor';
import { toast } from 'sonner';
import { withRetry, isNetworkError } from '@/utils/retryUtils';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';

export const useRecipeCards = () => {
  const [cards, setCards] = useState<RecipeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setConnecting } = useConnectionStatus();

  // Load cards from Supabase with retry logic
  const loadCards = async () => {
    try {
      setLoading(true);
      setError(null);
      setConnecting(true);

      const result = await withRetry(
        async () => {
          const { data, error } = await supabase
            .from('recipe_cards')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }
          return data;
        },
        {
          maxAttempts: 3,
          delayMs: 1000,
          onRetry: (attempt, error) => {
            console.log(`Retrying to load cards (attempt ${attempt}):`, error);
            if (isNetworkError(error)) {
              toast.info(`Connection issue. Retrying... (${attempt}/3)`);
            }
          }
        }
      );

      // Transform database data to match RecipeCard interface
      const transformedCards: RecipeCard[] = result.map(dbCard => ({
        id: dbCard.id,
        name: dbCard.name,
        whatItDoes: dbCard.what_it_does,
        whoItsFor: dbCard.who_its_for,
        difficulty: dbCard.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        steps: Array.isArray(dbCard.steps) ? dbCard.steps as string[] : [],
        examplePrompts: Array.isArray(dbCard.example_prompts) 
          ? dbCard.example_prompts as { title: string; prompt: string }[] 
          : [],
        exampleInAction: dbCard.example_in_action || '',
        promptTemplate: dbCard.prompt_template || '',
        perplexityChatLink: dbCard.perplexity_chat_link || '',
        tips: Array.isArray(dbCard.tips) ? dbCard.tips as string[] : []
      }));

      setCards(transformedCards);
      setError(null);
    } catch (error) {
      console.error('Error loading cards:', error);
      const errorMessage = isNetworkError(error) 
        ? 'Connection failed. Please check your internet connection and try again.'
        : 'Failed to load recipe cards. Please try again.';
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setConnecting(false);
    }
  };

  // Save card to Supabase with retry logic
  const saveCard = async (card: RecipeCard) => {
    try {
      setConnecting(true);
      
      // Transform RecipeCard to database format
      const dbCard = {
        name: card.name,
        what_it_does: card.whatItDoes,
        who_its_for: card.whoItsFor,
        difficulty: card.difficulty,
        steps: card.steps,
        example_prompts: card.examplePrompts,
        example_in_action: card.exampleInAction,
        prompt_template: card.promptTemplate,
        perplexity_chat_link: card.perplexityChatLink,
        tips: card.tips
      };

      await withRetry(
        async () => {
          if (card.id && cards.find(c => c.id === card.id)) {
            // Update existing card
            const { error } = await supabase
              .from('recipe_cards')
              .update(dbCard)
              .eq('id', card.id);

            if (error) throw error;
          } else {
            // Insert new card - don't include id, let database generate it
            const { data, error } = await supabase
              .from('recipe_cards')
              .insert([dbCard])
              .select()
              .single();

            if (error) throw error;
          }
        },
        {
          maxAttempts: 3,
          delayMs: 1000,
          onRetry: (attempt, error) => {
            console.log(`Retrying to save card (attempt ${attempt}):`, error);
            if (isNetworkError(error)) {
              toast.info(`Connection issue. Retrying save... (${attempt}/3)`);
            }
          }
        }
      );

      const action = card.id && cards.find(c => c.id === card.id) ? 'updated' : 'created';
      toast.success(`Recipe card ${action} successfully!`);

      // Reload cards to get updated data
      await loadCards();
      return true;
    } catch (error) {
      console.error('Error saving card:', error);
      const errorMessage = isNetworkError(error)
        ? 'Connection failed. Please check your internet connection and try again.'
        : 'Failed to save recipe card. Please try again.';
      
      toast.error(errorMessage);
      return false;
    } finally {
      setConnecting(false);
    }
  };

  // Delete card from Supabase with retry logic
  const deleteCard = async (cardId: string) => {
    try {
      setConnecting(true);

      await withRetry(
        async () => {
          const { error } = await supabase
            .from('recipe_cards')
            .delete()
            .eq('id', cardId);

          if (error) throw error;
        },
        {
          maxAttempts: 3,
          delayMs: 1000,
          onRetry: (attempt, error) => {
            console.log(`Retrying to delete card (attempt ${attempt}):`, error);
            if (isNetworkError(error)) {
              toast.info(`Connection issue. Retrying delete... (${attempt}/3)`);
            }
          }
        }
      );

      toast.success('Recipe card deleted successfully!');
      await loadCards();
      return true;
    } catch (error) {
      console.error('Error deleting card:', error);
      const errorMessage = isNetworkError(error)
        ? 'Connection failed. Please check your internet connection and try again.'
        : 'Failed to delete recipe card. Please try again.';
      
      toast.error(errorMessage);
      return false;
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  return {
    cards,
    loading,
    error,
    saveCard,
    deleteCard,
    reloadCards: loadCards
  };
};
