export interface DietaryPreference {
  id: string;
  label: string;
  description: string;
}

export const DIETARY_PREFERENCES: DietaryPreference[] = [
  {
    id: 'glutenFree',
    label: 'Gluten Free',
    description: 'Excludes wheat, barley, rye, and their derivatives'
  },
  {
    id: 'dairyFree',
    label: 'Dairy Free',
    description: 'No milk, cheese, butter, or dairy products'
  },
  {
    id: 'keto',
    label: 'Keto',
    description: 'High-fat, low-carb diet'
  },
  {
    id: 'vegan',
    label: 'Vegan',
    description: 'No animal products'
  },
  {
    id: 'vegetarian',
    label: 'Vegetarian',
    description: 'No meat or fish'
  },
  {
    id: 'paleo',
    label: 'Paleo',
    description: 'Based on foods available to our prehistoric ancestors'
  }
];

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  dietaryRestrictions?: string[]; // IDs of the dietary restrictions the recipe meets
}
