"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const discord_js_1 = require("discord.js");
const die_json_1 = __importDefault(require("../../assets/messages/inline/die.json"));
const _services_1 = require("../../services");
const command = {
    name: "die",
    searchCriteria: [/chrez die|die cheese/i, /^die$/i],
    description: "sending mean message to mean people >:(",
    execute: async (message) => {
        const user = await _services_1.UserService.getUser(message.author.id);
        let dieMessage = "";
        if (user && (user.rolename === "owner" || user.rolename === "vice"))
            dieMessage = die_json_1.default[user.rolename][(0, _library_1.rngInt)(0, die_json_1.default.owner.length - 1)]
                .replace("[name]", message.author.username);
        else
            dieMessage = die_json_1.default.normal[(0, _library_1.rngInt)(0, die_json_1.default.normal.length - 1)].replace("[name]", message.author.username);
        if (message.type === discord_js_1.MessageType.Reply)
            await message.reply(dieMessage);
        else if (message.content !== "die")
            await message.channel.send(dieMessage);
    }
};
exports.default = command;
//# sourceMappingURL=die.js.map