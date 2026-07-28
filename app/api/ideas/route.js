import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

function databaseError(error) {
  console.error('[ideas-api]', error);
  return NextResponse.json(
    { error: 'La base de données est indisponible ou non initialisée.' },
    { status: 503 }
  );
}

export async function GET() {
  try {
    const ideas = await prisma.mealIdea.findMany({ orderBy: [{ likes: 'desc' }, { createdAt: 'desc' }] });
    return NextResponse.json(ideas);
  } catch (error) {
    return databaseError(error);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const title = String(body.title ?? '').trim();
    const description = String(body.description ?? '').trim();
    const category = String(body.category ?? '').trim();
    const budget = String(body.budget ?? '').trim();
    const maxMinutes = Number(body.maxMinutes);
    const authorName = String(body.authorName ?? '').trim() || null;

    if (!title || !description || !category || !['€', '€€', '€€€'].includes(budget) || !Number.isInteger(maxMinutes) || maxMinutes < 5 || maxMinutes > 240) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const idea = await prisma.mealIdea.create({
      data: {
        title: title.slice(0, 80),
        description: description.slice(0, 240),
        category: category.slice(0, 30),
        budget,
        maxMinutes,
        authorName: authorName?.slice(0, 40),
      },
    });

    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    return databaseError(error);
  }
}
