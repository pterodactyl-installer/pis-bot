import { Message } from "discord.js";
import { RunFunction } from "../interfaces/Event";
import { Trigger } from "../interfaces/Trigger";

export const run: RunFunction = async (client, message: Message) => {
  if (message.author.bot || !message.guild) return; // Don't listen to bots and DM's

  // Checks if the bot was mentioned, with no message after it, returns the prefix.
  const prefixMention = new RegExp(`^<@!?${client.user?.id}>( |)$`);
  if (message.content.match(prefixMention))
    return message.reply(`My prefix is \`${client.config.prefix}\``);

  let triggers: Trigger[] = [];
  if (message.attachments.size > 0) {
    const photoExtensions = ["png", "jpeg", "jpg"];
    await Promise.all(
      message.attachments.map(async (item) => {
        let photo = false;
        let text = "";
        photoExtensions.forEach((ext) => {
          if (item.url.endsWith(ext)) {
            photo = true;
          }
        });
        if (photo) {
          text = await client.functions.parseImage(item.url);
        } else {
          text = await client.functions.fetchLog(client, item.url);
        }
        triggers = triggers.concat(
          client.functions.findTriggers(client, text.toLowerCase())
        );
      })
    );
  }
  if (message.content.indexOf(client.config.prefix) === 0) {
    // Get command
    const command = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(/ +/g)[0]
      .toLowerCase();
    // Check whether the command, or alias, exist
    const trigger =
      client.commands.get(command) ||
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      client.commands.get(client.aliases.get(command)!);
    if (!trigger) return;
    triggers.push(trigger);
    triggers.forEach((v) => {
      client.logger.cmd(
        `${message.author.username} (${message.author.id}) ran command ${v.cmd}`
      );
    });
    message.channel.send(client.functions.formatTriggers(client, triggers));
  } else {
    triggers = triggers.concat(
      client.functions.findTriggers(client, message.content.toLowerCase())
    );
    if (triggers.length < 1) return;
    triggers.forEach((v) => {
      client.logger.cmd(
        `${message.author.username} (${message.author.id}) ran command ${v.cmd}`
      );
    });
    message.channel.send(client.functions.formatTriggers(client, triggers));
  }
};
