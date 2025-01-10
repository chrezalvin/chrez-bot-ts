import { SlashCommandBuilder } from "discord.js";

import { MyEmbedBuilder, CommandBuilder } from "@library";
import { muted, setMute } from "@shared/isMute";

const run = () => {    
    const embed = new MyEmbedBuilder();
    if(!muted)
        embed.setDescription(`Chrezbot is already unmuted`);
    else{
        setMute(false);
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