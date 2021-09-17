import { Config } from "../types/Config";
import { config as dotenv } from "dotenv";
import { ColorResolvable } from "discord.js";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

dotenv();

export const config: Config = {
  // Your Bot's Token. Available on https://discord.com/developers/applications/me
  token: process.env.TOKEN ?? "TOKEN",
  // Your Bot's prefix. Different from / (I think)
  prefix: process.env.PREFIX ?? "!",
  // Your Bot's embed color. HTML color
  embedColor: (process.env.EMBED_COLOR as ColorResolvable) ?? "BLUE",
  // pis-bot version
  version: async () => {
    try {
      const { stdout } = await execAsync("git rev-parse --short HEAD");
      return stdout.trim();
    } catch (e) {
      console.error(e);
      return "canary";
    }
  },
};
