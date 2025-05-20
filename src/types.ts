export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  dietaryRestrictions?: string[];
}

export interface DietaryPreference {
  id: string;
  label: string;
  description: string;
}

export interface ToastProps {
  id?: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export type ThemeMode = 'light' | 'dark' | 'hotdog';
