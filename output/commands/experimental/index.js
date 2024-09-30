"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const commandDump = [
// dyePrice    
];
let commands = [];
let inlines = [];
for (const unknownCommand of commandDump) {
    if (_library_1.CommandBuilder.isCommandBuilder(unknownCommand)) {
        if (unknownCommand.mode === "unavailable")
            continue;
        commands.push(unknownCommand.setMode("experimental"));
    }
    else {
        if (unknownCommand.unavailable)
            continue;
        inlines.push(unknownCommand);
    }
}
exports.default = { commands, inlines };
//# sourceMappingURL=index.js.map