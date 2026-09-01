import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';

async function checkAdmin(req: NextRequest) {
  const user = await getAuthUserFromRequest(req);
  return user && user.role === 'ADMIN';
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: { chapter: true },
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ question });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch question' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    const updated = await prisma.question.update({
      where: { id: params.id },
      data: {
        code: body.code,
        chapterId: body.chapterId,
        difficulty: body.difficulty,
        questionEn: body.questionEn,
        questionBn: body.questionBn,
        optionA_En: body.optionA_En,
        optionA_Bn: body.optionA_Bn,
        optionB_En: body.optionB_En,
        optionB_Bn: body.optionB_Bn,
        optionC_En: body.optionC_En,
        optionC_Bn: body.optionC_Bn,
        optionD_En: body.optionD_En,
        optionD_Bn: body.optionD_Bn,
        correctOption: body.correctOption?.toUpperCase(),
        explanationEn: body.explanationEn,
        explanationBn: body.explanationBn,
        formula: body.formula,
        youtubeUrl: body.youtubeUrl,
        youtubeTimestamp: Number(body.youtubeTimestamp) || 0,
        simulationType: body.simulationType || null,
        simulationParams: typeof body.simulationParams === 'object' ? JSON.stringify(body.simulationParams) : body.simulationParams,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
        isQuestionOfDay: body.isQuestionOfDay !== undefined ? Boolean(body.isQuestionOfDay) : undefined,
      },
    });

    return NextResponse.json({ success: true, question: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.question.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}
