export interface Trigger {
  cmd: string;
  description?: string;
  notSlashCmd?: boolean;
  aliases?: string[];
  keys?: string[];
  lines: string[];
}
