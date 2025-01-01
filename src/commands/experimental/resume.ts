import { CommandBuilder} from "@library";
import { SlashCommandBuilder } from "discord.js";
import { discordYtPlayer } from "@shared";

const slashCommandBuilder = new SlashCommandBuilder()
    .setName("resume")
    .setDescription("resumes the current song");

const resume = new CommandBuilder<undefined>()
    .setName("resume")
    .setAlias(["res"])
    .setDescription("resumes the current song")
    .setStatus("public")
    .setMode("available")
    .setSlash({
        slashCommand: slashCommandBuilder,
        interact: async (interaction) => {
            const isresumeSuccess = discordYtPlayer.resume();

            if(isresumeSuccess)
                await interaction.reply("resumed the songs");
            else
                await interaction.reply("There are no songs to be played!");
        },
    })
    .setChat({
        execute: async (message) => {
            const isresumeSuccess = discordYtPlayer.resume();

            if(isresumeSuccess)
                await message.reply("resumed the songs");
            else
                await message.reply("There are no songs to be played!");
        },
    });

export default resume;