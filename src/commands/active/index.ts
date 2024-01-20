import { CommandReturnTypes } from "@typings/customTypes";

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
import embedify from "./embedify"
import update from "./update";
import roshambo from "./roshambo";
import { CommandBuilder } from "@modules/CommandBuilder";

/*
const run: runCommand = (message , args?: string[]) => {

    if(isChatInputCommandInteraction(message)){

    }
    else{

    }

    const embed = new MyEmbedBuilder();

    return [embed];
} 
*/

const c: (CommandReturnTypes | CommandBuilder<any>)[] = [
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
    update,
    roshambo,
    
].filter(command => {
    if(!(command instanceof CommandBuilder))
        return !command.unavailable
    else
        return command.mode !== "unavailable";
});

// workaround for help command
c.push(help(c, privateCommands));
export const commands = c;

export default commands;