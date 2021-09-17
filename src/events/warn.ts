import { RunFunction } from "../types/Event";

export const run: RunFunction = async (bot, warn) => {
  bot.logger.warn(`A warning has accured: ${warn}`);
  console.warn(warn);
};
