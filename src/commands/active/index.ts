import { CommandReturnTypes } from "@typings/customTypes";
import hello from "./hello";
import roll from "./roll";
import calculate from "./calculate";
import quote from "./quote";
import yomama from "./yomama";
import story from "./story";
import time from "./time";
import memes from "./memes";
import cursed from "./cursed";
import help from "./help";
import embedify from "./embedify"
import update from "./update";

const c: CommandReturnTypes[] = [
    hello, 
    roll,
    calculate,
    quote,
    yomama,
    story,
    time,
    memes,
    cursed,
    embedify,
    update
].filter(command => !command.unavailable);

// workaround for help command
c.push(help(c));
export const commands = c;

export default commands;