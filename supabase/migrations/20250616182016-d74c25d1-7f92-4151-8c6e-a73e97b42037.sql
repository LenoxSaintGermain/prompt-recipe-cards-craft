
-- Enable Row Level Security on all three tables
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;

-- Create public access policies for collections table
CREATE POLICY "Allow public read access to collections" 
  ON public.collections 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to collections" 
  ON public.collections 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update access to collections" 
  ON public.collections 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete access to collections" 
  ON public.collections 
  FOR DELETE 
  USING (true);

-- Create public access policies for card_collections table
CREATE POLICY "Allow public read access to card_collections" 
  ON public.card_collections 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to card_collections" 
  ON public.card_collections 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to card_collections" 
  ON public.card_collections 
  FOR DELETE 
  USING (true);

-- Create public access policies for import_jobs table
CREATE POLICY "Allow public read access to import_jobs" 
  ON public.import_jobs 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to import_jobs" 
  ON public.import_jobs 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update access to import_jobs" 
  ON public.import_jobs 
  FOR UPDATE 
  USING (true);
