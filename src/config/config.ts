import { Config } from "../interfaces/Config";
import { config as dotenv } from "dotenv";

dotenv();

export const config: Config = {
  // Your Bot's Token. Available on https://discord.com/developers/applications/me
  token: process.env.TOKEN ? process.env.TOKEN : "TOKEN",
  // Your Bot's prefix.
  prefix: process.env.PREFIX ? process.env.PREFIX : "PREFIX",
  // Your Bot's embed color. HTML color
  embedColor: process.env.EMBED_COLOR ? process.env.EMBED_COLOR : "#4f86f7",
  // pis-bot version
  version: "development",
};
