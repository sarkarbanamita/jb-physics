import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chapterSlug = searchParams.get('chapterSlug');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const mode = searchParams.get('mode') || 'PRACTICE';
    const limit = Math.min(Number(searchParams.get('limit')) || 30, 50);
    const page = Math.max(Number(searchParams.get('page')) || 1, 1);

    const user = await getAuthUserFromRequest(req);

    const where: any = {
      isPublished: true,
    };

    if (chapterSlug) {
      where.chapter = { slug: chapterSlug };
    }

    if (difficulty) {
      where.difficulty = difficulty.toUpperCase();
    }

    if (search) {
      where.OR = [
        { questionEn: { contains: search } },
        { questionBn: { contains: search } },
        { code: { contains: search } },
      ];
    }

    const [total, questions] = await Promise.all([
      prisma.question.count({ where }),
      prisma.question.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { code: 'asc' },
        include: {
          chapter: {
            select: { titleEn: true, titleBn: true, slug: true },
          },
        },
      }),
    ]);

    // Check user bookmarks
    let bookmarkedQuestionIds = new Set<string>();
    if (user) {
      const bookmarks = await prisma.bookmark.findMany({
        where: {
          userId: user.id,
          questionId: { in: questions.map((q) => q.id) },
        },
        select: { questionId: true },
      });
      bookmarkedQuestionIds = new Set(bookmarks.map((b) => b.questionId));
    }

    // Sanitize for Test mode: never leak correctOption or explanations
    const isTestMode = mode === 'TEST';

    const sanitizedQuestions = questions.map((q) => {
      const isBookmarked = bookmarkedQuestionIds.has(q.id);
      if (isTestMode) {
        const { correctOption, explanationEn, explanationBn, ...safeQuestion } = q;
        return {
          ...safeQuestion,
          isBookmarked,
        };
      }

      return {
        ...q,
        isBookmarked,
      };
    });

    return NextResponse.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      questions: sanitizedQuestions,
    });
  } catch (error: any) {
    console.error('Fetch questions error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
