interface OneProps {
  href: string;
  children: React.ReactNode;
}

export function One({ href, children }: OneProps) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors'
    >
      {children}
    </a>
  );
}
