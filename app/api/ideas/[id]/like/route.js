import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function POST(_request, { params }) {
  try {
    const idea = await prisma.mealIdea.update({ where: { id: params.id }, data: { likes: { increment: 1 } } });
    return NextResponse.json(idea);
  } catch {
    return NextResponse.json({ error: 'Idée introuvable' }, { status: 404 });
  }
}
