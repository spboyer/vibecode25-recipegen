import { FavoriteButton } from './FavoriteButton';
import { Recipe } from '@/types';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorited?: boolean;
  onFavoriteToggle?: (isFavorited: boolean) => void;
}

// Dietary restriction badge colors
const DIETARY_BADGE_COLORS = {
  glutenFree: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
  dairyFree: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  keto: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  vegan: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  vegetarian: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
  paleo: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
} as const;

// Dietary restriction labels
const DIETARY_LABELS = {
  glutenFree: 'GF',
  dairyFree: 'DF',
  keto: 'Keto',
  vegan: 'Vegan',
  vegetarian: 'Veg',
  paleo: 'Paleo',
} as const;

export default function RecipeCard({ recipe, isFavorited = false, onFavoriteToggle }: RecipeCardProps) {  return (
    <div className="bg-white dark:bg-gray-800 hotdog:bg-hotdog-yellow rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative">
      <FavoriteButton 
        recipe={recipe}
        isFavorited={isFavorited}
        onFavoriteToggle={onFavoriteToggle}
      />
      <div className="p-6 pb-16">
        {/* Recipe header with title and dietary badges */}
        <div className="recipe-card-header mb-6">          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 hotdog:text-hotdog-red border-b-2 border-yellow-400 dark:border-yellow-500 hotdog:border-hotdog-red pb-2 inline-block">
              {recipe.name}
            </h2>
            {recipe.dietaryRestrictions?.map((restriction) => (
              <span
                key={restriction}
                className={`px-2 py-1 rounded-full text-xs font-medium ${DIETARY_BADGE_COLORS[restriction as keyof typeof DIETARY_BADGE_COLORS]}`}
              >
                {DIETARY_LABELS[restriction as keyof typeof DIETARY_LABELS]}
              </span>
            ))}
          </div>
        </div>

        <div className="recipe-content">          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200 hotdog:text-black flex items-center">
              <span className="w-8 h-8 rounded-full bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center mr-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </span>
              Ingredients
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 hotdog:text-black pl-4">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 dark:bg-yellow-500 mt-2 mr-2 flex-shrink-0"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200 hotdog:text-black flex items-center">
              <span className="w-8 h-8 rounded-full bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center mr-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </span>
              Instructions
            </h3>
            <ol className="space-y-3 text-gray-600 dark:text-gray-300 hotdog:text-black pl-4">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center mr-3 text-white text-sm flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Recipe card tab */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-6 bg-yellow-400 dark:bg-yellow-500 rounded-t-lg"></div>
        </div>
      </div>
    </div>
  );
}
