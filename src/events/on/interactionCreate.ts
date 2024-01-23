const debug = require("debug")("ChrezBot:interactionCreate");

import { sendError } from "@bot";
import { ownerID } from "@config";
import { CommandBuilder } from "@modules/CommandBuilder";
import { MyEmbedBuilder } from "@modules/basicFunctions";
import { userIsAdmin } from "@modules/profiles";
import { Cause, isDiscordAPIError } from "@typings/customTypes";
import {EventArguments} from "../"

import errorMessages from "@assets/data/error.json";

import * as sharedCommands from "shared/commands";
import { Events } from "discord.js";

const event: EventArguments<Events.InteractionCreate> = [
Events.InteractionCreate, 
async (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    debug(`received interaction: /${interaction.commandName} from ${interaction.member?.user.username}`);
    
    try{
        if(sharedCommands.allCommands.has(interaction.commandName)){
            const slashCommand = sharedCommands.allCommands.get(interaction.commandName)!;

            if(CommandBuilder.isCommandBuilder(slashCommand)){
                if(slashCommand.status === "private"){
                    const userId = interaction.member?.user.id;
                    if(userId === undefined){
                        await sendError(interaction, "Cannot verify the sender of this command!");
                        return;
                    }
                    else if(!userIsAdmin(userId)){
                        await sendError(interaction, "This command is only available for private members!");
                        return;
                    }
                }
            }

            const res = await slashCommand.execute(interaction);
            if(Cause.isCause(res) && !res.ok)
                sendError(interaction, res.message);
        }
        else{
            const embed = new MyEmbedBuilder();
            embed.setError({description: `The slash command is still unavailable!`, footer: "please wait for upcoming release to use this command"});
            await interaction.reply({embeds: [embed]});
        }
    }
    catch(e: unknown){
        try{
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
        catch(e: unknown){
            // this catch is last resport if fatal error occured
            console.log(`fatal error: ${JSON.stringify(e)}`);
        }    
    }
}]

export default event;