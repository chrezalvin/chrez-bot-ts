"use strict";
// this is the chrezcommand for weird words
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const weird_json_1 = __importDefault(require("../../assets/messages/active/weird.json"));
const hello = new _library_1.CommandBuilder()
    .setName("weird")
    .setAlias(["fuck", "sex", "hooha", "bitch", "seizure", "slut", "asshole", "shit", "ml"])
    .setDescription("Asks if you're okay?")
    .setStatus("hidden")
    .setChat({
    execute: async (message) => {
        const weird = weird_json_1.default[(0, _library_1.rngInt)(0, weird_json_1.default.length - 1)];
        await message.channel.send(weird);
    },
});
exports.default = hello;
//# sourceMappingURL=weirdThing.js.map