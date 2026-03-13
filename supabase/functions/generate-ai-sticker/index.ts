import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating AI sticker with prompt:', prompt);

    const ONSPACE_AI_API_KEY = Deno.env.get('ONSPACE_AI_API_KEY');
    const ONSPACE_AI_BASE_URL = Deno.env.get('ONSPACE_AI_BASE_URL');

    if (!ONSPACE_AI_API_KEY || !ONSPACE_AI_BASE_URL) {
      console.error('Missing AI config - API_KEY:', !!ONSPACE_AI_API_KEY, 'BASE_URL:', !!ONSPACE_AI_BASE_URL);
      return new Response(
        JSON.stringify({ error: 'OnSpace AI service is not configured. Please contact support.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Using AI endpoint:', ONSPACE_AI_BASE_URL);

    // Enhanced prompt for better character and person generation
    const enhancedPrompt = `Create a vibrant, high-quality sticker artwork of: ${prompt}

🎨 STICKER DESIGN REQUIREMENTS:
✓ Style: Kawaii/chibi art style with big expressive eyes and cute proportions
✓ Character Details: If it's a person or character, make them instantly recognizable with their iconic features, clothing, and accessories
✓ Colors: Ultra vibrant, saturated colors that pop - use bold, eye-catching color combinations
✓ Outlines: Thick black outlines (3-4px) around all elements for that professional sticker look
✓ Composition: Centered character with white border space, works perfectly in a circular sticker format
✓ Background: Simple gradient or solid color that makes the character stand out
✓ Details: Sharp, crisp details with smooth gradients and professional shading
✓ Quality: Print-ready quality at high resolution
✓ NO TEXT: Do not include any text or words in the image
✓ Expression: Happy, friendly, and appealing facial expression

💡 IMPORTANT: If this is a famous person, celebrity, anime character, movie character, or anyone recognizable:
- Capture their most iconic and distinctive features accurately
- Include their signature hairstyle, clothing, accessories, or props
- Make them instantly identifiable while maintaining the cute sticker art style
- Use their typical color scheme and visual identity

Create an adorable, professional-quality sticker that fans and collectors will love!`;

    // Call OnSpace AI with image generation model
    const requestBody = {
      model: 'google/gemini-2.5-flash-image-preview',
      messages: [
        {
          role: 'user',
          content: enhancedPrompt
        }
      ],
      modalities: ['image', 'text'],
      image_config: {
        aspect_ratio: '1:1'
      },
    };

    console.log('Sending request to AI service...');

    const response = await fetch(`${ONSPACE_AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ONSPACE_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OnSpace AI Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });

      let errorMessage = errorText || 'Unknown error';
      
      if (response.status === 402) {
        errorMessage = 'AI service quota limit reached. This feature requires OnSpace AI credits. Please try again later or contact support at instagram.com/stickercraft_official';
      } else if (response.status === 401) {
        errorMessage = 'AI service authentication failed. Please contact support.';
      } else if (response.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      }

      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          status: response.status,
          details: errorText 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI Response received successfully');
    console.log('Response structure:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      hasImages: !!data.choices?.[0]?.message?.images,
      imagesLength: data.choices?.[0]?.message?.images?.length
    });

    // Extract the image from the response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const description = data.choices?.[0]?.message?.content;

    if (!imageUrl) {
      console.error('No image URL in response:', JSON.stringify(data, null, 2));
      return new Response(
        JSON.stringify({ 
          error: 'AI service did not generate an image. Please try a different prompt or try again later.',
          details: 'No image URL found in AI response'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Image generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl,
        description,
        prompt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Edge Function Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred while generating your sticker. Please try again.',
        details: error.message || 'Unknown error',
        type: error.name
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
