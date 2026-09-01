import { redirect } from 'next/navigation';

export default function ChapterRootPage({ params }: { params: { chapterSlug: string } }) {
  redirect(`/learn/class-12/semester-1/physics/${params.chapterSlug}/practice`);
}
