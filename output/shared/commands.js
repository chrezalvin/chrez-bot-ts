"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allCommands = exports.inlineCommands = exports.aliasCriteriaMap = void 0;
// idk why it wouldnt work on es6 import smh
const debug = require("debug")("ChrezBot:sharedcommands");
const _config_1 = require("../config");
const commands_1 = __importDefault(require("../commands"));
const discord_js_1 = require("discord.js");
const allCommandList = new discord_js_1.Collection();
for (const command of [...commands_1.default.active, ...commands_1.default.c_private]) {
    if (allCommandList.has(command.name)) {
        console.log(`command with name ${command.name} already exists, skipping this command creation`);
        continue;
    }
    allCommandList.set(command.name, command);
    debug(`successfully created command ${command.name}`);
}
const _aliasCriteriaMap = new discord_js_1.Collection();
const _inlineCommands = new discord_js_1.Collection();
debug("Loading Inline Commands");
for (const inline of commands_1.default.inline) {
    for (const criteria of inline.searchCriteria)
        _aliasCriteriaMap.set(criteria, inline.name);
    _inlineCommands.set(inline.name, inline);
    debug(`successfully created inline command ${inline.name}`);
}
debug("Done loading inline Commands");
if (_config_1.MODE === "development") {
    debug("On development mode, adding experimental commands");
    for (const command of commands_1.default.experimental.commands) {
        allCommandList.set(command.name, command);
        debug(`successfully created experimental command ${command.name}`);
    }
    for (const inline of commands_1.default.experimental.inlines) {
        for (const criteria of inline.searchCriteria)
            _aliasCriteriaMap.set(criteria, inline.name);
        _inlineCommands.set(inline.name, inline);
        debug(`successfully created experimental inline command ${inline.name}`);
    }
    debug("Done loading experimental commands");
}
debug("======= list of commands =======");
debug(`create Message: ${allCommandList.filter(command => command.chat).map((_, key) => key)}`);
debug(`slash Commands: ${allCommandList.filter(command => command.slash).map((_, key) => `/${key} `)}`);
debug(`inline Commands: ${_inlineCommands.map((_, key) => key)}`);
debug(`private Commands: ${allCommandList.filter(command => command.status === "private").map((_, key) => key)}`);
debug(`hidden Commands: ${allCommandList.filter(command => command.status === "hidden").map((_, key) => key)}`);
exports.aliasCriteriaMap = _aliasCriteriaMap;
exports.inlineCommands = _inlineCommands;
exports.allCommands = allCommandList;
exports.default = exports.allCommands;
//# sourceMappingURL=commands.js.map