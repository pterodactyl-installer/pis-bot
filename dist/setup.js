"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const readline_sync_1 = __importDefault(require("readline-sync"));
let baseConfig = fs_1.default.readFileSync(`${__dirname}/../config.js.example`, 'utf8');
fs_1.default.mkdir(`${__dirname}/config`, { recursive: true }, (e) => console.log(e));
if (fs_1.default.existsSync(`${__dirname}/config/config.js`)) {
    process.exit(0);
}
console.log('Setting Up Configuration...');
console.log('First Start! Inserting default guild settings in the database...');
console.log('Enter your discord API token: ');
const TOKEN = readline_sync_1.default.question('');
console.log('Enter your prefered prefix for the bot: ');
const PREFIX = readline_sync_1.default.question('');
baseConfig = baseConfig.replace('TOKEN', `${TOKEN}`);
baseConfig = baseConfig.replace('PREFIX', `${PREFIX}`);
fs_1.default.writeFileSync(`${__dirname}/config/config.js`, baseConfig);
console.log('REMEMBER TO NEVER SHARE YOUR TOKEN WITH ANYONE!');
console.log('Configuration has been written, enjoy!');
