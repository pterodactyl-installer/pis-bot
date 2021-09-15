import { Guild } from "discord.js";
import { RunFunction } from "../types/Event";

export const run: RunFunction = async (bot, guild: Guild) => {
  const guildOwner = await guild.fetchOwner();
  bot.logger.cmd(
    `[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guildOwner.user.username} (${guildOwner.id})`
  );
};
