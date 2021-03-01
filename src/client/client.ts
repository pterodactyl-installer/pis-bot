import {
    Client,
    MessageEmbed,
    MessageEmbedOptions,
    Intents,
    Collection,
} from 'discord.js';
import { promisify } from 'util';
import { Event } from '../interfaces/Event';
import { Config } from '../interfaces/Config';
import { Logger } from '../modules/logger';
import { triggers } from '../config/triggers';
import { Trigger } from '../interfaces/Trigger';
import Functions from '../modules/functions';
import glob from 'glob';

const globPromise = promisify(glob);

export default class Bot extends Client {
    public constructor(public config: Config) {
        super({ ws: { intents: Intents.NON_PRIVILEGED } });
    }
    public commands: Collection<string, Trigger> = new Collection();
    public aliases: Collection<string, string> = new Collection();
    public keys: Collection<string, string> = new Collection();
    public logger = Logger;
    public functions = Functions;
    public async start(): Promise<void> {
        this.login(this.config.token);
        const eventFiles = await globPromise(`${__dirname}/../events/*.js`);
        eventFiles.map(async (eventFile: string) => {
            const ev = (await import(eventFile)) as Event;
            this.logger(`Loading Event: ${ev.name}`);
            this.on(ev.name, ev.run.bind(null, this));
        });
        triggers.map(async (trigger) => {
            this.logger(`Loading Trigger: ${trigger.cmd}`);
            this.commands.set(trigger.cmd, trigger);
            if (trigger.aliases) {
                trigger.aliases.map((alias) => {
                    this.aliases.set(alias, trigger.cmd);
                });
            }
            if (trigger.keys) {
                trigger.keys.map((key) => {
                    this.keys.set(key, trigger.cmd);
                });
            }
        });
    }
    public embed(data: MessageEmbedOptions): MessageEmbed {
        return new MessageEmbed({
            ...data,
            color: this.config.embedColor,
            footer: { text: 'Created by Sam1370. Maintained by Linux123123' },
            timestamp: new Date(),
        });
    }
}
