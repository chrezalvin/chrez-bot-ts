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
const debug = require("debug")("ChrezBot:interactionCreate");
const _library_1 = require("../../library");
const sharedCommands = __importStar(require("../../shared/commands"));
const discord_js_1 = require("discord.js");
const _config_1 = require("../../config");
const _services_1 = require("../../services");
function slashCommandValidation(interaction) {
    if (!sharedCommands.allCommands.has(interaction.commandName))
        throw new _library_1.ErrorValidation("slash_command_unavailable", interaction.commandName);
    const slashCommand = sharedCommands.allCommands.get(interaction.commandName);
    if (slashCommand.status === "private") {
        const userId = interaction.member?.user.id;
        if (userId === undefined)
            throw new _library_1.ErrorValidation("command_user_not_found");
        else if (!(_services_1.UserService.userIsAdmin(userId)))
            throw new _library_1.ErrorValidation("command_is_private");
    }
    return slashCommand;
}
const event = [
    discord_js_1.Events.InteractionCreate,
    async (interaction) => {
        if (!interaction.isChatInputCommand())
            return;
        debug(`received interaction: /${interaction.commandName} from ${interaction.member?.user.username}`);
        try {
            const slashCommand = slashCommandValidation(interaction);
            if (_library_1.ErrorValidation.isErrorValidation(slashCommand))
                return await _library_1.ErrorValidation.sendErrorValidation(interaction, slashCommand);
            const res = slashCommand.execute(interaction);
            if (_library_1.ErrorValidation.isErrorValidation(res))
                return await _library_1.ErrorValidation.sendErrorValidation(interaction, res);
        }
        catch (e) {
            let errorMsg = "";
            if (typeof e === "string")
                errorMsg = e;
            else if (e && typeof e === "object" && "message" in e && typeof e.message === "string")
                errorMsg = e.message;
            else if ((0, _library_1.isDiscordAPIError)(e))
                errorMsg = e.message;
            else
                errorMsg = "unknown error";
            const embed = _library_1.MyEmbedBuilder.createError({
                description: errorMsg,
                footer: `this message will be deleted in ${_config_1.message_delete_time} seconds`
            });
            if (interaction.deferred)
                await interaction.editReply({ embeds: [embed] });
            else
                await interaction.reply({ embeds: [embed] });
            setTimeout(async () => {
                interaction.deleteReply();
            }, _config_1.message_delete_time * 1000);
        }
    }
];
exports.default = event;
//# sourceMappingURL=interactionCreate.js.map