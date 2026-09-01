import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to bookmark questions' }, { status: 401 });
    }

    const { questionId, bookmarked, note } = await req.json();

    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    if (bookmarked) {
      await prisma.bookmark.upsert({
        where: {
          userId_questionId: {
            userId: user.id,
            questionId,
          },
        },
        update: { note },
        create: {
          userId: user.id,
          questionId,
          note,
        },
      });
    } else {
      await prisma.bookmark.deleteMany({
        where: {
          userId: user.id,
          questionId,
        },
      });
    }

    return NextResponse.json({ success: true, isBookmarked: bookmarked });
  } catch (error: any) {
    console.error('Bookmark error:', error);
    return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 });
  }
}
