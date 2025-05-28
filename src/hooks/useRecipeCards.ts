
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RecipeCard } from '@/components/RecipeCardEditor';
import { toast } from 'sonner';

export const useRecipeCards = () => {
  const [cards, setCards] = useState<RecipeCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cards from Supabase
  const loadCards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipe_cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading cards:', error);
        toast.error('Failed to load recipe cards');
        return;
      }

      // Transform database data to match RecipeCard interface
      const transformedCards: RecipeCard[] = data.map(dbCard => ({
        id: dbCard.id,
        name: dbCard.name,
        whatItDoes: dbCard.what_it_does,
        whoItsFor: dbCard.who_its_for,
        difficulty: dbCard.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        steps: dbCard.steps || [],
        examplePrompts: dbCard.example_prompts || [],
        exampleInAction: dbCard.example_in_action || '',
        promptTemplate: dbCard.prompt_template || '',
        perplexityChatLink: dbCard.perplexity_chat_link || '',
        tips: dbCard.tips || []
      }));

      setCards(transformedCards);
    } catch (error) {
      console.error('Error loading cards:', error);
      toast.error('Failed to load recipe cards');
    } finally {
      setLoading(false);
    }
  };

  // Save card to Supabase
  const saveCard = async (card: RecipeCard) => {
    try {
      // Transform RecipeCard to database format
      const dbCard = {
        id: card.id || undefined,
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

      if (card.id && cards.find(c => c.id === card.id)) {
        // Update existing card
        const { error } = await supabase
          .from('recipe_cards')
          .update(dbCard)
          .eq('id', card.id);

        if (error) {
          console.error('Error updating card:', error);
          toast.error('Failed to update recipe card');
          return false;
        }
        toast.success('Recipe card updated successfully!');
      } else {
        // Insert new card
        const { data, error } = await supabase
          .from('recipe_cards')
          .insert([dbCard])
          .select()
          .single();

        if (error) {
          console.error('Error creating card:', error);
          toast.error('Failed to create recipe card');
          return false;
        }
        toast.success('Recipe card created successfully!');
      }

      // Reload cards to get updated data
      await loadCards();
      return true;
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save recipe card');
      return false;
    }
  };

  // Delete card from Supabase
  const deleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('recipe_cards')
        .delete()
        .eq('id', cardId);

      if (error) {
        console.error('Error deleting card:', error);
        toast.error('Failed to delete recipe card');
        return false;
      }

      toast.success('Recipe card deleted successfully!');
      await loadCards();
      return true;
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete recipe card');
      return false;
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  return {
    cards,
    loading,
    saveCard,
    deleteCard,
    reloadCards: loadCards
  };
};
