'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Recipe } from '@/types';

interface FavoriteButtonProps {
  recipe: Recipe;
  isFavorited?: boolean;
  onFavoriteToggle?: (isFavorited: boolean) => void;
}

export function FavoriteButton({
  recipe,
  isFavorited = false,
  onFavoriteToggle,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const toggleFavorite = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (favorited) {
        // Find the favorite ID and delete it
        // This is a simplified approach - in a real app, you'd store the favorite ID when fetching favorites
        const response = await fetch('/api/favorites');
        const favorites = await response.json();
        const favorite = favorites.find((fav: any) => fav.recipeName === recipe.name);

        if (favorite) {
          await fetch(`/api/favorites/${favorite.id}`, {
            method: 'DELETE',
          });
        }

        toast({
          title: 'Recipe removed from favorites',
          description: `"${recipe.name}" has been removed from your favorites.`,
        });
      } else {
        // Add to favorites
        await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ recipe }),
        });

        toast({
          title: 'Recipe saved to favorites',
          description: `"${recipe.name}" has been added to your favorites.`,
        });
      }

      const newState = !favorited;
      setFavorited(newState);
      if (onFavoriteToggle) onFavoriteToggle(newState);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update favorites. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 
        ${favorited
          ? 'bg-rose-100 dark:bg-rose-900 hotdog:bg-hotdog-red text-rose-600 dark:text-rose-300 hotdog:text-white'
          : 'bg-white dark:bg-gray-700 hotdog:bg-hotdog-yellow text-gray-600 dark:text-gray-300 hotdog:text-black hover:bg-gray-100 dark:hover:bg-gray-600 hotdog:hover:bg-hotdog-bun'
        }`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {favorited ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
