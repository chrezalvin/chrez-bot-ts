"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorValidation = void 0;
const error2_json_1 = __importDefault(require("../assets/data/error2.json"));
const discord_js_1 = require("discord.js");
const _library_1 = require(".");
class ErrorValidation {
    static stringFormatter(str, args) {
        if (args === undefined || args.length == 0)
            return str;
        else {
            return str.replace(/{(\d+)}/g, (_, number) => {
                const num = number;
                if (!isNaN(num) && args[num] !== undefined)
                    return `${args[num]}`;
                else
                    return "";
            });
        }
    }
    /**
     * send (or reply) acknowledged validation error to a channel
     * @param message discord message
     * @param error ErrorValidation object
     * @param deleteTime time in seconds before the message is deleted, defaulted to 10 seconds
     */
    static async sendErrorValidation(message, error, deleteTime = 10) {
        const embed = new _library_1.MyEmbedBuilder({
            title: error.name,
            description: error.description,
            color: discord_js_1.Colors.Orange,
            footer: { text: `this message will be deleted in ${deleteTime} seconds` }
        });
        if ((0, _library_1.isChatInputCommandInteraction)(message)) {
            message.deferred ? await message.editReply({ embeds: [embed] }) : await message.reply({ embeds: [embed] });
            if (deleteTime)
                setTimeout(async () => {
                    message.deleteReply();
                }, deleteTime * 1000);
        }
        else if (message.channel.isSendable()) {
            const msg = await message.channel.send({ embeds: [embed] });
            if (deleteTime)
                setTimeout(async () => {
                    if (msg.deletable)
                        await msg.delete();
                }, deleteTime * 1000);
        }
    }
    /**
     * send (or reply) unknown error to a channel
     * @param message discord message
     * @param error ErrorValidation object
     * @param deleteTime time in seconds before the message is deleted, defaulted to 10 seconds
     */
    static sendUnknownError(message, error, deleteTime = 10) {
        const embed = new _library_1.MyEmbedBuilder({
            title: error.name,
            description: error.description,
            color: discord_js_1.Colors.Red,
            footer: { text: `this message will be deleted in ${deleteTime} seconds` }
        });
        if ((0, _library_1.isChatInputCommandInteraction)(message)) {
            message.deferred ? message.editReply({ embeds: [embed] }) : message.reply({ embeds: [embed] });
            if (deleteTime)
                setTimeout(async () => {
                    message.deleteReply();
                }, deleteTime * 1000);
        }
        else if (message.channel.isSendable()) {
            message.channel.send({ embeds: [embed] });
            if (deleteTime)
                setTimeout(async () => {
                    if (message.deletable)
                        await message.delete();
                }, deleteTime * 1000);
        }
    }
    static isErrorValidation(obj) {
        return obj instanceof ErrorValidation;
    }
    constructor(error, ...args) {
        this.code = error2_json_1.default[error].code;
        this.name = error2_json_1.default[error].name;
        this.description = ErrorValidation.stringFormatter(error2_json_1.default[error].description, args);
    }
}
exports.ErrorValidation = ErrorValidation;
//# sourceMappingURL=ErrorValidation.js.map