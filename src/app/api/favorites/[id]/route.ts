import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    // In a real app, you'd verify that the favorite belongs to the current user
    const userId = 'demo-user-id';
    
    const favorite = await prisma.favorite.findFirst({
      where: { id, userId },
    });
    
    if (!favorite) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }
    
    await prisma.favorite.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete favorite:', error);
    return NextResponse.json({ error: 'Failed to delete favorite' }, { status: 500 });
  }
}
