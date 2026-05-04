import type { Metadata } from 'next';
import { Syncopate, Space_Grotesk } from 'next/font/google';
import Link from 'next/link';
import { InteractiveBackground } from '@/components/InteractiveBackground';
import './globals.css';

const syncopate = Syncopate({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-syncopate' });
const space = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-space' });

export const metadata: Metadata = {
  title: 'DTM.gg | Deconstruct The Meta',
  description: 'Unleash your potential.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${space.className} ${syncopate.variable} min-h-screen flex flex-col antialiased selection:bg-[#CCFF00] selection:text-black`}>
        <InteractiveBackground />
        <nav className="border-b border-white/5 bg-[#040406]/60 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className={`flex items-center font-bold text-2xl tracking-tighter cursor-pointer font-[family-name:var(--font-syncopate)] uppercase`}>
              <span className="text-[#CCFF00]">DTM</span>
              <span className="text-white">.gg</span>
            </Link>
            <div className="hidden md:flex items-center gap-10 text-xs font-bold tracking-[0.2em] uppercase text-zinc-500">
              <a href="/" className="hover:text-[#CCFF00] transition-colors">Analyze</a>
            </div>
          </div>
        </nav>
        <main className="flex-1 w-full mx-auto max-w-[1400px] pt-8 pb-16">
          {children}
        </main>
      </body>
    </html>
  );
}
