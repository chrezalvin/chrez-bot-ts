const debug = require("debug")("ChrezBot:interactionCreate");

import { sendError } from "@bot";
import { MyEmbedBuilder } from "@library/basicFunctions";
import { userIsAdmin } from "library/profiles";
import { isDiscordAPIError } from "library/customTypes";
import {EventArguments} from "../"

import errorMessages from "@assets/data/error.json";

import * as sharedCommands from "shared/commands";
import { CacheType, ChatInputCommandInteraction, Events } from "discord.js";
import { ErrorValidation } from "@library/ErrorValidation";
import { CommandBuilder } from "@library/CommandBuilder";

function slashCommandValidation(interaction: ChatInputCommandInteraction<CacheType>): ErrorValidation | CommandBuilder<any>{
    if(sharedCommands.allCommands.has(interaction.commandName)){
        const slashCommand = sharedCommands.allCommands.get(interaction.commandName)!;

        if(slashCommand.status === "private"){
            const userId = interaction.member?.user.id;
            if(userId === undefined)
                return new ErrorValidation("command_user_not_found");
            else if(!userIsAdmin(userId))
                return new ErrorValidation("command_is_private");
        }

        return slashCommand;
    }
    else
        return new ErrorValidation("slash_command_unavailable", interaction.commandName);
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
            const embed = new MyEmbedBuilder();
            const deleteTime = 10;

            let errorMsg: string = "";
            if(typeof e === "string")
                errorMsg = e;
            else if(e && typeof e === "object" && "message" in e && typeof e.message === "string")
                errorMsg = e.message;
            else if(isDiscordAPIError(e))
                errorMsg = e.message;
            else
                errorMsg = "unknown error";

            embed.setError({
                description: errorMsg,
                footer: `this message will be deleted in ${deleteTime} seconds`
            });

            if(interaction.deferred)
                await interaction.editReply({embeds: [embed]});
            else
                await interaction.reply({embeds: [embed]});

            setTimeout(async () => {
                interaction.deleteReply();
            }, deleteTime * 1000);
        }
    }
]

export default event;