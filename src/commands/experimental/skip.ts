import { CommandBuilder} from "@library";
import { SlashCommandBuilder } from "discord.js";
import { discordYtPlayer } from "@shared";

const slashCommandBuilder = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song");

const skip = new CommandBuilder<undefined>()
    .setName("skip")
    .setAlias(["s"])
    .setDescription("Skips the current song")
    .setStatus("public")
    .setMode("available")
    .setSlash({
        slashCommand: slashCommandBuilder,
        interact: async (interaction) => {
            const isStopSuccess = discordYtPlayer.skip();

            if(isStopSuccess)
                await interaction.reply("Skipped the song");
            else
                await interaction.reply("There are no song to skip!");
        },
    })
    .setChat({
        execute: async (message) => {
            const isStopSuccess = discordYtPlayer.skip();

            if(isStopSuccess)
                await message.reply("Skipped the song");
            else
                await message.reply("There are no song to skip!");
        },
    });

export default skip;