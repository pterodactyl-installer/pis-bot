import { Guild } from "discord.js";
import { RunFunction } from "../interfaces/Event";
export const run: RunFunction = async (client, guild: Guild) => {
  await guild.fetch();
  client.logger.cmd(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot.`);
};
