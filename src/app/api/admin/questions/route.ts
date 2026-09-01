import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Middleware check for ADMIN role
async function checkAdmin(req: NextRequest) {
  const user = await getAuthUserFromRequest(req);
  if (!user || user.role !== 'ADMIN') {
    return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  try {
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const chapterId = searchParams.get('chapterId');

    const where: any = {};
    if (chapterId) where.chapterId = chapterId;
    if (search) {
      where.OR = [
        { code: { contains: search } },
        { questionEn: { contains: search } },
        { questionBn: { contains: search } },
      ];
    }

    const questions = await prisma.question.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        chapter: { select: { titleEn: true, titleBn: true, slug: true } },
      },
    });

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error('Admin get questions error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      code,
      chapterId,
      difficulty = 'MEDIUM',
      questionEn,
      questionBn,
      optionA_En,
      optionA_Bn,
      optionB_En,
      optionB_Bn,
      optionC_En,
      optionC_Bn,
      optionD_En,
      optionD_Bn,
      correctOption,
      explanationEn,
      explanationBn,
      formula,
      youtubeUrl,
      youtubeTimestamp,
      simulationType,
      simulationParams,
      isPublished = true,
      isQuestionOfDay = false,
    } = body;

    if (!code || !chapterId || !questionEn || !questionBn || !correctOption) {
      return NextResponse.json({ error: 'Missing required question fields' }, { status: 400 });
    }

    const newQuestion = await prisma.question.create({
      data: {
        code: code.trim(),
        chapterId,
        difficulty,
        questionEn,
        questionBn,
        optionA_En: optionA_En || '',
        optionA_Bn: optionA_Bn || '',
        optionB_En: optionB_En || '',
        optionB_Bn: optionB_Bn || '',
        optionC_En: optionC_En || '',
        optionC_Bn: optionC_Bn || '',
        optionD_En: optionD_En || '',
        optionD_Bn: optionD_Bn || '',
        correctOption: correctOption.toUpperCase(),
        explanationEn: explanationEn || '',
        explanationBn: explanationBn || '',
        formula,
        youtubeUrl,
        youtubeTimestamp: Number(youtubeTimestamp) || 0,
        simulationType: simulationType || null,
        simulationParams: typeof simulationParams === 'object' ? JSON.stringify(simulationParams) : simulationParams || '{}',
        isPublished: Boolean(isPublished),
        isQuestionOfDay: Boolean(isQuestionOfDay),
      },
    });

    return NextResponse.json({ success: true, question: newQuestion });
  } catch (error: any) {
    console.error('Admin create question error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create question' }, { status: 500 });
  }
}
