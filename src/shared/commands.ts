// idk why it wouldnt work on es6 import smh
const debug = require("debug")("ChrezBot:sharedcommands");

import {MODE} from "@config";
import { CommandBuilder } from "@modules/CommandBuilder";
import commands from "../commands";
import { Collection } from "discord.js";
import { CommandReturnTypes, inlineCommandReturnTypes } from "@typings/customTypes";

const allCommandList = new Collection<string, CommandBuilder<any>>();

for(const command of [...commands.active, ...commands.c_private]){
    if(CommandBuilder.isCommandBuilder(command)){
        allCommandList.set(command.name, command);
        debug(`successfully created command ${command.name}`);
    }
}

const _aliasCriteriaMap = new Collection<string|RegExp, string>();
const _inlineCommands= new Collection<string, inlineCommandReturnTypes>();

debug("Loading Inline Commands");
for(const inline of commands.inline){
    for(const criteria of inline.searchCriteria)
        _aliasCriteriaMap.set(criteria, inline.name);
    _inlineCommands.set(inline.name, inline);

    debug(`successfully created inline command ${inline.name}`);
}
debug("Done loading inline Commands");

if(MODE === "development"){
    debug("On development mode, adding experimental commands");
    for(const command of commands.experimental.commands){
        allCommandList.set(command.name, command);
        debug(`successfully created experimental command ${command.name}`);
    }
    
    for(const inline of commands.experimental.inlines){
        for(const criteria of inline.searchCriteria)
            _aliasCriteriaMap.set(criteria, inline.name);
        _inlineCommands.set(inline.name, inline);
        debug(`successfully created experimental inline command ${inline.name}`);
    }
    debug("Done loading experimental commands");
}

// debug("======= list of commands =======");
// debug(`create Message: ${_command.map((_, key) => key)}`);
// debug(`slash Commands: ${_slashCommands.map((_, key) => `/${key} `)}`);
// debug(`inline Commands: ${_inlineCommands.map((_, key) => key)}`);
// debug(`private Commands: ${_privateCommands.map((_, key) => key)}`);

debug("======= list of commands =======");
debug(`create Message: ${allCommandList.filter(command => command.chat).map((_, key) => key)}`);
debug(`slash Commands: ${allCommandList.filter(command => command.slash).map((_, key) => `/${key} `)}`);
debug(`inline Commands: ${_inlineCommands.map((_, key) => key)}`);
debug(`private Commands: ${allCommandList.filter(command => command.status === "private").map((_, key) => key)}`);

export const aliasCriteriaMap = _aliasCriteriaMap;
export const inlineCommands = _inlineCommands;
export const allCommands = allCommandList;

export default allCommands;