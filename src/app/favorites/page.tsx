'use client';

import { useEffect, useState } from 'react';
import RecipeCard from '@/components/RecipeCard';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';

interface Favorite {
  id: number;
  userId: string;
  recipeName: string;
  recipeData: any;
  createdAt: string;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { themeMode, isDarkMode, isHotdogMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        const data = await response.json();
        setFavorites(data);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load favorites. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (id: number) => {
    try {
      const response = await fetch(`/api/favorites/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }

      // Remove the favorite from the state
      setFavorites(favorites.filter(fav => fav.id !== id));
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Failed to remove favorite. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 hotdog:bg-hotdog-mustard py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-end mb-4">
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white hotdog:text-black mb-4">
            Favorite Recipes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 hotdog:text-black mb-4">
            Your saved recipe collection
          </p>
          <Link 
            href="/"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 dark:bg-blue-500 hotdog:bg-hotdog-red text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 hotdog:hover:bg-red-700 transition-colors"
          >
            Back to Recipe Generator
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 hotdog:border-hotdog-red"></div>
          </div>
        )}

        {error && (
          <div className="text-red-600 dark:text-red-400 hotdog:text-black text-center mb-8">
            {error}
          </div>
        )}

        {!loading && favorites.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 hotdog:text-hotdog-red"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white hotdog:text-black">
              No favorite recipes yet
            </h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400 hotdog:text-black">
              Start adding recipes to your favorites collection!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="relative">
              <RecipeCard recipe={favorite.recipeData} />
              <button
                onClick={() => handleRemoveFavorite(favorite.id)}
                className="absolute top-4 right-4 p-2 rounded-full bg-red-100 dark:bg-red-800 hotdog:bg-hotdog-red text-red-600 dark:text-red-300 hotdog:text-white hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                aria-label="Remove from favorites"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
