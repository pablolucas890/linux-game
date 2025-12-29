'use client';

import { LevelsProvider } from '@/src/contexts/levels';
import '@/src/styles/typewriter.css';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <LevelsProvider>{children}</LevelsProvider>;
}
