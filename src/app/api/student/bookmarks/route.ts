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

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        question: {
          include: {
            chapter: { select: { titleEn: true, titleBn: true, slug: true } },
          },
        },
      },
    });

    const result = bookmarks.map((b) => ({
      ...b.question,
      isBookmarked: true,
      bookmarkNote: b.note,
      bookmarkedAt: b.createdAt,
    }));

    return NextResponse.json({
      totalBookmarks: result.length,
      questions: result,
    });
  } catch (error: any) {
    console.error('Bookmarks API error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}
