
-- Create collections table for grouping recipe cards
CREATE TABLE public.collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for many-to-many relationship between cards and collections
CREATE TABLE public.card_collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.recipe_cards(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(card_id, collection_id)
);

-- Create import jobs table to track AI enhancement progress
CREATE TABLE public.import_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_cards INTEGER NOT NULL DEFAULT 0,
  processed_cards INTEGER NOT NULL DEFAULT 0,
  failed_cards INTEGER NOT NULL DEFAULT 0,
  raw_data JSONB,
  error_log TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add tags and department fields to recipe_cards for better organization
ALTER TABLE public.recipe_cards 
ADD COLUMN tags TEXT[] DEFAULT '{}',
ADD COLUMN department TEXT[] DEFAULT '{}';

-- Create triggers for updated_at columns
CREATE TRIGGER update_collections_updated_at 
  BEFORE UPDATE ON public.collections 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_import_jobs_updated_at 
  BEFORE UPDATE ON public.import_jobs 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_card_collections_card_id ON public.card_collections(card_id);
CREATE INDEX idx_card_collections_collection_id ON public.card_collections(collection_id);
CREATE INDEX idx_recipe_cards_tags ON public.recipe_cards USING GIN(tags);
CREATE INDEX idx_recipe_cards_department ON public.recipe_cards USING GIN(department);
CREATE INDEX idx_import_jobs_status ON public.import_jobs(status);
