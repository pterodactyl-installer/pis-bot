import { RunFunction } from "../types/Event";

export const run: RunFunction = (bot, error) => {
  bot.logger.error(`An error has accured: ${error}`);
  console.error(error);
};
