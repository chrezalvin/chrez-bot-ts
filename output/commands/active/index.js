"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const hello_1 = __importDefault(require("./hello"));
const roll_1 = __importDefault(require("./roll"));
const calculate_1 = __importDefault(require("./calculate"));
const quote_1 = __importDefault(require("./quote"));
const yomama_1 = __importDefault(require("./yomama"));
const story_1 = __importDefault(require("./story"));
const time_1 = __importDefault(require("./time"));
const memes_1 = __importDefault(require("./memes"));
const cursed_1 = __importDefault(require("./cursed"));
const help_1 = __importDefault(require("./help"));
const embedify_1 = __importDefault(require("./embedify"));
const update_1 = __importDefault(require("./update"));
/*
const run: runCommand = (message , args?: string[]) => {

    if(isChatInputCommandInteraction(message)){

    }
    else{

    }

    const embed = new MyEmbedBuilder();

    return embed;
}
*/
const c = [
    hello_1.default,
    roll_1.default,
    calculate_1.default,
    quote_1.default,
    yomama_1.default,
    story_1.default,
    time_1.default,
    memes_1.default,
    cursed_1.default,
    embedify_1.default,
    update_1.default
].filter(command => !command.unavailable);
// workaround for help command
c.push((0, help_1.default)(c));
exports.commands = c;
exports.default = exports.commands;
