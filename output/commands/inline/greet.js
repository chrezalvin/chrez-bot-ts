"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const greet_json_1 = __importDefault(require("../../assets/messages/inline/greet.json"));
const basicFunctions_1 = require("../../modules/basicFunctions");
const command = {
    name: "greet",
    description: "Greet the user",
    searchCriteria: ["Chrez", "cb", "cheese", "here"],
    execute: (message) => {
        const embed = new basicFunctions_1.MyEmbedBuilder()
            .setTitle(`Chrezbot greets ${message.author.username}`)
            .setDescription(greet_json_1.default[(0, basicFunctions_1.rngInt)(0, greet_json_1.default.length - 1)].replace("[name]", message.author.username));
        message.channel.send({ embeds: [embed] });
    },
};
exports.default = command;
