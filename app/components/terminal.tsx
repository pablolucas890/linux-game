"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "../contexts/i18n";
import { CommandHistory } from "../types/props";
import { executeCommand, setTranslationFunction } from "../utils/functions";

interface TerminalProps {
  username: string;
  machine: string;
}
export function Terminal({ username, machine }: TerminalProps) {
  const { t } = useI18n();
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [commandIndex, setCommandIndex] = useState(-1);
  const [currentDirectory, setCurrentDirectory] = useState("/home/user");
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
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

    if (currentCommand.trim() === "clear") {
      setShowWelcomeMessage(true);
      setCommandHistory([]);
    }

    const output = executeCommand(currentCommand, currentDirectory, setCurrentDirectory);

    if (currentCommand.trim() !== "clear") {
      setCommandHistory((prev) => [
        ...prev,
        {
          command: currentCommand,
          output,
          timestamp: new Date(),
          directory: directoryAtCommand,
        },
      ]);
    }

    setCurrentCommand("");
    setCommandIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      const ls = executeCommand("ls", currentDirectory, setCurrentDirectory);
      const inputValue = (e.target as HTMLInputElement).value;
      const inputValueArray = inputValue.split(" ");
      const firstPartOfInputValue = inputValueArray.slice(0, -1).join(" ");
      const lastPartOfInputValue = inputValueArray.slice(-1).join(" ");
      const lsArray = ls.split(" ");
      for (const item of lsArray) {
        if (item.startsWith(lastPartOfInputValue)) {
          (e.target as HTMLInputElement).value = `${firstPartOfInputValue} ${item}`;
          setCurrentCommand(`${firstPartOfInputValue} ${item}`);
          break;
        }
      }
      e.preventDefault();
      return;
    }
    // Ctrl + C
    if (e.ctrlKey && e.key === "c") {
      setCommandHistory((prev) => [
        ...prev,
        {
          command: currentCommand + "^C",
          output: "",
          timestamp: new Date(),
          directory: currentDirectory,
        },
      ]);
      setCurrentCommand('');
      e.preventDefault();
      return;
    }
    
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = commandIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, commandIndex - 1);
        setCommandIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex].command);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandIndex !== -1) {
        const newIndex = commandIndex + 1;
        if (newIndex >= commandHistory.length) {
          setCommandIndex(-1);
          setCurrentCommand("");
        } else {
          setCommandIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex].command);
        }
      }
    }
  };

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  // Format path for display (show ~ for /home/user)
  const formatPath = (path: string): string => {
    if (path === "/home/user") {
      return "~";
    }
    if (path.startsWith("/home/user/")) {
      return "~" + path.slice("/home/user".length);
    }
    return path;
  };

  
  return (
    <div onClick={handleFocus} className="w-full sm:w-3/4 lg:w-1/2 4xl:w-1/3 bg-neutral-900 text-green-400 rounded-lg overflow-hidden shadow-2xl border border-gray-700 cursor-text">
      <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-gray-400 font-mono whitespace-nowrap">{t("terminal.terminalAt")}{machine}</div>
        <div className="w-16"></div>
      </div>

      <div
        ref={terminalRef}
        className="h-[440px] overflow-y-auto p-4 font-mono text-sm"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        {!showWelcomeMessage && (
          <div className="mb-4">
            <div className="text-green-400">
              {t("terminal.welcome")}
            </div>
            <div className="text-gray-400 mt-1">
              {t("terminal.helpHint")}
            </div>
          </div>
        )}

        {commandHistory.map((item, index) => {
          const displayPath = formatPath(item.directory);
          return (
            <div key={index} className="mb-2">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-green-400 whitespace-nowrap">{username}@{machine}</span>
                <span className="text-blue-400 whitespace-nowrap">:</span>
                <span className="text-cyan-400 whitespace-nowrap">{displayPath}</span>
                <span className="text-blue-400 whitespace-nowrap">$</span>
                <span className="text-gray-300 ml-1 whitespace-nowrap">{item.command}</span>
              </div>
              {item.output && (
                <div className="text-gray-300 mt-1 ml-0 whitespace-pre-wrap">
                  {item.output}
                </div>
              )}
            </div>
          );
        })}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-green-400 whitespace-nowrap">{username}@{machine}</span>
            <span className="text-blue-400 whitespace-nowrap">:</span>
            <span className="text-cyan-400 whitespace-nowrap">{formatPath(currentDirectory)}</span>
            <span className="text-blue-400 whitespace-nowrap">$</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-gray-300 outline-none caret-green-400 whitespace-nowrap"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}