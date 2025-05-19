interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{recipe.name}</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Ingredients</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
