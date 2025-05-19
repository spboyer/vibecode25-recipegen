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
    <div className="recipe-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 relative group p-6">
      {/* Card Header */}
      <div className="recipe-card-header relative mb-6">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 transform origin-left transition-transform duration-300 group-hover:scale-x-110"></div>
        <h2 className="text-2xl font-bold text-gray-800 pb-2">
          {recipe.name}
        </h2>
      </div>

      {/* Recipe Content */}
      <div className="recipe-content space-y-6">
        {/* Ingredients Section */}
        <div className="ingredients-section">
          <h3 className="flex items-center text-lg font-semibold text-gray-700 mb-3">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mr-2 text-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </span>
            Ingredients
          </h3>
          <ul className="space-y-2 text-gray-600">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-yellow-400 mt-2 mr-2 flex-shrink-0"></span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions Section */}
        <div className="instructions-section">
          <h3 className="flex items-center text-lg font-semibold text-gray-700 mb-3">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mr-2 text-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </span>
            Instructions
          </h3>
          <ol className="space-y-3 text-gray-600">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mr-3 text-white text-sm flex-shrink-0 shadow-sm">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Card Footer - Attribution */}
      <div className="mt-6 text-xs text-gray-500 text-right">
        <p>Design inspired by <a href="https://codepen.io/michmy/pen/GrzwVL" className="text-yellow-600 hover:text-yellow-700" target="_blank" rel="noopener noreferrer">Michelle Barker</a></p>
      </div>
    </div>
  );
}
