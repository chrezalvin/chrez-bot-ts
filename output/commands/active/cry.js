"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandBuilder_1 = require("../../library/CommandBuilder");
const basicFunctions_1 = require("../../library/basicFunctions");
const cry_json_1 = __importDefault(require("../../assets/messages/active/cry.json"));
const hello = new CommandBuilder_1.CommandBuilder()
    .setName("cry")
    .setAlias(["cries", "crys"])
    .setDescription("Cries to chat")
    .setStatus("hidden")
    .setChat({
    execute: async (message) => {
        const cry = cry_json_1.default[(0, basicFunctions_1.rngInt)(0, cry_json_1.default.length - 1)];
        await message.channel.send(cry);
    },
});
exports.default = hello;
