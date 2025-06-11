
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { withRetry, isNetworkError } from '@/utils/retryUtils';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  card_count?: number;
}

export const useCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCollections = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await withRetry(
        async () => {
          const { data, error } = await supabase
            .from('collections')
            .select(`
              *,
              card_collections(count)
            `)
            .order('created_at', { ascending: false });

          if (error) throw error;
          return data;
        },
        { maxAttempts: 3, delayMs: 1000 }
      );

      const collectionsWithCount = result.map(collection => ({
        ...collection,
        card_count: collection.card_collections?.length || 0
      }));

      setCollections(collectionsWithCount);
    } catch (error) {
      console.error('Error loading collections:', error);
      const errorMessage = isNetworkError(error)
        ? 'Connection failed. Please check your internet connection.'
        : 'Failed to load collections.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async (name: string, description?: string) => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .insert([{ name, description }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Collection created successfully!');
      await loadCollections();
      return data;
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection.');
      return null;
    }
  };

  const deleteCollection = async (collectionId: string) => {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collectionId);

      if (error) throw error;

      toast.success('Collection deleted successfully!');
      await loadCollections();
      return true;
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection.');
      return false;
    }
  };

  const addCardsToCollection = async (collectionId: string, cardIds: string[]) => {
    try {
      const insertData = cardIds.map(cardId => ({
        collection_id: collectionId,
        card_id: cardId
      }));

      const { error } = await supabase
        .from('card_collections')
        .insert(insertData);

      if (error) throw error;

      toast.success(`${cardIds.length} cards added to collection!`);
      await loadCollections();
      return true;
    } catch (error) {
      console.error('Error adding cards to collection:', error);
      toast.error('Failed to add cards to collection.');
      return false;
    }
  };

  const removeCardsFromCollection = async (collectionId: string, cardIds: string[]) => {
    try {
      const { error } = await supabase
        .from('card_collections')
        .delete()
        .eq('collection_id', collectionId)
        .in('card_id', cardIds);

      if (error) throw error;

      toast.success(`${cardIds.length} cards removed from collection!`);
      await loadCollections();
      return true;
    } catch (error) {
      console.error('Error removing cards from collection:', error);
      toast.error('Failed to remove cards from collection.');
      return false;
    }
  };

  const exportCollection = async (collectionId: string) => {
    try {
      const { data: collectionData, error: collectionError } = await supabase
        .from('collections')
        .select('*')
        .eq('id', collectionId)
        .single();

      if (collectionError) throw collectionError;

      const { data: cardsData, error: cardsError } = await supabase
        .from('recipe_cards')
        .select('*')
        .in('id', 
          await supabase
            .from('card_collections')
            .select('card_id')
            .eq('collection_id', collectionId)
            .then(({ data }) => data?.map(item => item.card_id) || [])
        );

      if (cardsError) throw cardsError;

      const exportData = {
        collection: collectionData,
        cards: cardsData,
        exported_at: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${collectionData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_collection.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Collection exported successfully!');
      return true;
    } catch (error) {
      console.error('Error exporting collection:', error);
      toast.error('Failed to export collection.');
      return false;
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  return {
    collections,
    loading,
    error,
    createCollection,
    deleteCollection,
    addCardsToCollection,
    removeCardsFromCollection,
    exportCollection,
    reloadCollections: loadCollections
  };
};
