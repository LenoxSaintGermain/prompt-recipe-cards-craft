
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generateWithAI } from '@/services/aiService';

export interface ImportJob {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_cards: number;
  processed_cards: number;
  failed_cards: number;
  error_log?: string;
}

export interface CardTemplate {
  name: string;
  target_departments?: string[];
  primary_llm_skill?: string;
  difficulty_level?: string;
  gfs_value_rating?: number;
  what_it_does?: string;
  who_its_for?: string;
  steps?: string[];
  example_prompts?: { title: string; prompt: string }[];
  tips?: string[];
  prompt_template?: string;
}

export const useJsonImport = () => {
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [loading, setLoading] = useState(false);

  const createImportJob = async (name: string, templates: CardTemplate[]) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('import_jobs')
        .insert([{
          name,
          total_cards: templates.length,
          raw_data: templates,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Import job created! Processing will begin shortly.');
      return data;
    } catch (error) {
      console.error('Error creating import job:', error);
      toast.error('Failed to create import job.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const processImportJob = async (jobId: string) => {
    try {
      // Update job status to processing
      await supabase
        .from('import_jobs')
        .update({ status: 'processing' })
        .eq('id', jobId);

      // Get job data
      const { data: job, error: jobError } = await supabase
        .from('import_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobError) throw jobError;

      const templates = job.raw_data as CardTemplate[];
      let processedCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (const template of templates) {
        try {
          const enhancedCard = await enhanceCardWithAI(template);
          
          const { error: insertError } = await supabase
            .from('recipe_cards')
            .insert([enhancedCard]);

          if (insertError) {
            failedCount++;
            errors.push(`${template.name}: ${insertError.message}`);
          } else {
            processedCount++;
          }

          // Update progress
          await supabase
            .from('import_jobs')
            .update({
              processed_cards: processedCount,
              failed_cards: failedCount
            })
            .eq('id', jobId);

        } catch (error) {
          failedCount++;
          errors.push(`${template.name}: ${error}`);
        }
      }

      // Update final status
      await supabase
        .from('import_jobs')
        .update({
          status: failedCount === 0 ? 'completed' : 'failed',
          error_log: errors.length > 0 ? errors.join('\n') : null
        })
        .eq('id', jobId);

      toast.success(`Import completed! ${processedCount} cards created, ${failedCount} failed.`);
      return true;

    } catch (error) {
      console.error('Error processing import job:', error);
      await supabase
        .from('import_jobs')
        .update({ status: 'failed', error_log: error.message })
        .eq('id', jobId);
      
      toast.error('Import job failed.');
      return false;
    }
  };

  const enhanceCardWithAI = async (template: CardTemplate): Promise<any> => {
    const prompt = `Based on this recipe card template, generate missing content for a Perplexity Enterprise prompt recipe:

Template: ${JSON.stringify(template, null, 2)}

Please provide:
1. A clear "what it does" description if missing
2. Target audience ("who it's for") if missing
3. Step-by-step instructions if missing
4. 2-3 example prompts if missing
5. 3-5 practical tips if missing
6. A well-structured prompt template if missing

Return only valid JSON in this format:
{
  "name": "...",
  "what_it_does": "...",
  "who_its_for": "...",
  "difficulty": "Beginner|Intermediate|Advanced",
  "steps": ["step1", "step2", ...],
  "example_prompts": [{"title": "...", "prompt": "..."}],
  "tips": ["tip1", "tip2", ...],
  "prompt_template": "...",
  "department": ["dept1", "dept2", ...],
  "tags": ["tag1", "tag2", ...]
}`;

    try {
      const aiResponse = await generateWithAI(prompt);
      const enhancedData = JSON.parse(aiResponse);

      return {
        name: template.name,
        what_it_does: enhancedData.what_it_does || template.what_it_does || '',
        who_its_for: enhancedData.who_its_for || template.who_its_for || '',
        difficulty: enhancedData.difficulty || mapDifficultyLevel(template.difficulty_level) || 'Beginner',
        steps: enhancedData.steps || template.steps || [],
        example_prompts: enhancedData.example_prompts || template.example_prompts || [],
        tips: enhancedData.tips || template.tips || [],
        prompt_template: enhancedData.prompt_template || template.prompt_template || '',
        department: enhancedData.department || template.target_departments || [],
        tags: enhancedData.tags || [template.primary_llm_skill].filter(Boolean) || []
      };
    } catch (error) {
      console.error('AI enhancement failed, using template data:', error);
      // Fallback to template data with basic enhancements
      return {
        name: template.name,
        what_it_does: template.what_it_does || `A ${template.primary_llm_skill?.toLowerCase()} tool for ${template.target_departments?.join(', ') || 'various departments'}`,
        who_its_for: template.who_its_for || template.target_departments?.join(', ') || 'All users',
        difficulty: mapDifficultyLevel(template.difficulty_level) || 'Beginner',
        steps: template.steps || ['Define your objective', 'Craft your prompt', 'Review and refine'],
        example_prompts: template.example_prompts || [],
        tips: template.tips || ['Be specific in your requests', 'Provide context', 'Iterate for best results'],
        prompt_template: template.prompt_template || '',
        department: template.target_departments || [],
        tags: [template.primary_llm_skill].filter(Boolean) || []
      };
    }
  };

  const mapDifficultyLevel = (level?: string): 'Beginner' | 'Intermediate' | 'Advanced' => {
    if (!level) return 'Beginner';
    const normalized = level.toLowerCase();
    if (normalized.includes('advanced')) return 'Advanced';
    if (normalized.includes('intermediate')) return 'Intermediate';
    return 'Beginner';
  };

  const loadImportJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('import_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImportJobs(data || []);
    } catch (error) {
      console.error('Error loading import jobs:', error);
    }
  };

  return {
    importJobs,
    loading,
    createImportJob,
    processImportJob,
    loadImportJobs
  };
};
