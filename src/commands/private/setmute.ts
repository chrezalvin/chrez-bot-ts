import { SlashCommandBuilder } from "discord.js";

import { MyEmbedBuilder } from "@library/basicFunctions";
import { muted, setMute } from "@config";
import { CommandBuilder } from "@library/CommandBuilder";

const run = (args?: I_Mute) => {
    let flagMute: boolean = args?.mute ?? true;
    
    const embed = new MyEmbedBuilder();
    if(flagMute == muted)
        embed.setDescription(`Chrezbot is already ${muted ? "muted": "unmuted"}`);
    else{
        setMute(
            flagMute, 
            flagMute ? args?.onUnmuted
            : undefined);
        embed.setTitle(`Chrezbot has been ${flagMute? "muted": "unmuted"}!`)
        if(flagMute)
            embed.setDescription("Inline command have been muted for 10 minutes");
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
        .addBooleanOption(input => input.setName("mute").setDescription("set mute to true or false").setRequired(true));

const mute = new CommandBuilder<I_Mute>()
        .setName("mute")
        .setDescription("mutes chrezbot")
        .setAlias(["stfu", "shutup", "off"])
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