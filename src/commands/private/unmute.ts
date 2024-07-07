import { SlashCommandBuilder } from "discord.js";

import { MyEmbedBuilder, CommandBuilder } from "@library";
import { GlobalState } from "@shared/GlobalState";

const run = () => {    
    const embed = new MyEmbedBuilder();
    if(!GlobalState.isMuted)
        embed.setDescription(`Chrezbot is already unmuted`);
    else{
        GlobalState.setMute(false);
        embed.setTitle(`Chrezbot has been unmuted!`)
    }

    return  [embed];
}

interface I_Mute{

}

const slashCommand = new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("unmutes chrezbot");

const unmute = new CommandBuilder<I_Mute>()
        .setName("unmute")
        .setDescription("mutes chrezbot")
        .setAlias(["rise", "on"])
        .setSlash({
            slashCommand,
            interact: async (interaction) => {
                const res = run();
            
                await interaction.reply({embeds: res});
            }
        })
        .setChat({
            execute: async (message) => {
                const res = run();
            
                await message.channel.send({embeds: res});
            }
        })

export default unmute;