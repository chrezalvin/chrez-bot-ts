const debug = require("debug")("ChrezBot:interactionCreate");

import { MyEmbedBuilder, isDiscordAPIError, ErrorValidation, CommandBuilder } from "@library";
import {EventArguments} from "../"

import * as sharedCommands from "shared/commands";
import { CacheType, ChatInputCommandInteraction, Events } from "discord.js";
import { message_delete_time } from "@config";
import { UserService } from "@services";

function slashCommandValidation(interaction: ChatInputCommandInteraction<CacheType>): CommandBuilder<any>{
    if(!sharedCommands.allCommands.has(interaction.commandName))
        throw new ErrorValidation("slash_command_unavailable", interaction.commandName);

    const slashCommand = sharedCommands.allCommands.get(interaction.commandName)!;

    if(slashCommand.status === "private"){
        const userId = interaction.member?.user.id;
        if(userId === undefined)
            throw new ErrorValidation("command_user_not_found");
        else if(!(UserService.userIsAdmin(userId)))
            throw new ErrorValidation("command_is_private");
    }

    return slashCommand;
}

const event: EventArguments<Events.InteractionCreate> = [
    Events.InteractionCreate,
    async (interaction) => {
        if(!interaction.isChatInputCommand()) return;
        debug(`received interaction: /${interaction.commandName} from ${interaction.member?.user.username}`);
        
        try{
            const slashCommand = slashCommandValidation(interaction);
            if(ErrorValidation.isErrorValidation(slashCommand))
                return await ErrorValidation.sendErrorValidation(interaction, slashCommand);

            const res = await slashCommand.execute(interaction);
            if(ErrorValidation.isErrorValidation(res))
                return await ErrorValidation.sendErrorValidation(interaction, res);
        }
        catch(e: unknown){
            let errorMsg: string = "";
            if(typeof e === "string")
                errorMsg = e;
            else if(e && typeof e === "object" && "message" in e && typeof e.message === "string")
                errorMsg = e.message;
            else if(isDiscordAPIError(e))
                errorMsg = e.message;
            else
                errorMsg = "unknown error";

            const embed = MyEmbedBuilder.createError({
                    description: errorMsg,
                    footer: `this message will be deleted in ${message_delete_time} seconds`
                });

            if(interaction.deferred)
                await interaction.editReply({embeds: [embed]});
            else
                await interaction.reply({embeds: [embed]});

            setTimeout(async () => {
                interaction.deleteReply();
            }, message_delete_time * 1000);
        }
    }
]

export default event;