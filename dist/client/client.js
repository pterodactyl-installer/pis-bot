"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const util_1 = require("util");
const logger_1 = require("../modules/logger");
const triggers_1 = require("../config/triggers");
const functions_1 = __importDefault(require("../modules/functions"));
const glob_1 = __importDefault(require("glob"));
const globPromise = util_1.promisify(glob_1.default);
class Bot extends discord_js_1.Client {
    constructor(config) {
        super({ ws: { intents: discord_js_1.Intents.NON_PRIVILEGED } });
        this.config = config;
        this.commands = new discord_js_1.Collection();
        this.aliases = new discord_js_1.Collection();
        this.keys = new discord_js_1.Collection();
        this.logger = logger_1.Logger;
        this.functions = functions_1.default;
    }
    async start() {
        this.login(this.config.token);
        const eventFiles = await globPromise(`${__dirname}/../events/*.js`);
        eventFiles.map(async (eventFile) => {
            const ev = (await Promise.resolve().then(() => __importStar(require(eventFile))));
            this.logger(`Loading Event: ${ev.name}`);
            this.on(ev.name, ev.run.bind(null, this));
        });
        triggers_1.triggers.map(async (trigger) => {
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
    embed(data) {
        return new discord_js_1.MessageEmbed(Object.assign(Object.assign({}, data), { color: this.config.embedColor, footer: { text: 'Created by Sam1370. Maintained by Linux123123' }, timestamp: new Date() }));
    }
}
exports.default = Bot;
