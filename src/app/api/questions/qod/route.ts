import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);

    // Find question marked as QOD or fallback to first published question
    let question = await prisma.question.findFirst({
      where: { isPublished: true, isQuestionOfDay: true },
      include: {
        chapter: {
          select: { titleEn: true, titleBn: true, slug: true },
        },
      },
    });

    if (!question) {
      question = await prisma.question.findFirst({
        where: { isPublished: true },
        include: {
          chapter: {
            select: { titleEn: true, titleBn: true, slug: true },
          },
        },
      });
    }

    if (!question) {
      return NextResponse.json({ error: 'No questions available' }, { status: 404 });
    }

    let isBookmarked = false;
    let userAttempt = null;

    if (user) {
      const [bm, att] = await Promise.all([
        prisma.bookmark.findUnique({
          where: {
            userId_questionId: {
              userId: user.id,
              questionId: question.id,
            },
          },
        }),
        prisma.questionAttempt.findFirst({
          where: {
            userId: user.id,
            questionId: question.id,
          },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      isBookmarked = !!bm;
      userAttempt = att;
    }

    const accuracy = question.totalAttempts > 0
      ? Math.round((question.correctAttempts / question.totalAttempts) * 100)
      : 75;

    return NextResponse.json({
      question: {
        ...question,
        isBookmarked,
      },
      userAttempt,
      communityStats: {
        totalAttempts: question.totalAttempts,
        correctAttempts: question.correctAttempts,
        accuracyPercent: accuracy,
      },
    });
  } catch (error: any) {
    console.error('QOD error:', error);
    return NextResponse.json({ error: 'Failed to fetch question of the day' }, { status: 500 });
  }
}
