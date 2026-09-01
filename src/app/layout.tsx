import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { LangProvider } from '@/components/ui/LangContext';

export const metadata: Metadata = {
  title: 'JB Physics — Free Bilingual Interactive Physics Learning',
  description: '100% Free Physics MCQ Practice, Interactive 3D Simulations, Step-by-Step Solutions in Bengali & English for Class 12, Class 11, WBCHSE, CBSE, JEE & NEET.',
  keywords: [
    'JB Physics',
    'Class 12 Physics MCQ',
    'Physics Bengali MCQ',
    'Class 12 Physics 1st Semester',
    'Interactive Physics Simulation',
    'WBCHSE Physics Semester 1',
    'Bengali Physics Questions',
  ],
  authors: [{ name: 'JB Physics' }],
  openGraph: {
    title: 'JB Physics — Free Interactive Physics Platform',
    description: 'Learn • Solve • Simulate. Free Class 12 Physics MCQs with 3D Simulations & Bilingual Explanations.',
    type: 'website',
    locale: 'bn_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=Noto+Serif+Bengali:wght@400;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen bg-[#070b14] text-slate-100 font-sans">
        <LangProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
