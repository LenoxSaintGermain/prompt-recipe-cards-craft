import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Input validation schema
const improveSchema = z.object({
  cardData: z.object({
    name: z.string().max(500).optional(),
    what_it_does: z.string().max(5000).optional(),
    who_its_for: z.string().max(2000).optional(),
    difficulty: z.string().max(50).optional(),
    steps: z.array(z.string().max(1000)).max(20).optional(),
    example_prompts: z.array(z.object({
      title: z.string().max(200),
      prompt: z.string().max(5000)
    })).max(10).optional(),
    tips: z.array(z.string().max(500)).max(20).optional(),
    prompt_template: z.string().max(10000).optional(),
    example_in_action: z.string().max(5000).optional()
  }),
  provider: z.enum(['gemini', 'claude']).default('gemini')
});

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

    const validationResult = improveSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { cardData, provider } = validationResult.data;

    const prompt = `Please improve this prompt recipe card by making the content clearer, more actionable, and better structured. Return only the improved content in the same JSON structure:

${JSON.stringify(cardData, null, 2)}

Focus on:
1. Making the "What it does" section more clear and compelling
2. Improving the step-by-step instructions for clarity
3. Enhancing the example prompts to be more specific and useful
4. Adding practical tips that would help users succeed
5. Ensuring the prompt template is well-structured

Return the improved version maintaining the exact same JSON structure.`;

    let generatedText = '';

    // Create abort controller for timeout
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
      } else if (provider === 'claude') {
        const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');
        if (!claudeApiKey) {
          throw new Error('Claude API key not configured');
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': claudeApiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 4000,
            messages: [{
              role: 'user',
              content: prompt
            }]
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Claude API error: ${response.statusText}`);
        }

        const data = await response.json();
        generatedText = data.content?.[0]?.text || '';
      }
    } finally {
      clearTimeout(timeoutId);
    }

    // Try to parse the improved card from the response
    let improvedCard = cardData;
    try {
      // Extract JSON from the response (it might have markdown formatting)
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        improvedCard = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // If parsing fails, return original card
    }

    return new Response(JSON.stringify({ improvedCard }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in improve-recipe-card function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
