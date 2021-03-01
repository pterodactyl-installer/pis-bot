"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.name = void 0;
exports.name = 'guildCreate';
const run = (client, guild) => {
    var _a, _b;
    client.logger(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${(_a = guild.owner) === null || _a === void 0 ? void 0 : _a.user.tag} (${(_b = guild.owner) === null || _b === void 0 ? void 0 : _b.user.id}), 'cmd`);
};
exports.run = run;
