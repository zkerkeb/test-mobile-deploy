import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const ideas = await prisma.mealIdea.findMany({ orderBy: [{ likes: 'desc' }, { createdAt: 'desc' }] });
  return NextResponse.json(ideas);
}

export async function POST(request) {
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

  const idea = await prisma.mealIdea.create({ data: { title: title.slice(0, 80), description: description.slice(0, 240), category: category.slice(0, 30), budget, maxMinutes, authorName: authorName?.slice(0, 40) } });
  return NextResponse.json(idea, { status: 201 });
}
