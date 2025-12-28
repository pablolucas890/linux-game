'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useI18n } from '../contexts/i18n';
import { executeCommand, getCommandsByLevel, setTranslationFunction } from '../lib/terminal';
import { CommandHistory } from '../types/props';

interface TerminalProps {
  username: string;
  machine: string;
  level: number;
  onExecuteCommand: (command: string, directory: string, output: string) => boolean;
}

export function Terminal({ username, machine, level, onExecuteCommand }: TerminalProps) {
  const { t } = useI18n();
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandIndex, setCommandIndex] = useState(-1);
  const [currentDirectory, setCurrentDirectory] = useState('/home/user');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [successPulse, setSuccessPulse] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { locale } = useI18n();

  useEffect(() => {
    setTranslationFunction(t, locale);
  }, [t, locale]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentCommand.trim()) return;

    const directoryAtCommand = currentDirectory;

    if (currentCommand.trim() === 'clear') {
      setShowWelcomeMessage(true);
      setCommandHistory([]);
    }

    const output = executeCommand(currentCommand, currentDirectory, setCurrentDirectory, level);
    const ok = onExecuteCommand(currentCommand, directoryAtCommand, output);
    if (ok) {
      try {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          (navigator as Navigator & { vibrate?: (pattern: number | number[]) => boolean }).vibrate?.(35);
        }
      } catch {
        // ignore
      }

      setSuccessPulse(true);
      setToast({ message: t('terminal.success') ?? 'Sucesso!', visible: true });

      window.setTimeout(() => setSuccessPulse(false), 1000);
      window.setTimeout(() => setToast(null), 8000);
    }

    if (currentCommand.trim() !== 'clear') {
      setCommandHistory(prev => [
        ...prev,
        {
          command: currentCommand,
          output,
          timestamp: new Date(),
          directory: directoryAtCommand,
        },
      ]);
    }

    setCurrentCommand('');
    setCommandIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const setCommandHistoryItem = (command: string, output: string) => {
      setCommandHistory(prev => [
        ...prev,
        {
          command,
          output,
          timestamp: new Date(),
          directory: currentDirectory,
        },
      ]);
    };

    // Tab
    if (e.key === 'Tab') {
      const filterItemsAndSetCommand = (lsArray: string[], keyToFilter: string, lastPartSliced?: string) => {
        const items = lsArray.filter(item => item.startsWith(keyToFilter));
        if (items.length === 0) {
          return;
        }
        if (items.length > 1) {
          setCommandHistoryItem(`${firstPartOfInputValue} ${lastPartOfInputValue}`, items.join(' '));
          return;
        }
        (e.target as HTMLInputElement).value =
          `${firstPartOfInputValue} ${lastPartSliced ? lastPartSliced : ''}${items[0]}`;
        setCurrentCommand(`${firstPartOfInputValue} ${lastPartSliced ? lastPartSliced : ''}${items[0]}`);
        return;
      };

      e.preventDefault();
      const inputValue = (e.target as HTMLInputElement).value;
      const firstPartOfInputValue = inputValue.split(' ').slice(0, -1).join(' ');
      const lastPartOfInputValue = inputValue.split(' ').slice(-1).join(' ');

      if (!firstPartOfInputValue) {
        // Complete by commands available
        const cmd = getCommandsByLevel(level).find(cmd => cmd.startsWith(lastPartOfInputValue));
        if (cmd) {
          (e.target as HTMLInputElement).value = `${cmd}`;
          setCurrentCommand(`${cmd}`);
          e.preventDefault();
          return;
        }
      } else {
        // Complete by directory available
        const lastPartSliced = lastPartOfInputValue.includes('/')
          ? lastPartOfInputValue.endsWith('/')
            ? lastPartOfInputValue
            : lastPartOfInputValue.split('/').slice(0, -1).join('/') + '/'
          : lastPartOfInputValue;
        const directoryToList = lastPartSliced.includes('/')
          ? lastPartSliced.startsWith('/')
            ? lastPartSliced
            : `${currentDirectory}/${lastPartSliced}`
          : currentDirectory;

        const lsOutput = executeCommand('ls', directoryToList, setCurrentDirectory, level);
        const lsArray = lsOutput.split(' ');

        // User didn't typed anything after the command, just listing the directory
        if (lastPartOfInputValue === '') {
          setCommandHistoryItem(`${firstPartOfInputValue} ${lastPartOfInputValue}`, lsOutput);
          e.preventDefault();
          return;
        }

        // User typed a path with a directory
        if (lastPartSliced.endsWith('/')) {
          const end = lastPartOfInputValue.split('/').slice(-1).join('/');
          if (end === '') {
            // The last directory that user typed ends with a slash
            setCommandHistoryItem(`${firstPartOfInputValue} ${lastPartOfInputValue}`, lsOutput);
            return;
          }
          // The last directory that user typed doesn't end with a slash
          filterItemsAndSetCommand(lsArray, end, lastPartSliced);
          return;
        }

        // User typed a path without a directory
        filterItemsAndSetCommand(lsArray, lastPartOfInputValue);
      }
      return;
    }

    // Ctrl + C
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setCommandHistoryItem(currentCommand + '^C', '');
      setCurrentCommand('');
      return;
    }

    // Arrow Up
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = commandIndex === -1 ? commandHistory.length - 1 : Math.max(0, commandIndex - 1);
        setCommandIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex].command);
      }
      return;
    }

    // Arrow Down
    if (e.key === 'ArrowDown') {
      if (commandIndex !== -1) {
        const newIndex = commandIndex + 1;
        if (newIndex >= commandHistory.length) {
          setCommandIndex(-1);
          setCurrentCommand('');
        } else {
          setCommandIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex].command);
        }
      }
      return;
    }
  };

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  // Format path for display (show ~ for /home/user)
  const formatPath = (path: string): string => {
    if (path === '/home/user') {
      return '~';
    }
    if (path.startsWith('/home/user/')) {
      return '~' + path.slice('/home/user'.length);
    }
    return path;
  };

  const sanitizeCssColor = (value: string): string | null => {
    const v = value.trim();
    if (/^[a-zA-Z]+$/.test(v)) return v.toLowerCase();
    if (/^#[0-9a-fA-F]{3}$/.test(v)) return v;
    if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
    if (/^#[0-9a-fA-F]{8}$/.test(v)) return v;
    return null;
  };

  const renderColorMarkup = (text: string) => {
    const re = /<color=([^>]+)>([\s\S]*?)<\/color>/g;
    const nodes: ReactNode[] = [];

    let last = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = re.exec(text)) !== null) {
      const start = match.index;
      const full = match[0] ?? '';
      const colorRaw = match[1] ?? '';
      const inner = match[2] ?? '';

      if (start > last) nodes.push(text.slice(last, start));

      const color = sanitizeCssColor(colorRaw);
      if (color) {
        nodes.push(
          <span key={`c-${key++}`} style={{ color }}>
            {inner}
          </span>,
        );
      } else {
        nodes.push(inner);
      }

      last = start + full.length;
    }

    if (last < text.length) nodes.push(text.slice(last));
    return nodes;
  };

  return (
    <div
      onClick={handleFocus}
      className={clsx(
        'bg-(--color-terminal-bg) text-(--color-primary-light) rounded-lg overflow-hidden shadow-2xl border border-(--color-surface-border) flex flex-col relative',
        maximized ? 'fixed inset-0 w-full h-full' : 'w-full sm:w-3/4 lg:w-1/2 4xl:w-1/3 h-[480px]',
        successPulse && 'border-green-500 border-2 terminal-success-pulse',
      )}
    >
      {toast?.visible && (
        <div className='absolute top-3 right-3 z-50'>
          <div className='px-3 py-2 rounded-md text-sm font-medium bg-green-600/90 text-white shadow-lg border border-green-300/40'>
            {toast.message}
          </div>
        </div>
      )}
      <div className='bg-(--color-terminal-header) px-4 py-2 flex items-center justify-between border-b border-(--color-surface-border) shrink-0'>
        <div className='flex items-center gap-2 cursor-pointer'>
          <div className='w-3 h-3 rounded-full bg-red-500'></div>
          <div className='w-3 h-3 rounded-full bg-yellow-500' onClick={() => setMaximized(!maximized)}></div>
          <div className='w-3 h-3 rounded-full bg-green-500'></div>
        </div>
        <div className='text-xs text-gray-400 font-mono whitespace-nowrap'>
          {t('terminal.terminalAt')}
          {machine}
        </div>
        <div className='w-16'></div>
      </div>

      <div
        ref={terminalRef}
        className='flex-1 min-h-0 overflow-y-auto p-4 font-mono text-sm cursor-text'
        style={{ fontFamily: 'var(--font-geist-mono)' }}
      >
        {!showWelcomeMessage && (
          <div className='mb-4'>
            <div className='text-(--color-primary-light)'>{t('terminal.welcome')}</div>
            <div className='text-(--color-text-secondary) mt-1'>{t('terminal.helpHint')}</div>
          </div>
        )}

        {commandHistory.map((item, index) => {
          const displayPath = formatPath(item.directory);
          return (
            <div key={index} className='mb-2'>
              <div className='flex items-center gap-2 whitespace-nowrap'>
                <span className='text-(--color-primary-light) whitespace-nowrap'>
                  {username}@{machine}
                </span>
                <span className='text-blue-400 whitespace-nowrap'>:</span>
                <span className='text-cyan-400 whitespace-nowrap'>{displayPath}</span>
                <span className='text-blue-400 whitespace-nowrap'>$</span>
                <span className='text-gray-300 ml-1 whitespace-nowrap'>{item.command}</span>
              </div>
              {item.output && (
                <div className='text-gray-300 mt-1 ml-0 whitespace-pre-wrap'>{renderColorMarkup(item.output)}</div>
              )}
            </div>
          );
        })}

        <form onSubmit={handleSubmit} className='flex items-center gap-2'>
          <div className='flex items-center gap-2 whitespace-nowrap'>
            <span className='text-green-400 whitespace-nowrap'>
              {username}@{machine}
            </span>
            <span className='text-blue-400 whitespace-nowrap'>:</span>
            <span className='text-cyan-400 whitespace-nowrap'>{formatPath(currentDirectory)}</span>
            <span className='text-blue-400 whitespace-nowrap'>$</span>
          </div>
          <input
            ref={inputRef}
            type='text'
            value={currentCommand}
            onChange={e => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className='flex-1 bg-transparent text-gray-300 outline-none caret-(--color-primary-light) whitespace-nowrap'
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}
