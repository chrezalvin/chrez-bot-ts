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

const _command = new Collection<string, CommandReturnTypes>();
const _commandAlias = new Collection<string, string>();
const _slashCommands = new Collection<string, CommandReturnTypes["slash"]>();

const _privateCommands = new Collection<string, CommandReturnTypes>();
const _privateCommandAlias = new Collection<string, string>();
const _privateSlashCommands = new Collection<string, CommandReturnTypes["slash"]>();

const _aliasCriteriaMap = new Collection<string|RegExp, string>();
const _inlineCommands= new Collection<string, inlineCommandReturnTypes>();

debug("Loading private commands");
for(const command of commands.c_private){
    if(CommandBuilder.isCommandBuilder(command)) continue;

    _privateCommands.set(command.name, command);
    if(command.slash)
        _privateSlashCommands.set(command.slash.slashCommand.name, command.slash);
    if(command.alias)
        for(const alias of command.alias){
            if(_privateCommandAlias.has(alias)){
                console.warn(`WARNING: The alias for private command ${alias} has already been taken by command ${_privateCommandAlias.get(alias)}, skipping this alias`);
                continue;
            }
            _privateCommandAlias.set(alias, command.name);
        }
}
debug("Done loading private commands");

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

debug("======= list of commands =======");
debug(`create Message: ${_command.map((_, key) => key)}`);
debug(`slash Commands: ${_slashCommands.map((_, key) => `/${key} `)}`);
debug(`inline Commands: ${_inlineCommands.map((_, key) => key)}`);
debug(`private Commands: ${_privateCommands.map((_, key) => key)}`);

export const command = _command;
export const commandAlias = _commandAlias;
export const slashCommands = _slashCommands;
export const privateCommands = _privateCommands;
export const privateCommandAlias = _privateCommandAlias;
export const privateSlashCommands = _privateSlashCommands;
export const aliasCriteriaMap = _aliasCriteriaMap;
export const inlineCommands = _inlineCommands;
export const allCommands = allCommandList;

export default allCommands;