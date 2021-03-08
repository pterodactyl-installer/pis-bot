import { RunFunction } from '../interfaces/Event';
export const run: RunFunction = async (client) => {
    client.logger.ready(
        `${client.user?.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`
    );
    client.user?.setActivity(`${client.config.prefix}help`, {
        type: 'PLAYING',
    });
};
