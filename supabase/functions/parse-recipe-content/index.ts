import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Input validation schema
const parseSchema = z.object({
  content: z.string().min(10, 'Content too short').max(100000, 'Content exceeds 100KB'),
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

    const validationResult = parseSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { content, provider } = validationResult.data;

    console.log('Parsing content with provider:', provider);
    console.log('Content length:', content.length);

    // Enhanced prompt to detect and parse multiple recipe cards
    const prompt = `Analyze the following content and extract information to create one or more prompt recipe cards. The content may contain multiple recipe cards separated by sections, headings, or dividers.

Look for patterns that indicate multiple recipe cards such as:
- "Prompt Recipe Card:" followed by content
- "Recipe Card:" followed by content  
- Section breaks with "---" or similar dividers
- Multiple distinct workflows or procedures
- Different titles/names for different procedures

If you find multiple recipe cards, return them as an array. If only one card is found, return it as a single-item array.

Return the response as a JSON object with this structure:
{
  "cards": [
    {
      "name": "Brief, descriptive title for the recipe",
      "what_it_does": "Clear explanation of what this prompt accomplishes",
      "who_its_for": "Target audience and roles who would benefit",
      "difficulty": "Beginner, Intermediate, or Advanced",
      "steps": ["Step 1 description", "Step 2 description", ...],
      "example_prompts": [
        {"title": "Example 1 name", "prompt": "Full example prompt text"},
        {"title": "Example 2 name", "prompt": "Full example prompt text"}
      ],
      "example_in_action": "Description of what the output looks like",
      "prompt_template": "Template with placeholders like [input] that users can customize",
      "tips": ["Tip 1", "Tip 2", ...]
    }
  ]
}

Content to analyze:
${content}

Focus on creating practical, actionable instructions and realistic examples. Make sure the difficulty level matches the complexity of the task. If the content contains workflow outlines or training materials, extract the individual recipe cards from within those materials.`;

    let generatedText = '';

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      if (provider === 'gemini') {
        const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
        if (!geminiApiKey) {
          throw new Error('Gemini API key not configured. Please add GEMINI_API_KEY to your Supabase secrets.');
        }

        console.log('Using Gemini API');

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

        console.log('Gemini API response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Gemini API error response:', errorText);
          throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Gemini API response received');
        generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } else if (provider === 'claude') {
        const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');
        if (!claudeApiKey) {
          throw new Error('Claude API key not configured. Please add CLAUDE_API_KEY to your Supabase secrets.');
        }

        console.log('Using Claude API');

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
          const errorText = await response.text();
          console.error('Claude API error response:', errorText);
          throw new Error(`Claude API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Claude API response received');
        generatedText = data.content?.[0]?.text || '';
      }
    } finally {
      clearTimeout(timeoutId);
    }

    console.log('Generated text length:', generatedText?.length);

    // Parse the JSON response from AI
    let parsedData = {};
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
        console.log('Successfully parsed JSON data');
      } else {
        console.log('No JSON found in response, attempting direct parse');
        parsedData = JSON.parse(generatedText);
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse AI response');
    }

    return new Response(JSON.stringify({ parsedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in parse-recipe-content function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process request'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
