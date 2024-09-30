"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const itsokay_json_1 = __importDefault(require("../../assets/messages/inline/itsokay.json"));
const discord_js_1 = require("discord.js");
const _config_1 = require("../../config");
const command = {
    name: "itsok",
    description: "Says random message whenever user reply chrezbot with sorry",
    searchCriteria: [/sorry/gi],
    acceptedLength: 10,
    execute: async (message) => {
        // will be removed as soon acceptable length is implemented
        if (message.content.length > 10)
            return;
        // check if reply
        if (message.type !== discord_js_1.MessageType.Reply)
            return;
        const messageReplied = await message.fetchReference();
        if (messageReplied.author.bot
            &&
                messageReplied.author.id === _config_1.CLIENT_ID
            &&
                messageReplied.content.match(/yell/i)
            &&
                messageReplied.createdAt.getTime() > Date.now() - 1000 * 60 * 5) {
            message.reply({
                allowedMentions: { repliedUser: false },
                content: itsokay_json_1.default[(0, _library_1.rngInt)(0, itsokay_json_1.default.length - 1)],
            });
        }
    },
};
exports.default = command;
//# sourceMappingURL=itsokay.js.map