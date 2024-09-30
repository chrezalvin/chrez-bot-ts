"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const cry_json_1 = __importDefault(require("../../assets/messages/active/cry.json"));
const hello = new _library_1.CommandBuilder()
    .setName("cry")
    .setAlias(["cries", "crys"])
    .setDescription("Cries to chat")
    .setStatus("hidden")
    .setChat({
    execute: async (message) => {
        const cry = cry_json_1.default[(0, _library_1.rngInt)(0, cry_json_1.default.length - 1)];
        await message.channel.send(cry);
    },
});
exports.default = hello;
//# sourceMappingURL=cry.js.map