import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { I18nWrapper } from '../components/i18n-wrapper';
import { defaultLocale, locales } from '../locales';
// copyright: https://tailwindflex.com/@anonymous/background-animation
import '../styles/bubble.css';
import '../styles/globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Linux Game',
  description: locales[defaultLocale].translations.metadata.description as string,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // copyright: https://tailwindflex.com/@anonymous/background-animation
  return (
    <html lang={defaultLocale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-(--color-text)`}>
        <div className='w-full h-screen overflow-y-auto'>
          <div className='area w-full h-screen absolute -z-10'>
            <ul className='circles relative w-full h-full overflow-hidden'>
              <li className='circle circle1'></li>
              <li className='circle circle2'></li>
              <li className='circle circle3'></li>
              <li className='circle circle4'></li>
              <li className='circle circle5'></li>
              <li className='circle circle6'></li>
              <li className='circle circle7'></li>
              <li className='circle circle8'></li>
              <li className='circle circle9'></li>
              <li className='circle circle10'></li>
            </ul>
          </div>
          <I18nWrapper>{children}</I18nWrapper>
        </div>
      </body>
    </html>
  );
}
