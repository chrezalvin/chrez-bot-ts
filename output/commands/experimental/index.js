"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customTypes_1 = require("../../typings/customTypes");
const commandDump = [];
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
