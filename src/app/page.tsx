'use client';

import { useState } from 'react';
import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import { useTheme } from '@/components/ThemeProvider';

interface Recipe {
	name: string;
	ingredients: string[];
	instructions: string[];
}

interface DietaryPreference {
	id: string;
	label: string;
	description: string;
}

const DIETARY_PREFERENCES: DietaryPreference[] = [
	{
		id: 'glutenFree',
		label: 'Gluten Free',
		description: 'Excludes wheat, barley, rye, and their derivatives',
	},
	{
		id: 'dairyFree',
		label: 'Dairy Free',
		description: 'No milk, cheese, butter, or dairy products',
	},
	{
		id: 'keto',
		label: 'Keto',
		description: 'High-fat, low-carb diet',
	},
	{
		id: 'vegan',
		label: 'Vegan',
		description: 'No animal products',
	},
	{
		id: 'vegetarian',
		label: 'Vegetarian',
		description: 'No meat or fish',
	},
	{
		id: 'paleo',
		label: 'Paleo',
		description: 'Based on foods available to our prehistoric ancestors',
	},
];

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
	const [dietaryPreferences, setDietaryPreferences] = useState<Set<string>>(
		new Set()
	);
	const { isDarkMode, isHotdogMode, toggleTheme } = useTheme();

	const handleDietaryPreferenceChange = (preferenceId: string) => {
		setDietaryPreferences((prev) => {
			const newPreferences = new Set(prev);
			if (newPreferences.has(preferenceId)) {
				newPreferences.delete(preferenceId);
			} else {
				newPreferences.add(preferenceId);
			}
			return newPreferences;
		});
	};

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
					dietaryPreferences: Array.from(dietaryPreferences),
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
		<main className="min-h-screen bg-gray-50 dark:bg-gray-900 hotdog:bg-hotdog-mustard py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<div className="flex justify-between items-center mb-4">
						<Link
							href="/favorites"
							className="p-2 rounded-lg bg-blue-600 dark:bg-blue-500 hotdog:bg-hotdog-red text-white hover:bg-blue-700 dark:hover:bg-blue-600 hotdog:hover:bg-red-700 transition-colors px-4 py-2"
						>
							Favorite Recipes
						</Link>
						<button
							onClick={toggleTheme}
							className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 hotdog:bg-hotdog-yellow hotdog:hover:bg-hotdog-red"
							aria-label="Toggle theme"
						>
							{isDarkMode && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-yellow-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
							)}
							{!isDarkMode && !isHotdogMode && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-gray-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
									/>
								</svg>
							)}
							{isHotdogMode && (
								<svg 
									xmlns="http://www.w3.org/2000/svg" 
									className="h-6 w-6 text-hotdog-red"
									viewBox="0 0 24 24" 
									fill="none" 
									stroke="currentColor" 
									strokeWidth="2" 
									strokeLinecap="round" 
									strokeLinejoin="round"
								>
									<path d="M5.5 8C3.57 8 2 9.57 2 11.5S3.57 15 5.5 15h13c1.93 0 3.5-1.57 3.5-3.5S20.43 8 19.5 8h-14Z" />
									<path d="M8 8c0-2.24 1.79-4 4-4s4 1.76 4 4" />
									<path d="M8 15c0 2.24 1.79 4 4 4s4-1.76 4-4" />
								</svg>
							)}
						</button>
					</div>
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
						Recipe Generator
					</h1>
					<p className="text-xl text-gray-600 dark:text-gray-300">
						Enter your ingredients and let AI suggest some delicious recipes!
					</p>
					<div className="mt-4 flex items-center justify-center gap-2">
						<label className="text-sm text-gray-600 dark:text-gray-300">
							Use mock data for testing:
						</label>
						<button
							onClick={() => setUseMockData(!useMockData)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
								useMockData
									? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
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
					<div className="flex flex-col gap-6">
						<textarea
							value={ingredients}
							onChange={(e) => setIngredients(e.target.value)}
							placeholder="Enter ingredients separated by commas (e.g., chicken, rice, tomatoes)"
							className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-none text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors duration-200"
							required
						/>

						<div className="space-y-4">
							<h3 className="text-lg font-medium text-gray-900 dark:text-white">
								Dietary Preferences
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{DIETARY_PREFERENCES.map((preference) => (
									<label
										key={preference.id}
										className="relative flex items-start p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer group"
									>
										<div className="flex items-center h-5">
											<input
												type="checkbox"
												checked={dietaryPreferences.has(preference.id)}
												onChange={() =>
													handleDietaryPreferenceChange(preference.id)
												}
												className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600"
											/>
										</div>
										<div className="ml-3">
											<span className="text-sm font-medium text-gray-900 dark:text-white">
												{preference.label}
											</span>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{preference.description}
											</p>
										</div>
									</label>
								))}
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
						>
							{loading ? 'Generating Recipes...' : 'Generate Recipes'}
						</button>
					</div>
				</form>

				{error && (
					<div className="text-red-600 dark:text-red-400 text-center mb-8">
						{error}
					</div>
				)}

				{loading && (
					<div className="flex justify-center items-center mb-8">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
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
