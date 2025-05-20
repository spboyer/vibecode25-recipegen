import { AzureOpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Create Azure OpenAI client
const client = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_KEY!,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION!,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
});

// Helper function to determine which dietary restrictions a recipe meets
function analyzeDietaryRestrictions(recipe: { name: string; ingredients: string[]; instructions: string[] }) {
  const restrictions: string[] = [];
  const ingredientsText = recipe.ingredients.join(' ').toLowerCase();
  const instructionsText = recipe.instructions.join(' ').toLowerCase();
  const fullText = `${ingredientsText} ${instructionsText}`;

  // Check for gluten-free
  if (!fullText.includes('wheat') && 
      !fullText.includes('barley') && 
      !fullText.includes('rye') && 
      !fullText.includes('flour') &&
      !fullText.includes('pasta') &&
      !fullText.includes('bread')) {
    restrictions.push('glutenFree');
  }

  // Check for dairy-free
  if (!fullText.includes('milk') && 
      !fullText.includes('cheese') && 
      !fullText.includes('butter') && 
      !fullText.includes('cream') &&
      !fullText.includes('yogurt')) {
    restrictions.push('dairyFree');
  }

  // Check for vegan
  if (!fullText.includes('meat') &&
      !fullText.includes('fish') &&
      !fullText.includes('egg') &&
      !fullText.includes('milk') &&
      !fullText.includes('cheese') &&
      !fullText.includes('butter') &&
      !fullText.includes('cream') &&
      !fullText.includes('honey')) {
    restrictions.push('vegan');
  }

  // Check for vegetarian (less strict than vegan)
  if (!fullText.includes('meat') &&
      !fullText.includes('fish') &&
      !fullText.includes('chicken') &&
      !fullText.includes('beef') &&
      !fullText.includes('pork')) {
    restrictions.push('vegetarian');
  }

  // Check for keto
  if (!fullText.includes('sugar') &&
      !fullText.includes('flour') &&
      !fullText.includes('bread') &&
      !fullText.includes('pasta') &&
      !fullText.includes('rice') &&
      !fullText.includes('potato')) {
    restrictions.push('keto');
  }

  // Check for paleo
  if (!fullText.includes('dairy') &&
      !fullText.includes('grain') &&
      !fullText.includes('sugar') &&
      !fullText.includes('processed') &&
      !fullText.includes('legume') &&
      !fullText.includes('peanut') &&
      !fullText.includes('bean') &&
      !fullText.includes('flour') &&
      !fullText.includes('bread') &&
      !fullText.includes('pasta') &&
      !fullText.includes('rice')) {
    restrictions.push('paleo');
  }

  return restrictions;
}

export async function POST(request: Request) {
  try {
    const { ingredients, dietaryPreferences } = await request.json();
    
    let dietaryContext = '';
    if (dietaryPreferences && dietaryPreferences.length > 0) {
      dietaryContext = `The recipes MUST follow these dietary requirements: ${dietaryPreferences.join(', ')}. 
      For example:
      - If gluten-free is selected, do not include any wheat, barley, rye, or their derivatives
      - If dairy-free is selected, exclude all milk products, cheese, butter, and dairy
      - If keto is selected, ensure recipes are high-fat, very low-carb
      - If vegan is selected, no animal products whatsoever
      - If vegetarian is selected, no meat or fish
      - If paleo is selected, only include foods consistent with a paleolithic diet\n\n`;
    }

    const prompt = `Generate 3-5 recipes using some or all of these ingredients: ${ingredients.join(', ')}. 
    ${dietaryContext}
    Respond with ONLY a JSON array. No markdown, no explanations, just the raw JSON array.
    Each recipe should be a JSON object with: name (string), ingredients (array of strings), and instructions (array of strings).
    Example format:
    [{"name": "Recipe Name", "ingredients": ["ingredient 1", "ingredient 2"], "instructions": ["step 1", "step 2"]}]`;

    console.log('Making API call with config:', {
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION,
      dietaryPreferences
    });

    const response = await client.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a helpful cooking assistant that provides recipe suggestions based on available ingredients and dietary requirements. Always respond with a valid JSON array containing recipe objects. Never include markdown formatting or explanatory text." 
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 1,
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!
    });

    const content = response.choices[0].message.content || '[]';
    
    // Try to extract JSON if it's wrapped in markdown code blocks
    const jsonMatch = content.match(/\[([\s\S]*)\]/);
    const jsonString = jsonMatch ? `[${jsonMatch[1]}]` : content;

    try {
      const recipes = JSON.parse(jsonString);
      if (!Array.isArray(recipes)) {
        throw new Error('Response is not an array');
      }

      // Analyze and add dietary restrictions to each recipe
      const recipesWithRestrictions = recipes.map(recipe => ({
        ...recipe,
        dietaryRestrictions: analyzeDietaryRestrictions(recipe)
      }));

      // If dietary preferences were specified, filter recipes that don't meet all requirements
      if (dietaryPreferences && dietaryPreferences.length > 0) {
        const filteredRecipes = recipesWithRestrictions.filter(recipe =>
          dietaryPreferences.every((pref: string) => recipe.dietaryRestrictions.includes(pref))
        );
        return NextResponse.json(filteredRecipes);
      }

      return NextResponse.json(recipesWithRestrictions);
    } catch (parseError) {
      console.error('Failed to parse API response:', {
        content,
        error: parseError
      });
      return NextResponse.json(
        { error: 'Failed to parse recipe data' },
        { status: 500 }
      );
    }
  } catch (err) {
    const error = err as {
      response?: {
        status: number;
        data: unknown;
        headers: Record<string, string>;
      };
      request?: unknown;
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
      const responseData = error.response.data as { error?: { message?: string } };
      return NextResponse.json(
        { error: `API Error: ${responseData?.error?.message || 'Unknown API error'}` },
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
