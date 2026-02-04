-- Add user_id column to recipe_cards (nullable for existing data)
ALTER TABLE public.recipe_cards ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to collections
ALTER TABLE public.collections ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to import_jobs
ALTER TABLE public.import_jobs ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing overly permissive policies on recipe_cards
DROP POLICY IF EXISTS "Allow all operations on recipe_cards" ON public.recipe_cards;

-- Drop existing overly permissive policies on collections
DROP POLICY IF EXISTS "Allow public delete access to collections" ON public.collections;
DROP POLICY IF EXISTS "Allow public insert access to collections" ON public.collections;
DROP POLICY IF EXISTS "Allow public read access to collections" ON public.collections;
DROP POLICY IF EXISTS "Allow public update access to collections" ON public.collections;

-- Drop existing overly permissive policies on card_collections
DROP POLICY IF EXISTS "Allow public delete access to card_collections" ON public.card_collections;
DROP POLICY IF EXISTS "Allow public insert access to card_collections" ON public.card_collections;
DROP POLICY IF EXISTS "Allow public read access to card_collections" ON public.card_collections;

-- Drop existing overly permissive policies on import_jobs
DROP POLICY IF EXISTS "Allow public insert access to import_jobs" ON public.import_jobs;
DROP POLICY IF EXISTS "Allow public read access to import_jobs" ON public.import_jobs;
DROP POLICY IF EXISTS "Allow public update access to import_jobs" ON public.import_jobs;

-- Create secure RLS policies for recipe_cards (public read, private write)
CREATE POLICY "Anyone can view recipe cards"
ON public.recipe_cards FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create their own cards"
ON public.recipe_cards FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
ON public.recipe_cards FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
ON public.recipe_cards FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create secure RLS policies for collections (public read, private write)
CREATE POLICY "Anyone can view collections"
ON public.collections FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create their own collections"
ON public.collections FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
ON public.collections FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
ON public.collections FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create secure RLS policies for card_collections
-- Allow reading card_collections for cards/collections user can see
CREATE POLICY "Anyone can view card_collections"
ON public.card_collections FOR SELECT
USING (true);

-- Allow inserting card_collections if user owns both the card and collection
CREATE POLICY "Authenticated users can link their cards to collections"
ON public.card_collections FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.recipe_cards 
    WHERE id = card_id AND user_id = auth.uid()
  )
  AND 
  EXISTS (
    SELECT 1 FROM public.collections 
    WHERE id = collection_id AND user_id = auth.uid()
  )
);

-- Allow deleting card_collections if user owns the collection
CREATE POLICY "Users can unlink cards from their collections"
ON public.card_collections FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.collections 
    WHERE id = collection_id AND user_id = auth.uid()
  )
);

-- Create secure RLS policies for import_jobs (private only)
CREATE POLICY "Users can view their own import jobs"
ON public.import_jobs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own import jobs"
ON public.import_jobs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own import jobs"
ON public.import_jobs FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own import jobs"
ON public.import_jobs FOR DELETE
TO authenticated
USING (auth.uid() = user_id);