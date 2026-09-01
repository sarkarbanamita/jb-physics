import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id;

    // Find test by ID or chapter slug
    let test = await prisma.test.findFirst({
      where: {
        OR: [
          { id: testId },
          { chapter: { slug: testId } },
        ],
        isPublished: true,
      },
      include: {
        chapter: {
          select: { titleEn: true, titleBn: true, slug: true },
        },
        testQuestions: {
          orderBy: { orderIndex: 'asc' },
          include: {
            question: true,
          },
        },
      },
    });

    if (!test) {
      // Create a dynamic test on the fly if not explicitly seeded
      const chapter = await prisma.chapter.findFirst({
        where: { slug: testId },
        include: { questions: { where: { isPublished: true }, take: 10 } },
      });

      if (chapter && chapter.questions.length > 0) {
        test = await prisma.test.create({
          data: {
            chapterId: chapter.id,
            titleEn: `${chapter.titleEn} — Chapter Practice Test`,
            titleBn: `${chapter.titleBn} — অধ্যায়ভিত্তিক মক টেস্ট`,
            durationMinutes: 15,
            totalMarks: chapter.questions.length,
            testQuestions: {
              create: chapter.questions.map((q, idx) => ({
                questionId: q.id,
                orderIndex: idx,
              })),
            },
          },
          include: {
            chapter: { select: { titleEn: true, titleBn: true, slug: true } },
            testQuestions: {
              orderBy: { orderIndex: 'asc' },
              include: { question: true },
            },
          },
        });
      }
    }

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Sanitize questions: strip correctOption and explanations
    const safeQuestions = test.testQuestions.map((tq, idx) => {
      const { correctOption, explanationEn, explanationBn, ...safeQ } = tq.question;
      return {
        ...safeQ,
        orderIndex: idx,
      };
    });

    return NextResponse.json({
      test: {
        id: test.id,
        titleEn: test.titleEn,
        titleBn: test.titleBn,
        durationMinutes: test.durationMinutes,
        totalMarks: test.totalMarks,
        chapter: test.chapter,
        questions: safeQuestions,
      },
    });
  } catch (error: any) {
    console.error('Fetch test error:', error);
    return NextResponse.json({ error: 'Failed to fetch test' }, { status: 500 });
  }
}
