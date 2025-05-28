
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
    const { field, currentValue, context, provider = 'gemini' } = await req.json();

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

    if (provider === 'gemini') {
      const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
      if (!geminiApiKey) {
        throw new Error('Gemini API key not configured');
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
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
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const data = await response.json();
      generatedText = data.content?.[0]?.text || '';
    }

    return new Response(JSON.stringify({ suggestion: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in recipe-assistant function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
