"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
debug("ChrezBot:MessageCreate");
const _config_1 = require("../../config");
const sharedCommands = __importStar(require("../../shared/commands"));
const _library_1 = require("../../library");
const _bot_1 = require("../../bot");
const _services_1 = require("../../services");
const holdUser = new _library_1.TemporaryArray([], (stra, strb) => stra === strb);
function commandValidation(message, command) {
    let chatCommand = sharedCommands
        .allCommands
        .find((commandBuilder) => commandBuilder.checkIfCommand(command));
    if (chatCommand === undefined)
        return new _library_1.ErrorValidation("chat_command_unavailable", command);
    if (chatCommand.status === "private") {
        const userId = message.author.id;
        if (userId === undefined)
            return new _library_1.ErrorValidation("command_user_not_found");
        else if (!_services_1.UserService.userIsAdmin(userId))
            return new _library_1.ErrorValidation("command_is_private");
    }
    return chatCommand;
}
const event = ["messageCreate", async (message) => {
        if (!message.guild)
            return;
        // check if the bot can send message into the channel
        if (!message.guild.members.me?.permissions.has("ManageMessages"))
            return;
        // ignore message from bot or long message
        if (message.author.bot || message.content.length > _config_1.max_message_allowed)
            return;
        // inline command handling
        // ignore inline command if chrezbot is muted
        if (!_config_1.muted && !holdUser.find((data) => data === message.author.id))
            for (const [v, k] of sharedCommands.aliasCriteriaMap) {
                if ((typeof v === "string" && message.content !== v)
                    ||
                        (v instanceof RegExp && message.content.match(v) === null))
                    continue;
                const command = sharedCommands.inlineCommands.get(k);
                if (command) {
                    command.execute(message);
                    holdUser.addData(message.author.id);
                    return;
                }
            }
        // check if command is directed to chrezbot (e.g "Chrez" math) and its aliases
        if (_config_1.prefixes.find(prefix => message.content.startsWith(prefix)) === undefined)
            return;
        /**
         * argument variables, guaranteed lowercase and command removed
         */
        const args = message.content.split(/ +/);
        args.shift(); // remove command name (Chrez)
        debug(`got message: ${message.content}`);
        debug(`args: ${args}`);
        // check if command available (i.e: not just Chrez tho it should be alr guarded with inline command)
        const command = args.shift();
        // change args to lowercase
        args.forEach((str, index, arr) => arr[index] = str.toLowerCase());
        if (command === undefined)
            return;
        try {
            const chatCommand = commandValidation(message, command);
            if (_library_1.ErrorValidation.isErrorValidation(chatCommand))
                return await _library_1.ErrorValidation.sendErrorValidation(message, chatCommand);
            const res = await chatCommand.execute(message, args);
            if (_library_1.ErrorValidation.isErrorValidation(res))
                return await _library_1.ErrorValidation.sendErrorValidation(message, res);
        }
        catch (e) {
            debug(`error: ${e}`);
            // check if error can be send through discord
            if (!message.channel)
                return;
            let errorMsg = "";
            if (typeof e === "string")
                errorMsg = e;
            else if (e && typeof e === "object" && "message" in e && typeof e.message === "string")
                errorMsg = e.message;
            else
                errorMsg = "unknown error occured";
            await (0, _bot_1.sendError)(message, errorMsg);
        }
    }];
exports.default = event;
//# sourceMappingURL=messageCreate.js.map