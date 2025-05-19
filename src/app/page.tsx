'use client';

import { useState } from 'react';
import RecipeCard from '@/components/RecipeCard';

interface Recipe {
	name: string;
	ingredients: string[];
	instructions: string[];
}

const mockRecipes: Recipe[] = [
	{
		name: 'Chicken and Rice Stir-Fry',
		ingredients: [
			'2 chicken breasts, diced',
			'2 cups cooked rice',
			'2 carrots, julienned',
			'1 cup frozen peas',
			'3 cloves garlic, minced',
			'2 tbsp soy sauce',
			'1 tbsp sesame oil',
		],
		instructions: [
			'Heat sesame oil in a large pan over medium-high heat',
			'Cook diced chicken until golden brown, about 5-7 minutes',
			'Add garlic and carrots, cook for 2 minutes',
			'Add rice, peas, and soy sauce',
			'Stir-fry until everything is heated through and well combined',
		],
	},
	{
		name: 'Mediterranean Pasta Salad',
		ingredients: [
			'1 pound pasta, any shape',
			'1 cup cherry tomatoes, halved',
			'1 cucumber, diced',
			'1/2 red onion, thinly sliced',
			'1 cup kalamata olives',
			'1/2 cup olive oil',
			'2 tbsp lemon juice',
			'1 cup feta cheese, crumbled',
		],
		instructions: [
			'Cook pasta according to package instructions, drain and cool',
			'Combine all vegetables in a large bowl',
			'Whisk together olive oil and lemon juice',
			'Mix pasta with vegetables and dressing',
			'Top with crumbled feta cheese and serve',
		],
	},
	{
		name: 'Quick Bean and Vegetable Soup',
		ingredients: [
			'2 cans mixed beans, drained',
			'1 onion, diced',
			'2 celery stalks, chopped',
			'2 carrots, diced',
			'4 cups vegetable broth',
			'2 tbsp olive oil',
			'2 cloves garlic, minced',
		],
		instructions: [
			'Heat olive oil in a large pot over medium heat',
			'Sauté onion, celery, and carrots until softened',
			'Add garlic and cook for 1 minute',
			'Add beans and vegetable broth',
			'Simmer for 15-20 minutes until vegetables are tender',
		],
	},
];

export default function Home() {
	const [ingredients, setIngredients] = useState<string>('');
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [useMockData, setUseMockData] = useState(true);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		if (useMockData) {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setRecipes(mockRecipes);
			setLoading(false);
			return;
		}

		try {
			const response = await fetch('/api/generate-recipes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					ingredients: ingredients.split(',').map((i) => i.trim()),
				}),
			});

			if (!response.ok) throw new Error('Failed to generate recipes');

			const data = await response.json();
			setRecipes(data);
		} catch (err) {
			setError('Failed to generate recipes. Please try again.');
			console.error('Error:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Recipe Generator
					</h1>
					<p className="text-xl text-gray-600">
						Enter your ingredients and let AI suggest some delicious recipes!
					</p>
					<div className="mt-4 flex items-center justify-center gap-2">
						<label className="text-sm text-gray-600">
							Use mock data for testing:
						</label>
						<button
							onClick={() => setUseMockData(!useMockData)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
								useMockData
									? 'bg-green-600 text-white hover:bg-green-700'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
						>
							{useMockData ? 'Using Mock Data' : 'Using API'}
						</button>
					</div>
				</div>

				<form
					onSubmit={handleSubmit}
					className="max-w-2xl mx-auto mb-12"
				>
					<div className="flex flex-col gap-4">
						<textarea
							value={ingredients}
							onChange={(e) => setIngredients(e.target.value)}
							placeholder="Enter ingredients separated by commas (e.g., chicken, rice, tomatoes)"              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-none text-gray-900 placeholder:text-gray-500"
							required
						/>
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
						>
							{loading ? 'Generating Recipes...' : 'Generate Recipes'}
						</button>
					</div>
				</form>

				{error && (
					<div className="text-red-600 text-center mb-8">{error}</div>
				)}

				{loading && (
					<div className="flex justify-center items-center mb-8">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{recipes.map((recipe, index) => (
						<RecipeCard key={index} recipe={recipe} />
					))}
				</div>
			</div>
		</main>
	);
}
