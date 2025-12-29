export interface FileSystemNode {
  createdAt: string;
  type: 'directory' | 'file';
  name: string;
  content?: string;
  children?: { [key: string]: FileSystemNode };
}

export interface CommandHistory {
  command: string;
  output: string;
  timestamp: Date;
  directory: string;
}

export interface OutputCommandTestArray {
  command: string[];
  directory: string[];
  output: string[];
}

export interface OutputCommandTest {
  command: string;
  directory: string;
  output: string;
}

export type TypeWriterStage = 'one' | 'two' | 'three';

export type LevelId = 1;

export interface TypeWriterStageConfig {
  id: TypeWriterStage;
  texts: string[];
  nextStage: TypeWriterStage;
  gif?: string;
}
