import fetch from "node-fetch";
import { MessageEmbed } from "discord.js";
import { Trigger } from "../interfaces/Trigger";
import { createWorker } from "tesseract.js";
import { Bot } from "../client/Client";
import { Event } from "../interfaces/Event";

export class Functions {
  /* Loading triggers */
  public async loadTrigger(client: Bot, trigger: Trigger): Promise<void> {
    try {
      client.logger.log(`Loading Trigger: ${trigger.cmd}`);
      client.commands.set(trigger.cmd, trigger);
      if (trigger.aliases) {
        trigger.aliases.map((alias) => {
          client.aliases.set(alias, trigger.cmd);
        });
      }
      if (trigger.keys) {
        trigger.keys.map((key) => {
          client.keys.set(key, trigger.cmd);
        });
      }
    } catch (e) {
      client.logger.error(`Unable to load trigger ${trigger.cmd}`);
      console.error(e);
    }
  }
  /* Loading events */
  public async loadEvent(client: Bot, eventName: string): Promise<void> {
    try {
      client.logger.log(`Loading Event: ${eventName}`);
      const event: Event = await import(`../events/${eventName}`);
      client.on(eventName, event.run.bind(null, client));
    } catch (e) {
      client.logger.error(`Unable to load event ${eventName}`);
      console.error(e);
    }
  }
  /*
  FIND-TRIGGERS
  Parse text given and give back triggers which it should trigger.
  */
  public findTriggers(client: Bot, text: string): Trigger[] {
    const triggers: Trigger[] = [];
    const filterCollection = client.keys.filter((v, k) => {
      return text.includes(k);
    });
    filterCollection.forEach((v) => {
      const trigger = client.commands.get(v);
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
  public formatTriggers(client: Bot, triggers: Trigger[]): MessageEmbed {
    const embed = client.embed({
      title: "Pterodactyl Installation Script",
    });
    if (triggers.length === 1) {
      embed.description = triggers[0].lines.join("\n");
    } else {
      triggers.forEach((trigger, i) => {
        embed.fields.push({
          name: `${i + 1}`,
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
  public async fetchLog(client: Bot, url: string): Promise<string> {
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
      client.logger.error(`There has been an error: ${err}`);
      console.error(err);
      return "";
    }
  }
}
