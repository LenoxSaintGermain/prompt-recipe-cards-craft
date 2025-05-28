
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
    const { content, provider = 'gemini' } = await req.json();

    console.log('Parsing content with provider:', provider);
    console.log('Content length:', content?.length);

    const prompt = `Analyze the following content and extract information to create a prompt recipe card. Return the response as a JSON object with the following structure:

{
  "name": "Brief, descriptive title for the recipe",
  "whatItDoes": "Clear explanation of what this prompt accomplishes",
  "whoItsFor": "Target audience and roles who would benefit",
  "difficulty": "Beginner, Intermediate, or Advanced",
  "steps": ["Step 1 description", "Step 2 description", ...],
  "examplePrompts": [
    {"title": "Example 1 name", "prompt": "Full example prompt text"},
    {"title": "Example 2 name", "prompt": "Full example prompt text"}
  ],
  "exampleInAction": "Description of what the output looks like",
  "promptTemplate": "Template with placeholders like [input] that users can customize",
  "tips": ["Tip 1", "Tip 2", ...]
}

Content to analyze:
${content}

Focus on creating practical, actionable instructions and realistic examples. Make sure the difficulty level matches the complexity of the task.`;

    let generatedText = '';

    if (provider === 'gemini') {
      const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
      if (!geminiApiKey) {
        throw new Error('Gemini API key not configured. Please add GEMINI_API_KEY to your Supabase secrets.');
      }

      console.log('Using Gemini API with key present:', !!geminiApiKey);

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

      console.log('Gemini API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini API response received');
      generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else if (provider === 'claude') {
      const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');
      if (!claudeApiKey) {
        throw new Error('Claude API key not configured. Please add CLAUDE_API_KEY to your Supabase secrets.');
      }

      console.log('Using Claude API with key present:', !!claudeApiKey);

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
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claude API error response:', errorText);
        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Claude API response received');
      generatedText = data.content?.[0]?.text || '';
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
      console.log('Raw AI response:', generatedText);
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }

    return new Response(JSON.stringify({ parsedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in parse-recipe-content function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Check edge function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
