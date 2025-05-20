import { PrismaClient } from '@prisma/client';
import { Recipe } from '@/types';

export interface FavoriteRecipe {
  id: number;
  userId: string;
  recipeName: string;
  recipeData: Recipe;
  createdAt: Date;
}

export async function getFavoriteRecipes(userId: string): Promise<FavoriteRecipe[]> {
  const prisma = new PrismaClient();
  
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return favorites;
  } catch (error) {
    console.error('Error fetching favorite recipes:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function addFavoriteRecipe(userId: string, recipe: Recipe): Promise<FavoriteRecipe> {
  const prisma = new PrismaClient();
  
  try {
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        recipeName: recipe.name,
        recipeData: recipe as any,
      },
    });
    
    return favorite;
  } catch (error) {
    console.error('Error adding favorite recipe:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function removeFavoriteRecipe(id: number, userId: string): Promise<boolean> {
  const prisma = new PrismaClient();
  
  try {
    const favorite = await prisma.favorite.findFirst({
      where: { id, userId },
    });
    
    if (!favorite) {
      return false;
    }
    
    await prisma.favorite.delete({
      where: { id },
    });
    
    return true;
  } catch (error) {
    console.error('Error removing favorite recipe:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function isFavoriteRecipe(userId: string, recipeName: string): Promise<boolean> {
  const prisma = new PrismaClient();
  
  try {
    const favorite = await prisma.favorite.findFirst({
      where: { userId, recipeName },
    });
    
    return !!favorite;
  } catch (error) {
    console.error('Error checking if recipe is favorite:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
