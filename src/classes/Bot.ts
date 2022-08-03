import {
  Client,
  Collection,
  GatewayIntentBits,
  EmbedBuilder,
  EmbedData,
} from "discord.js";
import { readdir } from "fs";
import { promisify } from "util";
import { Functions } from "../modules/Functions";
import { handleExceptions } from "../modules/handleExceptions";
import { Logger } from "../modules/Logger";
import { Config } from "../types/Config";
import { triggers } from "../config/triggers";
import { Trigger } from "../types/Trigger";

const readAsyncDir = promisify(readdir);

export class Bot {
  constructor(public readonly config: Config) {}
  public discordClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });
  public triggers: Collection<string, Trigger> = new Collection();
  public aliases: Collection<string, string> = new Collection();
  public keys: Collection<string, string> = new Collection();
  public logger = new Logger();
  public functions = new Functions(this);
  public version = "canary";
  public start = async (): Promise<void> => {
    handleExceptions(this);

    this.version = await this.config.version();

    const eventFiles = await readAsyncDir(`${__dirname}/../events`);
    eventFiles.forEach((event: string) =>
      this.functions.loadEvent(event.split(".")[0])
    );
    triggers.forEach((trigger) => this.functions.loadTrigger(trigger));
    await this.discordClient.login(this.config.token);
    await this.discordClient.guilds.fetch();
    const guilds = this.discordClient.guilds.cache.map((guild) => guild);
    await this.functions.registerSlashCommands(triggers, guilds);
  };
  public embed(data: EmbedData): EmbedBuilder {
    return new EmbedBuilder(data)
      .setColor(this.config.embedColor)
      .setFooter({ text: `pterodactyl-installer/pis-bot@${this.version}` })
      .setTimestamp(new Date());
  }
}
