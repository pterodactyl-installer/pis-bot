import fetch from "node-fetch";
import { MessageEmbed } from "discord.js";
import { Trigger } from "../interfaces/Trigger";
import { createWorker } from "tesseract.js";
import { Bot } from "../client/Client";
import { Event } from "../interfaces/Event";

export class Functions {
  constructor(private readonly client: Bot) {}
  /* Loading triggers */
  public async loadTrigger(trigger: Trigger): Promise<void> {
    try {
      this.client.logger.log(`Loading Trigger: ${trigger.cmd}`);
      this.client.commands.set(trigger.cmd.toLowerCase(), trigger);
      if (trigger.aliases) {
        trigger.aliases.map((alias) => {
          this.client.aliases.set(alias.toLowerCase(), trigger.cmd);
        });
      }
      if (trigger.keys) {
        trigger.keys.map((key) => {
          this.client.keys.set(key.toLowerCase(), trigger.cmd);
        });
      }
    } catch (e) {
      this.client.logger.error(`Unable to load trigger ${trigger.cmd}`);
      console.error(e);
    }
  }
  /* Loading events */
  public async loadEvent(eventName: string): Promise<void> {
    try {
      this.client.logger.log(`Loading Event: ${eventName}`);
      const event: Event = await import(`../events/${eventName}`);
      this.client.on(eventName, event.run.bind(null, this.client));
    } catch (e) {
      this.client.logger.error(`Unable to load event ${eventName}`);
      console.error(e);
    }
  }
  /*
  FIND-TRIGGERS
  Parse text given and give back triggers which it should trigger.
  */
  public findTriggers(text: string): Trigger[] {
    const triggers: Trigger[] = [];
    const filterCollection = this.client.keys.filter((v, k) => {
      return text.includes(k);
    });
    filterCollection.forEach((v) => {
      const trigger = this.client.commands.get(v);
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
    const embed = this.client.embed({});
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
    await worker.terminate();
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
        return rawData.text();
      } else {
        return "";
      }
    } catch (err) {
      this.client.logger.error(`There has been an error: ${err}`);
      console.error(err);
      return "";
    }
  }
}
