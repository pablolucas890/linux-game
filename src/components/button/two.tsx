'use client';

import Link from 'next/link';

interface TwoProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  onClick?: () => void;
}

export function Two({ href, children, external = false, onClick }: TwoProps) {
  const className =
    'px-8 py-4 bg-(--color-primary) hover:bg-(--color-primary-hover) dark:bg-(--color-primary-dark) dark:hover:bg-(--color-primary) rounded-lg text-lg font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105';

  if (external) {
    return (
      <a href={href} target='_blank' rel='noopener noreferrer' className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
