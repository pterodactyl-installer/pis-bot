import fs from 'fs';
import reader from 'readline-sync';
import { config } from './config/config';

let baseConfig = fs.readFileSync(`${__dirname}/config/config.js`, 'utf8');
let baseSrcConfig = fs.readFileSync(
    `${__dirname}/../src/config/config.ts`,
    'utf8',
);

if (config.token === 'TOKEN') {
    console.log('Enter your discord API token: ');
    const TOKEN = reader.question();
    baseConfig = baseConfig.replace('TOKEN', `${TOKEN}`);
    baseSrcConfig = baseSrcConfig.replace('TOKEN', `${TOKEN}`);
}

if (config.prefix === 'PREFIX') {
    console.log('Enter your prefered prefix for the bot (!): ');
    const PREFIX = reader.question('', { defaultInput: '!' });
    baseConfig = baseConfig.replace('PREFIX', `${PREFIX}`);
    baseSrcConfig = baseSrcConfig.replace('PREFIX', `${PREFIX}`);
}

fs.writeFileSync(`${__dirname}/config/config.js`, baseConfig);
fs.writeFileSync(`${__dirname}/../src/config/config.ts`, baseSrcConfig);
console.log('REMEMBER TO NEVER SHARE YOUR TOKEN WITH ANYONE!');
console.log('Configuration has been written, enjoy!');
