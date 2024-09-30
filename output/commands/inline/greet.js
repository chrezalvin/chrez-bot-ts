"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const greet_json_1 = __importDefault(require("../../assets/messages/inline/greet.json"));
const _config_1 = require("../../config");
const _services_1 = require("../../services");
const command = {
    name: "greet",
    description: "Greet the user",
    searchCriteria: ["cheese", /^he+re+$/i, ..._config_1.prefixes],
    execute: async (message) => {
        // exclusive for vice and owner only!
        const user = await _services_1.UserService.getUser(message.author.id);
        if (user) {
            if (user.rolename === "owner" || user.rolename === "vice") {
                message.channel.send(greet_json_1.default.exclusive[(0, _library_1.rngInt)(0, greet_json_1.default.exclusive.length - 1)]
                    .replace("[name]", message.author.username)
                    .replace("[role]", user.rolename)
                    .replace("[alias]", user.aliases ? user.aliases[(0, _library_1.rngInt)(0, user.aliases.length - 1)] : ""));
                return;
            }
        }
        const embed = new _library_1.MyEmbedBuilder();
        // .setTitle(`Chrezbot greets ${message.author.username}`)
        // .setDescription(greet[rngInt(0, greet.length - 1)].replace("[name]", message.author.username));
        message.channel.send(greet_json_1.default.normal[(0, _library_1.rngInt)(0, greet_json_1.default.normal.length - 1)].replace("[name]", message.author.username));
    },
};
exports.default = command;
//# sourceMappingURL=greet.js.map