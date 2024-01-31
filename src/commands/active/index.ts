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
import recommend from "./recommend";
import { CommandBuilder } from "@library/CommandBuilder";

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
    recommend,
].filter(command => command.mode !== "unavailable");

// hidden command will not shown on Chrez help
const commandForHelp = c.filter(command => command.status !== "hidden");
const privateCommandForHelp = privateCommands.filter(command => command.status !== "hidden")

// workaround for help command
c.push(help(commandForHelp, privateCommandForHelp));
export const commands = c;

export default commands;