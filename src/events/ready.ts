import { RunFunction } from "../types/Event";

export const run: RunFunction = async (bot) => {
  const client = bot.discordClient;
  bot.logger.ready(
    `${client.user?.tag}@${bot.version}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`
  );
  client.user?.setActivity(`/help`, {
    type: "PLAYING",
  });
};
