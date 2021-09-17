import { Interaction } from "discord.js";
import { RunFunction } from "../types/Event";

export const run: RunFunction = async (bot, interaction: Interaction) => {
  if (interaction.isCommand()) {
    if (!interaction.guild) return;
    const { commandName } = interaction;

    const trigger = bot.triggers.get(commandName);

    if (!trigger) return;

    bot.logger.cmd(
      `${interaction.user.username} (${interaction.user.id}) ran command ${trigger.cmd}`
    );

    interaction.reply({ embeds: [bot.functions.formatTriggers([trigger])] });
  }
};
