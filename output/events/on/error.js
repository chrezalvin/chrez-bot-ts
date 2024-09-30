"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const event = [
    discord_js_1.Events.Error,
    (errorMessages) => {
        console.log(`Fatal error: ${errorMessages.name} - ${errorMessages.message}`);
    }
];
exports.default = event;
//# sourceMappingURL=error.js.map