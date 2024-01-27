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

            if(interaction.channel){
                interaction.deferred ? await interaction.editReply({embeds: [embed]}) : await interaction.reply({embeds: [embed]});
                setTimeout(async () => {
                    interaction.deleteReply();
                }, deleteTime * 1000);
            }
            else console.log("Can't find any channel to send the message");

            if(isDiscordAPIError(e)){
                debug(`got DiscordAPIError code ${e.code}: ${e.message}`);
                const discordAPIError = e;
                const found = errorMessages.find(err => discordAPIError.code == err.errorcode);
                
                if(found === undefined)
                    embed.setError({
                        description: "Encountered an unknown error!",
                        footer: "this message will be deleted in 10 seconds"
                    });
                else
                    embed.setError({
                        description: `${found.description}\ncode: ${found.errorcode}`,
                        title: `error: ${found.errorInfo}`,
                        footer: "this message will be deleted in 10 seconds"
                    });
            }
            else{
                if(typeof e === "object" && 
                    e !== null &&
                    "message" in e &&
                    typeof e.message === "string"
                ){
                    // check if error can be send through discord
                    if(!interaction.channel) return;
                    
                    sendError(interaction, e.message);
                    return;
                }
                else{
                    console.log(`Unknown error ${e}`);
                    return;
                }
            }
        }
    }
]

export default event;