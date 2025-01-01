import { CommandBuilder} from "@library";
import { SlashCommandBuilder } from "discord.js";
import { discordYtPlayer } from "@shared";

const slashCommandBuilder = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops all the songs in the queue");

const stop = new CommandBuilder<undefined>()
    .setName("stop")
    .setDescription("Stops all the songs in the queue")
    .setStatus("public")
    .setMode("available")
    .setSlash({
        slashCommand: slashCommandBuilder,
        interact: async (interaction) => {
            const isStopSuccess = discordYtPlayer.stop();

            if(isStopSuccess)
                await interaction.reply("Stopped the songs");
            else
                await interaction.reply("There are no songs to stop");
        },
    })
    .setChat({
        execute: async (message) => {
            const isStopSuccess = discordYtPlayer.stop();

            if(isStopSuccess)
                await message.reply("Stopped the songs");
            else
                await message.reply("There are no songs to stop");
        },
    });

export default stop;