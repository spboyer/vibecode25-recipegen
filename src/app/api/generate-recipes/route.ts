import { AzureOpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Create Azure OpenAI client
const client = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_KEY!,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION!,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
});

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();    const prompt = `Generate 3-5 recipes using some or all of these ingredients: ${ingredients.join(', ')}. 
    Respond with ONLY a JSON array. No markdown, no explanations, just the raw JSON array.
    Each recipe should be a JSON object with: name (string), ingredients (array of strings), and instructions (array of strings).
    Example format:
    [{"name": "Recipe Name", "ingredients": ["ingredient 1", "ingredient 2"], "instructions": ["step 1", "step 2"]}]`;console.log('Making API call with config:', {
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION
    });    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful cooking assistant that provides recipe suggestions based on available ingredients. Always respond with a valid JSON array containing recipe objects. Never include markdown formatting or explanatory text." },
        { role: "user", content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 1,
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!
    });    const content = response.choices[0].message.content || '[]';
    
    // Try to extract JSON if it's wrapped in markdown code blocks
    // Using [\s\S] instead of . to match newlines in a cross-browser way
    const jsonMatch = content.match(/\[([\s\S]*)\]/);
    const jsonString = jsonMatch ? `[${jsonMatch[1]}]` : content;

    try {
      const recipes = JSON.parse(jsonString);
      if (!Array.isArray(recipes)) {
        throw new Error('Response is not an array');
      }
      return NextResponse.json(recipes);
    } catch (parseError) {
      console.error('Failed to parse API response:', {
        content,
        error: parseError
      });
      return NextResponse.json(
        { error: 'Failed to parse recipe data' },
        { status: 500 }
      );
    }} catch (err) {
    const error = err as {
      response?: {
        status: number;
        data: any;
        headers: any;
      };
      request?: any;
      message: string;
    };
    console.error('Error generating recipes:', {
      error,
      config: {
        endpoint: process.env.AZURE_OPENAI_ENDPOINT,
        deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
        apiVersion: process.env.AZURE_OPENAI_API_VERSION
      }
    });

    if (error.response) {
      // The API call was made but the API returned an error
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      return NextResponse.json(
        { error: `API Error: ${error.response.data?.error?.message || 'Unknown API error'}` },
        { status: error.response.status }
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
      return NextResponse.json(
        { error: 'Network error - no response received from API' },
        { status: 503 }
      );
    } else {
      // Something happened in setting up the request
      console.error('Setup Error:', error.message);
      return NextResponse.json(
        { error: `Configuration error: ${error.message}` },
        { status: 500 }
      );
    }
  }
}
