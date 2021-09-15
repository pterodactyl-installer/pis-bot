import { Config } from "../types/Config";
import { config as dotenv } from "dotenv";
import simpleGit from "simple-git";
import { ColorResolvable } from "discord.js";

const git = simpleGit();

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
      return await git.revparse("HEAD", { "--short": null });
    } catch (e) {
      console.error(e);
      return "canary";
    }
  },
};
