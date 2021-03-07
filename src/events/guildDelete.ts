import { Guild } from 'discord.js';
import { RunFunction } from '../interfaces/Event';
export const run: RunFunction = async (client, guild: Guild) => {
    if (!guild.available) return; // If there is an outage, return.
    client.logger.cmd(
        `[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`,
    );
};
