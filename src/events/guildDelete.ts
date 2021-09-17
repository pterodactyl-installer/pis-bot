import { Guild } from "discord.js";
import { RunFunction } from "../types/Event";

export const run: RunFunction = async (bot, guild: Guild) => {
  if (!guild.available) return; // If there is an outage, return.
  bot.logger.cmd(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);
};
