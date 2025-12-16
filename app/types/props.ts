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
