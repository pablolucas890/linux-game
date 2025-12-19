import levelOneFileSystem from '../data/filesystems/levelOne.json';
import { defaultLocale, type Locale } from '../locales';
import ptBR from '../locales/pt-BR.json';
import { FileSystemNode } from '../types/props';

// Helper function to get translations (will be injected)
let getTranslation: ((key: string, params?: Record<string, string>) => string) | null = null;
let currentLocale: Locale = defaultLocale;

const getNestedValue = (obj: Record<string, unknown>, path: string): string => {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  return typeof current === 'string' ? current : path;
};

const replaceParams = (text: string, params?: Record<string, string>): string => {
  if (!params) return text;
  return Object.entries(params).reduce((acc, [key, value]) => acc.replace(`{${key}}`, value), text);
};

const t = (key: string, params?: Record<string, string>): string => {
  if (!getTranslation) {
    // Fallback to Portuguese if translation is not available
    const translation = getNestedValue(ptBR as Record<string, unknown>, key);
    return replaceParams(translation, params);
  }
  return getTranslation(key, params);
};

const normalizePath = (path: string, currentDir: string): string => {
  if (path.startsWith('~')) {
    path = '/home/user' + path.slice(1);
  }

  if (!path.startsWith('/')) {
    path = currentDir + '/' + path;
  }

  const parts = path.split('/').filter(p => p !== '' && p !== '.');
  const resolved: string[] = [];

  for (const part of parts) {
    if (part === '..') {
      if (resolved.length > 0) {
        resolved.pop();
      }
    } else {
      resolved.push(part);
    }
  }

  return '/' + resolved.join('/');
};

const getNodeByPath = (path: string, level: number): FileSystemNode | null => {
  const fileSystem: FileSystemNode = getFileSystemDataByLevel(level);
  const normalizedPath = normalizePath(path, '/');
  const parts = normalizedPath.split('/').filter(p => p !== '');

  if (parts.length === 0) {
    return fileSystem;
  }

  let currentNode: FileSystemNode | undefined = fileSystem;

  for (const part of parts) {
    if (!currentNode?.children || !currentNode.children[part]) {
      return null;
    }
    currentNode = currentNode.children[part];
  }

  return currentNode || null;
};

const isValidDirectory = (path: string, level: number): { valid: boolean; error?: string } => {
  const node = getNodeByPath(path, level);

  if (!node) {
    return { valid: false, error: t('commands.errors.cdNotFound', { path }) };
  }

  if (node.type === 'file') {
    return { valid: false, error: t('commands.errors.cdNotDirectory', { path }) };
  }

  return { valid: true };
};

const listDirectory = (path: string, cmd: string, level: number): string => {
  const node = getNodeByPath(path, level);

  if (!node) {
    return t('commands.errors.lsNotFound', { path });
  }

  if (node.type === 'file') {
    return t('commands.errors.lsIsFile', { path });
  }

  if (!node.children) {
    return '';
  }

  const items = Object.values(node.children)
    .map(
      item =>
        (cmd.startsWith('ls -l') ? `${item.createdAt} ` : '') +
        (item.type === 'directory' ? `${item.name}/` : item.name),
    )
    .sort((a, b) => {
      const aIsDir = a.endsWith('/');
      const bIsDir = b.endsWith('/');
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });

  return items.join(cmd.startsWith('ls -l') ? '\n' : '  ');
};

const getFileContent = (path: string, level: number): string => {
  const node = getNodeByPath(path, level);
  if (!node) {
    return t('commands.errors.catNotFound', { path });
  }
  if (node.type !== 'file') {
    return t('commands.errors.catIsDirectory', { path });
  }
  return (node as FileSystemNode & { content: string }).content || '';
};

const grepResult = (content: string, pattern: string, showLines: boolean): string => {
  return content
    .split('\n')
    .map((line, index) => (showLines ? `<color=green>${index + 1}</color>: ${line}` : line))
    .filter(line => line.toLowerCase().includes(pattern.toLowerCase()))
    .join('\n');
};

const getFileSystemDataByLevel = (level: number): FileSystemNode => {
  switch (level) {
    case 1:
      return levelOneFileSystem as unknown as FileSystemNode;
    default:
      return levelOneFileSystem as unknown as FileSystemNode;
  }
};

export const setTranslationFunction = (t: (key: string, params?: Record<string, string>) => string, locale: Locale) => {
  getTranslation = t;
  currentLocale = locale;
};

export const getCommandsByLevel = (level: number): string[] => {
  switch (level) {
    case 1:
      return ['help', 'clear', 'ls', 'pwd', 'whoami', 'date', 'echo', 'uname', 'cd', 'cat'];
    default:
      return ['help', 'clear', 'ls', 'pwd', 'whoami', 'date', 'echo', 'uname', 'cd', 'cat'];
  }
};

export const executeCommand = (
  cmd: string,
  currentDirectory: string,
  setCurrentDirectory: (directory: string) => void,
  level: number,
): string => {
  const generalCmd = cmd.trim().toLowerCase();
  const commandHasGrep = generalCmd.includes(' | grep ');
  const trimmedCmd = commandHasGrep ? (generalCmd.split(' | grep ')?.[0]?.trim() ?? '') : generalCmd;
  let result = '';

  if (!trimmedCmd) return '';

  if (trimmedCmd === 'help') {
    result = getCommandsByLevel(level)
      .map(command => t(`commands.help.${command}`))
      .join('\n');
  } else if (trimmedCmd === 'clear') {
    result = '';
  } else if (trimmedCmd === 'pwd') {
    result = currentDirectory;
  } else if (trimmedCmd === 'whoami') {
    result = t('common.username');
  } else if (trimmedCmd === 'date') {
    // Use locale based on current translation
    const localeString = currentLocale === 'pt-BR' ? 'pt-BR' : 'en-US';
    result = new Date().toLocaleString(localeString);
  } else if (trimmedCmd === 'uname') {
    result = `Linux game 6.12.57+deb13-amd64 #1 SMP PREEMPT x86_64 GNU/Linux`;
  } else if (trimmedCmd.startsWith('ls')) {
    if (trimmedCmd === 'ls' || trimmedCmd === 'ls -l' || trimmedCmd === 'ls -l .' || trimmedCmd === 'ls .') {
      result = listDirectory(currentDirectory, trimmedCmd, level);
    } else {
      const targetPath = trimmedCmd.split(' ')[trimmedCmd.split(' ').length - 1]?.trim() ?? '';
      const normalizedPath = normalizePath(targetPath, currentDirectory);
      result = listDirectory(normalizedPath, trimmedCmd, level);
    }
  } else if (trimmedCmd.startsWith('echo ')) {
    result = cmd.substring(5).trim() || '';
  } else if (trimmedCmd.startsWith('cd ')) {
    const targetPath = cmd.substring(3).trim();

    if (!targetPath || targetPath === '~') {
      const newDir = '/home/user';
      setCurrentDirectory(newDir);
      result = '';
    }

    const normalizedPath = normalizePath(targetPath, currentDirectory);

    const validation = isValidDirectory(normalizedPath, level);
    if (!validation.valid) {
      return validation.error || '';
    }

    setCurrentDirectory(normalizedPath);
    result = '';
  } else if (trimmedCmd === 'cd') {
    setCurrentDirectory('/home/user');
    result = '';
  } else if (trimmedCmd.startsWith('cat ')) {
    const targetPath = trimmedCmd.substring(4).trim();
    const normalizedPath = normalizePath(targetPath, currentDirectory);
    result = getFileContent(normalizedPath, level);
  } else result = t('commands.errors.notFound', { cmd });

  if (commandHasGrep) {
    let pattern = generalCmd.split(' | grep ')?.[1]?.trim();
    const showLines = pattern?.includes('-n');
    pattern = pattern?.replace('-n', '').trim();
    result = grepResult(result, pattern, showLines);
  }
  return result;
};
