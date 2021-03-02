import fs from 'fs';
import reader from 'readline-sync';
import config from './config/config';

if (config.token !== 'TOKEN' || config.prefix !== 'PREFIX') process.exit(0);
let baseConfig = fs.readFileSync(`${__dirname}/config/config.js`, 'utf8');
let baseSrcConfig = fs.readFileSync(
    `${__dirname}/../src/config/config.ts`,
    'utf8',
);

console.log('First Start!');
console.log('Setting Up Configuration...');

console.log('Enter your discord API token: ');
const TOKEN = reader.question('');
console.log('Enter your prefered prefix for the bot (!): ');
const PREFIX = reader.question('', { defaultInput: '!' });

baseConfig = baseConfig.replace('TOKEN', `${TOKEN}`);
baseSrcConfig = baseSrcConfig.replace('TOKEN', `${TOKEN}`);
baseConfig = baseConfig.replace('PREFIX', `${PREFIX}`);
baseSrcConfig = baseSrcConfig.replace('PREFIX', `${PREFIX}`);

fs.writeFileSync(`${__dirname}/config/config.js`, baseConfig);
fs.writeFileSync(`${__dirname}/../src/config/config.ts`, baseSrcConfig);
console.log('REMEMBER TO NEVER SHARE YOUR TOKEN WITH ANYONE!');
console.log('Configuration has been written, enjoy!');
