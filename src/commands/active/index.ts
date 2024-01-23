import privateCommands from "../private";

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
import update from "./update";
import roshambo from "./roshambo";
import { CommandBuilder } from "@modules/CommandBuilder";

const c: (CommandBuilder<any>)[] = [
    hello, 
    roll,
    calculate,
    quote,
    yomama,
    story,
    time,
    memes,
    cursed,
    update,
    roshambo,
].filter(command => command.mode !== "unavailable");

// workaround for help command
c.push(help(c, privateCommands));
export const commands = c;

export default commands;