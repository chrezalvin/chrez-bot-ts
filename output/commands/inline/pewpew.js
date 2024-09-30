"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const pewpew_json_1 = __importDefault(require("../../assets/messages/inline/pewpew.json"));
const command = {
    name: "pewpew",
    description: "Give pewpew",
    searchCriteria: ["pewpew", "pew", "pew pew", "mamekwpqnseueurbdudlalzmaa"],
    execute: (message) => {
        const embed = new _library_1.MyEmbedBuilder()
            .setTitle(pewpew_json_1.default[(0, _library_1.rngInt)(0, pewpew_json_1.default.length - 1)]);
        message.channel.send({ embeds: [embed] });
    },
};
exports.default = command;
//# sourceMappingURL=pewpew.js.map