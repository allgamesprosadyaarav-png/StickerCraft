import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');
    const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');

    if (!baseUrl || !apiKey) {
      throw new Error('AI service not configured');
    }

    // System prompt for Angela
    const systemPrompt = `You are Angela, the friendly AI assistant for StickerCraft - an e-commerce platform for custom stickers and keychains. 

Key Information:
- Products: Anime stickers (₹25), Standard stickers (₹10), AI stickers (₹15), Keychains (₹110), Premium stickers (₹35), Premium keychains (₹150)
- Premium Subscription: ₹99/month - includes exclusive products, quick delivery (3-5 days), discounts
- Features: AI sticker generation, custom design, Lucky Spin (2/month), Scratch Cards (2/month), Mystery Boxes, Personality Quiz
- Loyalty: Earn 5 points per ₹1 spent, redeem for rewards
- Shipping: Standard 5-7 days, Premium 3-5 days, Free shipping over ₹500
- Payment: Credit/Debit cards, UPI
- Instagram: @stickercraft_official for customer support

Be friendly, helpful, and enthusiastic! Use emojis sparingly. Keep responses concise but informative. If asked complex questions about orders or account-specific info, guide them to contact Instagram support.`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error Response:', errorText, 'Status:', response.status);
      throw new Error(`AI API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Angela AI Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
