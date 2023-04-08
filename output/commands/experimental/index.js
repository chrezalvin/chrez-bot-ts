"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customTypes_1 = require("../../typings/customTypes");
const event_1 = __importDefault(require("./event"));
const commandDump = [
    event_1.default,
];
let commands = [];
let inlines = [];
for (const unknownCommand of commandDump) {
    if (unknownCommand.unavailable)
        continue;
    if ((0, customTypes_1.isInline)(unknownCommand))
        inlines.push(unknownCommand);
    else if ((0, customTypes_1.isCommandReturnType)(unknownCommand))
        commands.push(unknownCommand);
}
// mark experimentals
for (const command of commands) {
    if (command.slash?.slashCommand) {
        command.slash.slashCommand.setDescription(`(experimental) ${command.slash.slashCommand.description}`);
    }
}
exports.default = { commands, inlines };
