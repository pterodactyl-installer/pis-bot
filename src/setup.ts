import fs from 'fs';
import reader from 'readline-sync';

let baseConfig = fs.readFileSync(`${__dirname}/../config.js.example`, 'utf8');

fs.mkdir(`${__dirname}/config`, { recursive: true }, (e) => console.log(e));

if (fs.existsSync(`${__dirname}/config/config.js`)) {
    process.exit(0);
}
console.log('Setting Up Configuration...');

console.log('First Start! Inserting default guild settings in the database...');

console.log('Enter your discord API token: ');
const TOKEN = reader.question('');
console.log('Enter your prefered prefix for the bot: ');
const PREFIX = reader.question('');

baseConfig = baseConfig.replace('TOKEN', `${TOKEN}`);
baseConfig = baseConfig.replace('PREFIX', `${PREFIX}`);

fs.writeFileSync(`${__dirname}/config/config.js`, baseConfig);
console.log('REMEMBER TO NEVER SHARE YOUR TOKEN WITH ANYONE!');
console.log('Configuration has been written, enjoy!');
