export interface Trigger {
    cmd: string;
    description?: string;
    aliases?: string[];
    keys?: string[];
    lines: string[];
}
