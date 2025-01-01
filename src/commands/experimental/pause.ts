import { CommandBuilder} from "@library";
import { SlashCommandBuilder } from "discord.js";
import { discordYtPlayer } from "@shared";

const slashCommandBuilder = new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current song");

const pause = new CommandBuilder<undefined>()
    .setName("pause")
    .setDescription("Pauses the current song")
    .setStatus("public")
    .setMode("available")
    .setExamples([
        {command: "Chrez pause", description: "pauses the current song"},
    ])
    .setSlash({
        slashCommand: slashCommandBuilder,
        interact: async (interaction, args) => {
            const isStopSuccess = discordYtPlayer.pause();

            if(isStopSuccess)
                await interaction.reply("Paused the song");
            else
                await interaction.reply("There are no songs to pause!");
        },
    })
    .setChat({
        execute: async (message, args) => {
            const isStopSuccess = discordYtPlayer.pause();

            if(isStopSuccess)
                await message.reply("Paused the song");
            else
                await message.reply("There are no songs to pause!");
        },
    });

export default pause;