
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { templates, provider = 'gemini' } = await req.json();

    const enhancedCards = [];
    
    for (const template of templates) {
      const prompt = `Based on this recipe card template, generate missing content for a Perplexity Enterprise prompt recipe:

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
        });

        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
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
            difficulty: mapDifficultyLevel(template.difficulty_level) || 'Beginner',
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

    function mapDifficultyLevel(level) {
      if (!level) return 'Beginner';
      const normalized = level.toLowerCase();
      if (normalized.includes('advanced')) return 'Advanced';
      if (normalized.includes('intermediate')) return 'Intermediate';
      return 'Beginner';
    }

    return new Response(JSON.stringify({ enhancedCards }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in batch-enhance-cards function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
