import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { questionId, selectedOption, mode = 'PRACTICE', timeSpentSec = 0 } = await req.json();

    if (!questionId || !selectedOption) {
      return NextResponse.json({ error: 'Question ID and selected option required' }, { status: 400 });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const isCorrect = question.correctOption.toUpperCase() === selectedOption.toUpperCase();

    // Increment question stats
    await prisma.question.update({
      where: { id: questionId },
      data: {
        totalAttempts: { increment: 1 },
        correctAttempts: isCorrect ? { increment: 1 } : undefined,
      },
    });

    // Check if user is logged in to save attempt history & streak
    const user = await getAuthUserFromRequest(req);
    if (user) {
      await prisma.questionAttempt.create({
        data: {
          userId: user.id,
          questionId,
          selectedOption,
          isCorrect,
          timeSpentSec,
          mode,
        },
      });

      // Update streak
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastActiveAt: new Date(),
          streakCount: isCorrect ? { increment: 1 } : undefined,
        },
      });
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      correctOption: question.correctOption,
      explanationEn: question.explanationEn,
      explanationBn: question.explanationBn,
      formula: question.formula,
      simulationType: question.simulationType,
      simulationParams: question.simulationParams,
      youtubeUrl: question.youtubeUrl,
      youtubeTimestamp: question.youtubeTimestamp,
    });
  } catch (error: any) {
    console.error('Attempt submission error:', error);
    return NextResponse.json({ error: 'Failed to record attempt' }, { status: 500 });
  }
}
