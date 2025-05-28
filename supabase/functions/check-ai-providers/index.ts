
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
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');

    const providers = [
      {
        name: 'gemini',
        displayName: 'Google Gemini',
        available: !!geminiApiKey
      },
      {
        name: 'claude',
        displayName: 'Anthropic Claude',
        available: !!claudeApiKey
      }
    ];

    return new Response(JSON.stringify({ providers }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error checking AI providers:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
