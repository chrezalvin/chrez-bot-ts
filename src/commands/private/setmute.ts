import { SlashCommandBuilder } from "discord.js";

import { MyEmbedBuilder, CommandBuilder } from "@library";
import { GlobalState } from "@shared/GlobalState";

const run = (args?: I_Mute) => {
    let flagMute: boolean = args?.mute ?? true;
    
    const embed = new MyEmbedBuilder();
    if(flagMute == GlobalState.isMuted)
        embed.setDescription(`Chrezbot is already ${flagMute ? "muted": "unmuted"}`);
    else{
        GlobalState.setMute(
            flagMute, 
            {
                callback: args?.onUnmuted,
            }
        );
        embed.setTitle(`Chrezbot has been ${flagMute? "muted": "unmuted"}!`)
        if(flagMute)
            embed.setDescription("Inline command have been muted for 30 minutes");
    }

    return  [embed];
}

interface I_Mute{
    mute: boolean;
    onUnmuted?: () => void;
}

const slashCommand = new SlashCommandBuilder()
        .setName("mute")
        .setDescription("mutes chrezbot")
        .addBooleanOption(input => input.setName("global")
            .setDescription("if this is true, chrezbot will be muted for all users")
            .setRequired(false)
        )
        .addNumberOption(input => input.setName("duration")
            .setDescription("how long chrezbot will be muted in minutes (20 minutes if left empty)")
            .setRequired(false)
        );

const mute = new CommandBuilder<I_Mute>()
        .setName("mute")
        .setDescription("mutes chrezbot's inline command")
        .setAlias(["stfu", "shutup", "off", "shoo", "sshh"])
        .setSlash({
            slashCommand,
            getParameter: (interaction) => {
                const mute = interaction.options.getBoolean("mute", true);
                const onUnmuted = () => {
                    interaction.channel?.send({embeds: [new MyEmbedBuilder({description: "Chrezbot is now unmuted"})]});
                }
                return {
                    mute,
                    onUnmuted
                };
            },
            interact: async (interaction, args) => {
                const res = run(args);
            
                await interaction.reply({embeds: res});
            }
        })
        .setChat({
            getParameter: (message, args) => {
                
                const muted = args[0] === "false" ? false : true;
                const onUnmuted = () => {
                    message.channel.send({embeds: [new MyEmbedBuilder({description: "Chrezbot is now unmuted"})]});
                }
                return {
                    mute: muted,
                    onUnmuted
                };
            },
            execute: async (message, args) => {
                const res = run(args);
            
                await message.channel.send({embeds: res});
            }
        })

export default mute;