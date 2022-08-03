export interface Config {
  token: string;
  prefix: string;
  embedColor: number;
  version: () => Promise<string>;
}
