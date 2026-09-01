import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);

    const chapters = await prisma.chapter.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: 'asc' },
      include: {
        topics: {
          orderBy: { orderIndex: 'asc' },
        },
        _count: {
          select: {
            questions: { where: { isPublished: true } },
            tests: { where: { isPublished: true } },
          },
        },
      },
    });

    // If user is logged in, calculate completed questions per chapter
    let chapterStats: Record<string, { solved: number; correct: number }> = {};
    if (user) {
      const attempts = await prisma.questionAttempt.findMany({
        where: { userId: user.id },
        include: { question: { select: { chapterId: true } } },
      });

      attempts.forEach((att) => {
        const chId = att.question.chapterId;
        if (!chapterStats[chId]) chapterStats[chId] = { solved: 0, correct: 0 };
        chapterStats[chId].solved += 1;
        if (att.isCorrect) chapterStats[chId].correct += 1;
      });
    }

    const result = chapters.map((ch) => ({
      id: ch.id,
      titleEn: ch.titleEn,
      titleBn: ch.titleBn,
      slug: ch.slug,
      descriptionEn: ch.descriptionEn,
      descriptionBn: ch.descriptionBn,
      orderIndex: ch.orderIndex,
      icon: ch.icon,
      topicsCount: ch.topics.length,
      questionsCount: ch._count.questions,
      testsCount: ch._count.tests,
      topics: ch.topics,
      userProgress: chapterStats[ch.id] || { solved: 0, correct: 0 },
    }));

    return NextResponse.json({ chapters: result });
  } catch (error: any) {
    console.error('Fetch chapters error:', error);
    return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 });
  }
}
