const debug = require("debug")("ChrezBot:mute");

import {CommandReturnTypes, isChatInputCommandInteraction, runCommand} from "@typings/customTypes";
import { MessageCreateOptions, MessagePayload, SlashCommandBuilder } from "discord.js";

import { MyEmbedBuilder, rngInt } from "@modules/basicFunctions";
import { muted, setMute } from "@config";

const run: runCommand = (message, args?: string[]) => {
    let flagMute: boolean;
    if(isChatInputCommandInteraction(message)){
        flagMute = message.options.getBoolean("mute", true);

        debug(`running command /mute ${flagMute}`);
    }
    else if(args)
        if(args[0].localeCompare("true"))
            flagMute = true;
        else if(args[0].localeCompare("false"))
            flagMute = false;
        else
            throw new Error("the parameter is invalid");
    else 
        flagMute = true;
    
    const embed = new MyEmbedBuilder();
    if(flagMute == muted)
        embed.setDescription(`Chrezbot is already ${muted ? "muted": "unmuted"}`);
    else if(muted)
        embed.setDescription("Chrezbot has been muted!").setDescription("Inline command have been muted");
    else{
        setMute(flagMute);
        embed.setTitle("Chrezbot has been muted!").setDescription("Inline command have been muted");
    }

    return  [embed];
}

const command: CommandReturnTypes = {
    name: "setmute",
    description: "mute the chrezbot",
    alias: [],
    execute: async (message, args: string[]) => {

        await message.channel.send({embeds: run(message, args)});
    },
    slash:{
        slashCommand: new SlashCommandBuilder()
            .setName("mute")
            .setDescription("mutes chrezbot")
            .addBooleanOption(input => input.setName("mute").setDescription("set mute to true or false").setRequired(true)),
        interact: async (interaction) => {
            await interaction.reply({embeds: run(interaction)});
        }
    }
};

export default command;