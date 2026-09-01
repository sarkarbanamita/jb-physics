import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { questions } = await req.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'Expected non-empty array of questions' }, { status: 400 });
    }

    let inserted = 0;
    const errors: any[] = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      try {
        if (!q.code || !q.questionEn || !q.correctOption) {
          throw new Error(`Missing code, questionEn or correctOption at index ${i}`);
        }

        // Find or create chapter by slug or title
        let chapterId = q.chapterId;
        if (!chapterId && q.chapterSlug) {
          const ch = await prisma.chapter.findUnique({ where: { slug: q.chapterSlug } });
          if (ch) chapterId = ch.id;
        }

        if (!chapterId) {
          // fallback to first chapter
          const firstCh = await prisma.chapter.findFirst();
          chapterId = firstCh?.id;
        }

        if (!chapterId) {
          throw new Error('No chapter found to assign question to');
        }

        await prisma.question.upsert({
          where: { code: q.code },
          update: {
            chapterId,
            difficulty: q.difficulty || 'MEDIUM',
            questionEn: q.questionEn,
            questionBn: q.questionBn || q.questionEn,
            optionA_En: q.optionA_En || '',
            optionA_Bn: q.optionA_Bn || q.optionA_En || '',
            optionB_En: q.optionB_En || '',
            optionB_Bn: q.optionB_Bn || q.optionB_En || '',
            optionC_En: q.optionC_En || '',
            optionC_Bn: q.optionC_Bn || q.optionC_En || '',
            optionD_En: q.optionD_En || '',
            optionD_Bn: q.optionD_Bn || q.optionD_En || '',
            correctOption: q.correctOption.toUpperCase(),
            explanationEn: q.explanationEn || '',
            explanationBn: q.explanationBn || q.explanationEn || '',
            formula: q.formula || null,
            youtubeUrl: q.youtubeUrl || null,
            youtubeTimestamp: Number(q.youtubeTimestamp) || 0,
            simulationType: q.simulationType || null,
            simulationParams: typeof q.simulationParams === 'object' ? JSON.stringify(q.simulationParams) : q.simulationParams || '{}',
            isPublished: q.isPublished !== undefined ? Boolean(q.isPublished) : true,
          },
          create: {
            code: q.code,
            chapterId,
            difficulty: q.difficulty || 'MEDIUM',
            questionEn: q.questionEn,
            questionBn: q.questionBn || q.questionEn,
            optionA_En: q.optionA_En || '',
            optionA_Bn: q.optionA_Bn || q.optionA_En || '',
            optionB_En: q.optionB_En || '',
            optionB_Bn: q.optionB_Bn || q.optionB_En || '',
            optionC_En: q.optionC_En || '',
            optionC_Bn: q.optionC_Bn || q.optionC_En || '',
            optionD_En: q.optionD_En || '',
            optionD_Bn: q.optionD_Bn || q.optionD_En || '',
            correctOption: q.correctOption.toUpperCase(),
            explanationEn: q.explanationEn || '',
            explanationBn: q.explanationBn || q.explanationEn || '',
            formula: q.formula || null,
            youtubeUrl: q.youtubeUrl || null,
            youtubeTimestamp: Number(q.youtubeTimestamp) || 0,
            simulationType: q.simulationType || null,
            simulationParams: typeof q.simulationParams === 'object' ? JSON.stringify(q.simulationParams) : q.simulationParams || '{}',
            isPublished: q.isPublished !== undefined ? Boolean(q.isPublished) : true,
          },
        });

        inserted++;
      } catch (err: any) {
        errors.push({ index: i, code: q.code, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      total: questions.length,
      inserted,
      failed: errors.length,
      errors: errors.slice(0, 10),
    });
  } catch (error: any) {
    console.error('Bulk upload error:', error);
    return NextResponse.json({ error: 'Failed to process bulk upload' }, { status: 500 });
  }
}
