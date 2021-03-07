import {
    Client,
    MessageEmbed,
    MessageEmbedOptions,
    Intents,
    Collection,
} from 'discord.js';
import { readdir } from 'fs';
import { promisify } from 'util';
import { Config } from '../interfaces/Config';
import { Logger } from '../modules/Logger';
import { triggers } from '../config/triggers';
import { Trigger } from '../interfaces/Trigger';
import { Functions } from '../modules/Functions';
import { handleExceptions } from '../modules/handleExceptions';

const readAsyncDir = promisify(readdir);

export class Bot extends Client {
    public constructor(public readonly config: Config) {
        super({ ws: { intents: Intents.NON_PRIVILEGED } });
    }
    public commands: Collection<string, Trigger> = new Collection();
    public aliases: Collection<string, string> = new Collection();
    public keys: Collection<string, string> = new Collection();
    public logger = new Logger();
    public functions = new Functions();
    public async start(): Promise<void> {
        handleExceptions(this);
        this.login(this.config.token);
        const eventFiles = await readAsyncDir(`${__dirname}/../events`);
        eventFiles.forEach((event: string) =>
            this.functions.loadEvent(this, event.split('.')[0]),
        );
        triggers.forEach((trigger) =>
            this.functions.loadTrigger(this, trigger),
        );
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
