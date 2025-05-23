import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // In a real app, you'd get the actual user ID from the session/auth
    // For demo purposes, we're using a static user ID
    const userId = 'demo-user-id';
    
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipe } = body;
    
    if (!recipe || !recipe.name) {
      return NextResponse.json({ error: 'Recipe data is required' }, { status: 400 });
    }
    
    // In a real app, you'd get the actual user ID from the session/auth
    const userId = 'demo-user-id';
    
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        recipeName: recipe.name,
        recipeData: recipe,
      },
    });
    
    return NextResponse.json(favorite);
  } catch (error) {
    console.error('Failed to save favorite:', error);
    return NextResponse.json({ error: 'Failed to save favorite' }, { status: 500 });
  }
}
