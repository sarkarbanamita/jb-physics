import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { testId, answers = {}, timeSpentSec = 0 } = await req.json();

    if (!testId) {
      return NextResponse.json({ error: 'Test ID is required' }, { status: 400 });
    }

    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        chapter: true,
        testQuestions: {
          orderBy: { orderIndex: 'asc' },
          include: {
            question: {
              include: { topic: true },
            },
          },
        },
      },
    });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    const user = await getAuthUserFromRequest(req);

    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    const totalQuestions = test.testQuestions.length;

    const topicStats: Record<string, { total: number; correct: number }> = {};
    const detailedResults: any[] = [];

    for (const tq of test.testQuestions) {
      const q = tq.question;
      const studentAns = answers[q.id] || null;
      const topicName = q.topic?.titleEn || test.chapter?.titleEn || 'General';

      if (!topicStats[topicName]) {
        topicStats[topicName] = { total: 0, correct: 0 };
      }
      topicStats[topicName].total += 1;

      let isCorrect = false;
      if (!studentAns) {
        unattemptedCount += 1;
      } else if (studentAns.toUpperCase() === q.correctOption.toUpperCase()) {
        isCorrect = true;
        correctCount += 1;
        topicStats[topicName].correct += 1;
      } else {
        wrongCount += 1;
      }

      // Record individual attempt in DB if logged in
      if (user && studentAns) {
        await prisma.questionAttempt.create({
          data: {
            userId: user.id,
            questionId: q.id,
            selectedOption: studentAns,
            isCorrect,
            timeSpentSec: Math.round(timeSpentSec / totalQuestions),
            mode: 'TEST',
          },
        });
      }

      detailedResults.push({
        questionId: q.id,
        code: q.code,
        questionEn: q.questionEn,
        questionBn: q.questionBn,
        optionA_En: q.optionA_En,
        optionA_Bn: q.optionA_Bn,
        optionB_En: q.optionB_En,
        optionB_Bn: q.optionB_Bn,
        optionC_En: q.optionC_En,
        optionC_Bn: q.optionC_Bn,
        optionD_En: q.optionD_En,
        optionD_Bn: q.optionD_Bn,
        selectedOption: studentAns,
        correctOption: q.correctOption,
        isCorrect,
        explanationEn: q.explanationEn,
        explanationBn: q.explanationBn,
        formula: q.formula,
        simulationType: q.simulationType,
        simulationParams: q.simulationParams,
        youtubeUrl: q.youtubeUrl,
        youtubeTimestamp: q.youtubeTimestamp,
        topicName,
      });
    }

    const score = correctCount; // 1 mark each
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / (correctCount + wrongCount || 1)) * 100) : 0;

    // Identify Strong Topics (>= 75% accuracy) vs Weak Topics (< 75%)
    const strongTopics: string[] = [];
    const weakTopics: string[] = [];

    Object.entries(topicStats).forEach(([name, stat]) => {
      const pct = (stat.correct / stat.total) * 100;
      if (pct >= 75) {
        strongTopics.push(name);
      } else {
        weakTopics.push(name);
      }
    });

    // Save test attempt record if user is logged in
    if (user) {
      await prisma.testAttempt.create({
        data: {
          userId: user.id,
          testId: test.id,
          score,
          totalQuestions,
          correctCount,
          wrongCount,
          unattemptedCount,
          timeSpentSec,
          answersPayload: JSON.stringify(answers),
        },
      });
    }

    return NextResponse.json({
      success: true,
      score,
      totalMarks: totalQuestions,
      totalQuestions,
      correctCount,
      wrongCount,
      unattemptedCount,
      accuracy,
      timeSpentSec,
      strongTopics,
      weakTopics,
      detailedResults,
    });
  } catch (error: any) {
    console.error('Test submit error:', error);
    return NextResponse.json({ error: 'Failed to submit test' }, { status: 500 });
  }
}
