import { ColorResolvable } from "discord.js";

export interface Config {
  token: string;
  prefix: string;
  embedColor: ColorResolvable;
  version: () => Promise<string>;
}
