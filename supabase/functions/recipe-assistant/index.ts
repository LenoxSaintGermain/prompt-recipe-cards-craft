import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Input validation schema
const assistantSchema = z.object({
  field: z.enum(['name', 'whatItDoes', 'whoItsFor', 'steps', 'examplePrompts', 'tips']),
  currentValue: z.string().max(10000).optional().default(''),
  context: z.object({
    whatItDoes: z.string().max(5000).optional()
  }).optional().default({}),
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

    const validationResult = assistantSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { field, currentValue, context, provider } = validationResult.data;

    let prompt = '';
    
    switch (field) {
      case 'name':
        prompt = `Suggest 3 concise, descriptive names for a prompt recipe based on this context: ${context.whatItDoes || 'No description provided'}. Each name should be 2-6 words and clearly indicate the task. Return as JSON array: ["Name 1", "Name 2", "Name 3"]`;
        break;
      case 'whatItDoes':
        prompt = `Improve this "what it does" description for a prompt recipe: "${currentValue}". Make it clearer and more compelling. Focus on the outcome and value. Return just the improved text.`;
        break;
      case 'whoItsFor':
        prompt = `Based on this recipe description: "${context.whatItDoes}", suggest who would benefit from this prompt recipe. Include specific roles and use cases. Return just the improved text.`;
        break;
      case 'steps':
        prompt = `Generate 4-6 clear, actionable steps for creating this prompt recipe: "${context.whatItDoes}". Each step should be specific and easy to follow. Return as JSON array: ["Step 1", "Step 2", ...]`;
        break;
      case 'examplePrompts':
        prompt = `Create 2 example prompts for this recipe: "${context.whatItDoes}". Include titles and full prompt text. Return as JSON: [{"title": "Example name", "prompt": "Full prompt text"}, ...]`;
        break;
      case 'tips':
        prompt = `Suggest 4-6 practical tips for getting better results with this prompt recipe: "${context.whatItDoes}". Focus on actionable advice. Return as JSON array: ["Tip 1", "Tip 2", ...]`;
        break;
      default:
        prompt = `Provide suggestions for improving this content: "${currentValue}" in the context of: ${context.whatItDoes}`;
    }

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
            max_tokens: 2000,
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

    return new Response(JSON.stringify({ suggestion: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in recipe-assistant function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
