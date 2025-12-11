import fileSystemData from "../../data/filesystem.json";
import type { Locale } from "../locales";
import ptBR from "../locales/pt-BR.json";
import { FileSystemNode } from "../types/props";

const fileSystem: FileSystemNode = fileSystemData as unknown as FileSystemNode;

// Helper function to get translations (will be injected)
let getTranslation: ((key: string, params?: Record<string, string>) => string) | null = null;
let currentLocale: Locale = "pt-BR";

export const setTranslationFunction = (t: (key: string, params?: Record<string, string>) => string, locale: Locale) => {
  getTranslation = t;
  currentLocale = locale;
};

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  
  return typeof current === "string" ? current : path;
}

function replaceParams(text: string, params?: Record<string, string>): string {
  if (!params) return text;
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`{${key}}`, value),
    text
  );
}

const t = (key: string, params?: Record<string, string>): string => {
  if (!getTranslation) {
    // Fallback to Portuguese if translation is not available
    const translation = getNestedValue(ptBR as Record<string, unknown>, key);
    return replaceParams(translation, params);
  }
  return getTranslation(key, params);
};

export const normalizePath = (path: string, currentDir: string): string => {
  if (path.startsWith("~")) {
    path = "/home/user" + path.slice(1);
  }

  if (!path.startsWith("/")) {
    path = currentDir + "/" + path;
  }

  const parts = path.split("/").filter((p) => p !== "" && p !== ".");
  const resolved: string[] = [];

  for (const part of parts) {
    if (part === "..") {
      if (resolved.length > 0) {
        resolved.pop();
      }
    } else {
      resolved.push(part);
    }
  }

  return "/" + resolved.join("/");
};

export const getNodeByPath = (path: string): FileSystemNode | null => {
  const normalizedPath = normalizePath(path, "/");
  const parts = normalizedPath.split("/").filter((p) => p !== "");

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

export const isValidDirectory = (path: string): { valid: boolean; error?: string } => {
  const node = getNodeByPath(path);

  if (!node) {
    return { valid: false, error: t("commands.errors.cdNotFound", { path }) };
  }

  if (node.type === "file") {
    return { valid: false, error: t("commands.errors.cdNotDirectory", { path }) };
  }

  return { valid: true };
};

export const listDirectory = (path: string, cmd?: string): string => {
  const node = getNodeByPath(path);

  if (!node) {
    return t("commands.errors.lsNotFound", { path });
  }

  if (node.type === "file") {
    return t("commands.errors.lsIsFile", { path });
  }

  if (!node.children) {
    return "";
  }

  const items = Object.values(node.children)
    .map((item) => ((cmd === 'ls -l' ? `${item.createdAt} ` : '') + (item.type === "directory" ? `${item.name}/` : item.name)))
    .sort((a, b) => {
      const aIsDir = a.endsWith("/");
      const bIsDir = b.endsWith("/");
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });

  return items.join(cmd === 'ls -l' ? '\n' : '  ');
};

export const getFileContent = (path: string): string => {
  const node = getNodeByPath(path);
  if (!node) {
    return t("commands.errors.catNotFound", { path });
  }
  if (node.type !== "file") {
    return t("commands.errors.catIsDirectory", { path });
  }
  return (node as FileSystemNode & { content: string }).content || "";
};

export const grepResult = (content: string, pattern: string): string => {
  return content.split("\n").filter((line) => line.toLowerCase().includes(pattern.toLowerCase())).join("\n");
};

export const executeCommand = (cmd: string, currentDirectory: string, setCurrentDirectory: (directory: string) => void): string => {
  const trimmedCmd = cmd.trim().toLowerCase();

  if (!trimmedCmd) return "";

  if (trimmedCmd === "help") {
    return `${t("commands.help.title")}
${t("commands.help.help")}
${t("commands.help.clear")}
${t("commands.help.ls")}
${t("commands.help.pwd")}
${t("commands.help.whoami")}
${t("commands.help.date")}
${t("commands.help.echo")}
${t("commands.help.uname")}
${t("commands.help.cd")}
${t("commands.help.cat")}`;
  }
  else if (trimmedCmd === "clear") {
    return "";
  }
  else if (trimmedCmd.startsWith("ls")) {
    const commandHasGrep = trimmedCmd.includes(" | grep ");
    const cmd = commandHasGrep ? trimmedCmd.split(" | grep ")[0].trim() : trimmedCmd;

    const result = listDirectory(currentDirectory, cmd);

    if (commandHasGrep) {
      const pattern = trimmedCmd.split(" | grep ")?.[1];
      return grepResult(result, pattern);
    }
    return result;
  }
  else if (trimmedCmd === "pwd") {
    return currentDirectory;
  }
  else if (trimmedCmd === "whoami") {
    return t("common.username");
  }
  else if (trimmedCmd === "date") {
    // Use locale based on current translation
    const localeString = currentLocale === "en" ? "en-US" : currentLocale;
    return new Date().toLocaleString(localeString);
  }
  else if (trimmedCmd === "uname") {
    return `Linux game 6.12.57+deb13-amd64 #1 SMP PREEMPT x86_64 GNU/Linux`;
  }
  else if (trimmedCmd.startsWith("ls ")) {
    const targetPath = cmd.substring(3).trim();
    const normalizedPath = normalizePath(targetPath, currentDirectory);
    return listDirectory(normalizedPath);
  }
  else if (trimmedCmd.startsWith("echo ")) {
    return cmd.substring(5).trim() || "";
  }
  else if (trimmedCmd.startsWith("cd ")) {
    const targetPath = cmd.substring(3).trim();
    
    if (!targetPath || targetPath === "~") {
      const newDir = "/home/user";
      setCurrentDirectory(newDir);
      return "";
    }

    const normalizedPath = normalizePath(targetPath, currentDirectory);
    
    const validation = isValidDirectory(normalizedPath);
    if (!validation.valid) {
      return validation.error || "";
    }

    setCurrentDirectory(normalizedPath);
    return "";
  }
  else if (trimmedCmd === "cd") {
    setCurrentDirectory("/home/user");
    return "";
  }
  else if (trimmedCmd.startsWith("cat ")) {
    const commandHasGrep = trimmedCmd.includes(" | grep ");
    const cmd = commandHasGrep ? trimmedCmd.split(" | grep ")[0].trim() : trimmedCmd;

    const targetPath = cmd.substring(4).trim();
    const normalizedPath = normalizePath(targetPath, currentDirectory);
    const result = getFileContent(normalizedPath);

    if (commandHasGrep) {
      console.log(trimmedCmd)
      const pattern = trimmedCmd.split(" | grep ")?.[1];
      return grepResult(result, pattern);
    }
    return result;
  }
  else {
    return t("commands.errors.notFound", { cmd });
  }
};