import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Input validation schema
const batchSchema = z.object({
  templates: z.array(z.object({
    name: z.string().max(500),
    what_it_does: z.string().max(5000).optional(),
    who_its_for: z.string().max(2000).optional(),
    difficulty_level: z.string().max(50).optional(),
    primary_llm_skill: z.string().max(100).optional(),
    target_departments: z.array(z.string()).max(20).optional(),
    steps: z.array(z.string()).max(20).optional(),
    example_prompts: z.array(z.any()).max(10).optional(),
    tips: z.array(z.string()).max(20).optional(),
    prompt_template: z.string().max(10000).optional()
  })).min(1, 'At least one template required').max(50, 'Maximum 50 cards per batch'),
  provider: z.enum(['gemini', 'claude']).default('gemini')
});

function mapDifficultyLevel(level: string | undefined): string {
  if (!level) return 'Beginner';
  const normalized = level.toLowerCase();
  if (normalized.includes('advanced')) return 'Advanced';
  if (normalized.includes('intermediate')) return 'Intermediate';
  return 'Beginner';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !data?.claims) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate input
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validationResult = batchSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { templates, provider } = validationResult.data;
    const enhancedCards = [];
    
    for (const template of templates) {
      const prompt = `Based on this recipe card template, generate missing content for a prompt pattern:

Template: ${JSON.stringify(template, null, 2)}

Please provide a complete recipe card with:
1. A clear "what it does" description
2. Target audience ("who it's for")
3. Step-by-step instructions (3-5 steps)
4. 2-3 example prompts with titles
5. 3-5 practical tips
6. A well-structured prompt template

Return only valid JSON in this exact format:
{
  "name": "${template.name}",
  "what_it_does": "...",
  "who_its_for": "...",
  "difficulty": "Beginner|Intermediate|Advanced",
  "steps": ["step1", "step2", "step3"],
  "example_prompts": [{"title": "Example 1", "prompt": "..."}],
  "tips": ["tip1", "tip2", "tip3"],
  "prompt_template": "...",
  "department": ["dept1", "dept2"],
  "tags": ["tag1", "tag2"]
}`;

      let generatedText = '';

      // Create abort controller for timeout (per card)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        if (provider === 'gemini') {
          const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
          if (!geminiApiKey) {
            throw new Error('Gemini API key not configured');
          }

          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: prompt }]
              }]
            }),
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`);
          }

          const data = await response.json();
          generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } finally {
        clearTimeout(timeoutId);
      }

      try {
        // Extract JSON from the response
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const enhancedCard = JSON.parse(jsonMatch[0]);
          enhancedCards.push(enhancedCard);
        } else {
          // Fallback enhancement
          enhancedCards.push({
            name: template.name,
            what_it_does: template.what_it_does || `A ${template.primary_llm_skill?.toLowerCase()} tool`,
            who_its_for: template.who_its_for || template.target_departments?.join(', ') || 'All users',
            difficulty: mapDifficultyLevel(template.difficulty_level),
            steps: template.steps || ['Define objective', 'Craft prompt', 'Review results'],
            example_prompts: template.example_prompts || [],
            tips: template.tips || ['Be specific', 'Provide context', 'Iterate'],
            prompt_template: template.prompt_template || '',
            department: template.target_departments || [],
            tags: [template.primary_llm_skill].filter(Boolean) || []
          });
        }
      } catch (parseError) {
        console.error('Failed to parse AI response for', template.name, parseError);
        // Add fallback card
        enhancedCards.push({
          name: template.name,
          what_it_does: template.what_it_does || 'AI-powered tool',
          who_its_for: template.who_its_for || 'All users',
          difficulty: 'Beginner',
          steps: ['Step 1', 'Step 2', 'Step 3'],
          example_prompts: [],
          tips: ['Tip 1', 'Tip 2'],
          prompt_template: '',
          department: [],
          tags: []
        });
      }
    }

    return new Response(JSON.stringify({ enhancedCards }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in batch-enhance-cards function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
