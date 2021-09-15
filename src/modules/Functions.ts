import fetch from "node-fetch";
import { MessageEmbed } from "discord.js";
import { REST } from "@discordjs/rest";
import { Trigger } from "../types/Trigger";
import { createWorker } from "tesseract.js";
import { Bot } from "../classes/Bot";
import { Event } from "../types/Event";
import { Routes } from "discord-api-types/v9";
import { SlashCommandBuilder } from "@discordjs/builders";

export class Functions {
  constructor(private readonly bot: Bot) {}
  /* Loading triggers */
  public async loadTrigger(trigger: Trigger): Promise<void> {
    try {
      this.bot.logger.log(`Loading Trigger: ${trigger.cmd}`);
      this.bot.triggers.set(trigger.cmd.toLowerCase(), trigger);
      if (trigger.aliases) {
        trigger.aliases.map((alias) => {
          this.bot.aliases.set(alias.toLowerCase(), trigger.cmd);
        });
      }
      if (trigger.keys) {
        trigger.keys.map((key) => {
          this.bot.keys.set(key.toLowerCase(), trigger.cmd);
        });
      }
    } catch (e) {
      this.bot.logger.error(`Unable to load trigger ${trigger.cmd}`);
      console.error(e);
    }
  }
  /* Loading events */
  public async loadEvent(eventName: string): Promise<void> {
    try {
      this.bot.logger.log(`Loading Event: ${eventName}`);
      const event: Event = await import(`../events/${eventName}`);
      this.bot.discordClient.on(eventName, event.run.bind(null, this.bot));
    } catch (e) {
      this.bot.logger.error(`Unable to load event ${eventName}`);
      console.error(e);
    }
  }
  /* Registering slash commands */
  public async registerSlashCommands(
    triggers: Trigger[],
    guildId: string[]
  ): Promise<void> {
    try {
      triggers = triggers.filter((trigger) => !trigger.notSlashCmd);
      const slashCommands = triggers.map((trigger) => {
        return new SlashCommandBuilder()
          .setName(trigger.cmd)
          .setDescription(trigger.description ?? "____")
          .toJSON();
      });
      const rest = new REST({ version: "9" }).setToken(this.bot.config.token);
      await Promise.all(
        guildId.map(async (id) => {
          await rest.put(
            Routes.applicationGuildCommands(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this.bot.discordClient.user!.id,
              id
            ),
            {
              body: slashCommands,
            }
          );
        })
      );

      this.bot.logger.ready(`Successfully registered slash commands`);
    } catch (e) {
      this.bot.logger.error(`Unable to register commands`);
      console.error(e);
    }
  }
  /*
  FIND-TRIGGERS
  Parse text given and give back triggers which it should trigger.
  */
  public findTriggers(text: string): Trigger[] {
    const triggers: Trigger[] = [];
    const filterCollection = this.bot.keys.filter((v, k) => {
      return text.includes(k);
    });
    filterCollection.forEach((v) => {
      const trigger = this.bot.triggers.get(v);
      if (trigger && !triggers.includes(trigger)) {
        triggers.push(trigger);
      }
    });
    return triggers;
  }
  /*
  FORMAT-TRIGGERS
  Creates a Message Embed from given triggers.
  */
  public formatTriggers(triggers: Trigger[]): MessageEmbed {
    const embed = this.bot.embed({});
    if (triggers.length === 1) {
      embed.description = triggers[0].lines.join("\n");
    } else {
      triggers.forEach((trigger, i) => {
        embed.fields.push({
          name: `Issue ${i + 1}`,
          value: trigger.lines.join("\n"),
          inline: false,
        });
      });
    }
    return embed;
  }
  /*
  PARSE-IMAGE
  Parses an image and gives back text
  */
  public async parseImage(url: string): Promise<string> {
    const worker = createWorker({
      langPath: `${__dirname}/../../eng.traineddata`,
    });
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(url);
    worker.terminate();
    return text;
  }
  /*
  FETCH-LOG
  Fetches log file and returns it's text
  */
  public async fetchLog(url: string): Promise<string> {
    try {
      const rawData = await fetch(url, {
        method: "GET",
        headers: {
          responseEncoding: "utf8",
          Accept: "text/html",
        },
      });
      if (rawData.ok) {
        return await rawData.text();
      } else {
        return "";
      }
    } catch (err) {
      this.bot.logger.error(`There has been an error: ${err}`);
      console.error(err);
      return "";
    }
  }
}
