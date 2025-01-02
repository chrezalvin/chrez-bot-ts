import { CommandBuilder} from "@library";
import { SlashCommandBuilder } from "discord.js";
import { getDiscordYtPlayer } from "@shared";

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
    .setMode("unavailable")
    .setSlash({
        slashCommand: slashCommandBuilder,
        getParameter: (interaction) => {
            const volume = interaction.options.getInteger("volume", true);

            return { volume };
        },
        interact: async (interaction, args) => {
            if(!interaction.guildId)
                throw new Error("Invalid guild id");

            if(!args)
                throw new Error("Invalid argument");

            if(args.volume < 10 || args.volume > 100)
                throw new Error("Volume must be between 10 and 100");

            const discordYtPlayer = getDiscordYtPlayer(interaction.guildId);

            if(!discordYtPlayer)
                throw new Error("No player found");

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
        execute: async (message, args) => {
            if(!args)
                throw new Error("Invalid argument");

            if(!message.guild)
                throw new Error("Invalid guild");

            const discordYtPlayer = getDiscordYtPlayer(message.guild.id);

            if(!discordYtPlayer)
                throw new Error("No player found");

            const { volume } = args;
            discordYtPlayer.volume = volume / 100;

            await message.channel.send(`Volume set to ${volume}%`);
        },
    });

export default volume;