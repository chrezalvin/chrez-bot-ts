import { CommandBuilder} from "@library";
import { SlashCommandBuilder } from "discord.js";
import { discordYtPlayer } from "@shared";

const slashCommandBuilder = new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Changes the volume of the player")
    .addIntegerOption((input) => input
        .setName("volume")
        .setDescription("The volume to set (in percent)")
        .setMinValue(10)
        .setMaxValue(100)
        .setRequired(true)
    );

interface VolumeParameter {
    volume: number;
}

const volume = new CommandBuilder<VolumeParameter>()
    .setName("volume")
    .setAlias(["v"])
    .setDescription("Changes the volume of the player")
    .setExamples([
        {
            command: "Chrez volume 50",
            description: "Set the volume to 50%"
        }
    ])
    .setStatus("public")
    .setMode("available")
    .setSlash({
        slashCommand: slashCommandBuilder,
        getParameter: (interaction) => {
            const volume = interaction.options.getInteger("volume", true);

            return { volume };
        },
        interact: async (interaction, args) => {
            if(!args)
                throw new Error("Invalid argument");

            if(args.volume < 10 || args.volume > 100)
                throw new Error("Volume must be between 10 and 100");

            const { volume } = args;
            discordYtPlayer.volume = volume / 100;

            await interaction.reply(`Volume set to ${volume}%`);
        },
    })
    .setChat({

        getParameter: (message, args) => {
            if(args.length === 0)
                throw new Error("Invalid argument");

            const volume = parseInt(args[0]);

            if(volume < 10 || volume > 100)
                throw new Error("Volume must be between 10 and 100");

            return { volume };
        },
        execute: async (message) => {
            const isStopSuccess = discordYtPlayer.skip();

            if(isStopSuccess)
                await message.reply("Skipped the song");
            else
                await message.reply("There are no song to skip!");
        },
    });

export default volume;