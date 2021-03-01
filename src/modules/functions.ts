import { MessageAttachment, MessageEmbed } from 'discord.js';
import { Trigger } from '../interfaces/Trigger';
import { createWorker } from 'tesseract.js';
import Bot from '../client/client';

export default {
    /*
    FIND-TRIGGERS
    Parse text given and give back triggers which it should trigger.
    */
    findTriggers: (client: Bot, text: string): Trigger[] => {
        const triggers: Trigger[] = [];
        const filterCollection = client.keys.filter((v, k) => {
            return text.includes(k);
        });
        filterCollection.forEach((v) => {
            const trigger = client.commands.get(v);
            if (trigger) {
                triggers.push(trigger);
            }
        });
        return triggers;
    },
    /*
    FORMAT-TRIGGERS
    Creates a Message Embed from given triggers.
    */
    formatTriggers: (client: Bot, triggers: Trigger[]): MessageEmbed => {
        const embed = client.embed({
            title: 'Pterodactyl Installation Script',
        });
        if (triggers.length === 1) {
            embed.description = triggers[0].lines.join('\n');
        } else {
            triggers.forEach((trigger, i) => {
                embed.fields.push({
                    name: `${i + 1}`,
                    value: trigger.lines.join('\n'),
                    inline: false,
                });
            });
        }
        return embed;
    },
    /*
    PARSE-IMAGE
    Pareses an image and gives back text
    */
    parseImage: async (item: MessageAttachment): Promise<string> => {
        const worker = createWorker({
            langPath: `${__dirname}/../../eng.traineddata`,
        });
        console.log(`${__dirname}/../../eng.traineddata`);
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const {
            data: { text },
        } = await worker.recognize(item.url);
        await worker.terminate();
        return text;
    },
};
