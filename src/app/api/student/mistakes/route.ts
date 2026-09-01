import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find all question IDs that were answered incorrectly
    const wrongAttempts = await prisma.questionAttempt.findMany({
      where: { userId: user.id, isCorrect: false },
      orderBy: { createdAt: 'desc' },
      select: { questionId: true },
    });

    const uniqueWrongIds = Array.from(new Set(wrongAttempts.map((a) => a.questionId)));

    // Fetch the actual questions
    const questions = await prisma.question.findMany({
      where: {
        id: { in: uniqueWrongIds },
        isPublished: true,
      },
      include: {
        chapter: {
          select: { titleEn: true, titleBn: true, slug: true },
        },
      },
    });

    // Check bookmarks for these questions
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
        questionId: { in: questions.map((q) => q.id) },
      },
      select: { questionId: true },
    });
    const bmSet = new Set(bookmarks.map((b) => b.questionId));

    const result = questions.map((q) => ({
      ...q,
      isBookmarked: bmSet.has(q.id),
    }));

    return NextResponse.json({
      totalMistakes: result.length,
      questions: result,
    });
  } catch (error: any) {
    console.error('Mistakes API error:', error);
    return NextResponse.json({ error: 'Failed to fetch mistake questions' }, { status: 500 });
  }
}
