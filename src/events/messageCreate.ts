import { Message, MessageAttachment } from "discord.js";
import { Readable } from "stream";
import { RunFunction } from "../types/Event";
import { Trigger } from "../types/Trigger";

export const run: RunFunction = async (bot, message: Message) => {
  if (message.author.bot || !message.guild) return; // Don't listen to bots and DM's

  // Checks if the bot was mentioned, with no message after it, returns the prefix.
  const prefixMention = new RegExp(`^<@!?${bot.discordClient.user?.id}>( |)$`);
  if (message.content.match(prefixMention))
    return message.reply(`My prefix is \`${bot.config.prefix}\``);

  let triggers: Trigger[] = [];
  const files: MessageAttachment[] = [];
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
        if (photo) text = await bot.functions.parseImage(item.url);
        triggers = triggers.concat(
          bot.functions.findTriggers(text.toLowerCase())
        );
      })
    );
  }
  if (message.content.indexOf(bot.config.prefix) === 0) {
    // Get command
    const command = message.content
      .slice(bot.config.prefix.length)
      .trim()
      .split(/ +/g)[0]
      .toLowerCase();
    // Check whether the command, or alias, exist
    const trigger =
      bot.triggers.get(command) ||
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      bot.triggers.get(bot.aliases.get(command)!);
    if (trigger) triggers.push(trigger);
  } else {
    triggers = triggers.concat(
      bot.functions.findTriggers(message.content.toLowerCase())
    );
    const RegExp = /(https?:\/\/bin.ptdl.co\/([^\s]+))/g;
    const url = message.content.match(RegExp);
    if (url) {
      const text = await bot.functions.fetchLog(url[0]);
      const stream = new Readable();
      stream.push(text);
      stream.push(null);
      files.push(new MessageAttachment(stream, "log.txt"));
      triggers.push({ cmd: "fetch logs", lines: [" "] });
    }
  }
  if (triggers.length < 1) return;
  triggers.forEach((v) => {
    bot.logger.cmd(
      `${message.author.username} (${message.author.id}) ran command ${v.cmd}`
    );
  });
  message.channel.send({
    embeds: [bot.functions.formatTriggers(triggers)],
    files: files,
  });
};
