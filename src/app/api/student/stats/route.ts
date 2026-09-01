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

    const [userRecord, totalAttempts, correctAttempts, chapterList, recentAttempts, mistakesCount, bookmarksCount] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: user.id },
          select: { name: true, email: true, streakCount: true, lastActiveAt: true, role: true },
        }),
        prisma.questionAttempt.count({ where: { userId: user.id } }),
        prisma.questionAttempt.count({ where: { userId: user.id, isCorrect: true } }),
        prisma.chapter.findMany({
          where: { isPublished: true },
          orderBy: { orderIndex: 'asc' },
          include: {
            _count: { select: { questions: { where: { isPublished: true } } } },
          },
        }),
        prisma.questionAttempt.findMany({
          where: { userId: user.id },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            question: {
              select: { code: true, questionEn: true, questionBn: true, difficulty: true },
            },
          },
        }),
        prisma.questionAttempt.count({
          where: { userId: user.id, isCorrect: false },
        }),
        prisma.bookmark.count({
          where: { userId: user.id },
        }),
      ]);

    // Compute chapter progress
    const allUserAttempts = await prisma.questionAttempt.findMany({
      where: { userId: user.id },
      include: { question: { select: { chapterId: true } } },
    });

    const chapterSolvedMap: Record<string, { solved: number; correct: number }> = {};
    allUserAttempts.forEach((att) => {
      const chId = att.question.chapterId;
      if (!chapterSolvedMap[chId]) chapterSolvedMap[chId] = { solved: 0, correct: 0 };
      chapterSolvedMap[chId].solved += 1;
      if (att.isCorrect) chapterSolvedMap[chId].correct += 1;
    });

    const chapterProgress = chapterList.map((ch) => {
      const stats = chapterSolvedMap[ch.id] || { solved: 0, correct: 0 };
      const totalQ = ch._count.questions || 1;
      const progressPercent = Math.min(100, Math.round((stats.solved / totalQ) * 100));
      return {
        id: ch.id,
        titleEn: ch.titleEn,
        titleBn: ch.titleBn,
        slug: ch.slug,
        totalQuestions: totalQ,
        solvedQuestions: stats.solved,
        correctQuestions: stats.correct,
        progressPercent,
      };
    });

    const overallAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    return NextResponse.json({
      user: userRecord,
      stats: {
        totalSolved: totalAttempts,
        totalCorrect: correctAttempts,
        accuracyPercent: overallAccuracy,
        streakDays: userRecord?.streakCount || 0,
        mistakesCount,
        bookmarksCount,
      },
      chapterProgress,
      recentAttempts,
    });
  } catch (error: any) {
    console.error('Student stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch student statistics' }, { status: 500 });
  }
}
