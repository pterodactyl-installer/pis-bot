"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.name = void 0;
exports.name = 'message';
const run = async (client, message) => {
    var _a;
    if (message.author.bot || !message.guild)
        return; // Don't listen to bots and DM's
    // Checks if the bot was mentioned, with no message after it, returns the prefix.
    const prefixMention = new RegExp(`^<@!?${(_a = client.user) === null || _a === void 0 ? void 0 : _a.id}>( |)$`);
    if (message.content.match(prefixMention))
        return message.reply(`My prefix is \`${client.config.prefix}\``);
    let triggers = [];
    if (message.attachments.size > 0) {
        const promises = message.attachments.map(async (item) => {
            const text = await client.functions.parseImage(item);
            triggers = triggers.concat(client.functions.findTriggers(client, text.toLowerCase()));
        });
        await Promise.all(promises);
    }
    if (message.content.indexOf(client.config.prefix) === 0) {
        // Get command
        const command = message.content
            .slice(client.config.prefix.length)
            .trim()
            .split(/ +/g)[0]
            .toLowerCase();
        // Check whether the command, or alias, exist
        const trigger = client.commands.get(command) ||
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            client.commands.get(client.aliases.get(command));
        if (!trigger)
            return;
        triggers.push(trigger);
        triggers.forEach((v) => {
            client.logger(`${message.author.username} (${message.author.id}) ran command ${v.cmd}`, 'cmd');
        });
        message.channel.send(client.functions.formatTriggers(client, triggers));
    }
    else {
        triggers = triggers.concat(client.functions.findTriggers(client, message.content.toLowerCase()));
        if (triggers.length < 1)
            return;
        triggers.forEach((v) => {
            client.logger(`${message.author.username} (${message.author.id}) ran command ${v.cmd}`, 'cmd');
        });
        message.channel.send(client.functions.formatTriggers(client, triggers));
    }
};
exports.run = run;
