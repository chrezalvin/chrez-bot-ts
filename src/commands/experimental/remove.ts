import { CommandBuilder} from "@library";
import { SlashCommandBuilder } from "discord.js";
import { discordYtPlayer } from "@shared";

const slashCommandBuilder = new SlashCommandBuilder()
    .setName("remove")
    .setDescription("removes the specified song from the queue")
    .addIntegerOption((option) => option.setName("index").setDescription("The index of the song to be removed").setRequired(true));

interface RemoveArgs {
    index: number;
}

const remove = new CommandBuilder<RemoveArgs>()
    .setName("remove")
    .setDescription("removes the specified song from the queue")
    .setStatus("public")
    .setMode("available")
    .setSlash({
        slashCommand: slashCommandBuilder,
        getParameter: (interaction) => {
            const index = interaction.options.getInteger("index", true);

            return { index };
        },
        interact: async (interaction, args) => {
            if(!args)
                throw new Error("Invalid arguments");

            if(args.index < 0 || args.index >= discordYtPlayer.queue.length)
                throw new Error(`Invalid index. The index should be between 0 and ${discordYtPlayer.queue.length - 1}`);

            const isremoveSuccess = discordYtPlayer.removeQueue(args.index);

            if(isremoveSuccess)
                await interaction.reply("removed the songs");
            else
                await interaction.reply("There are no songs to be played!");
        },
    })
    .setChat({
        getParameter: (message, args) => {
            const index = parseInt(args[0]);

            if(isNaN(index))
                throw new Error("Invalid arguments");

            return { index };
        },
        execute: async (message, args) => {
            if(!args)
                throw new Error("Invalid arguments");

            if(args.index < 0 || args.index >= discordYtPlayer.queue.length)
                throw new Error("Invalid index");

            const isremoveSuccess = discordYtPlayer.removeQueue(args.index);

            if(isremoveSuccess)
                await message.reply("removed the songs");
            else
                await message.reply("There are no songs to be played!");
        },
    });

export default remove;