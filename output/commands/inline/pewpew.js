"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pewpew_json_1 = __importDefault(require("../../assets/messages/inline/pewpew.json"));
const basicFunctions_1 = require("../../modules/basicFunctions");
const command = {
    name: "pewpew",
    description: "Give pewpew",
    searchCriteria: ["pewpew", "pew", "pew pew"],
    execute: (message) => {
        const embed = new basicFunctions_1.MyEmbedBuilder()
            .setTitle(pewpew_json_1.default[(0, basicFunctions_1.rngInt)(0, pewpew_json_1.default.length - 1)]);
        message.channel.send({ embeds: [embed] });
    },
};
exports.default = command;
