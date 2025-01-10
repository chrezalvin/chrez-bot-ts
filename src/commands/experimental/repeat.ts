import { CommandBuilder} from "@library";
import { GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { getDiscordYtPlayer } from "@shared/DiscordYtPlayer";

interface RepeatParameter {
    voiceChannel: VoiceBasedChannel;
    repeat: boolean;
}

function run(args: RepeatParameter){
    const discordYtPlayer = getDiscordYtPlayer(args.voiceChannel.guild.id);

    if(!discordYtPlayer)
        throw new Error("No player found");

    discordYtPlayer.repeat = args.repeat;

    if(args.repeat)
        return "Repeating the playlist";
    else
        return "Stopped repeating the playlist";
}

const slashCommandBuilder = new SlashCommandBuilder()
    .setName("repeat")
    .setDescription("Allows you to repeat the playlist")
    .addBooleanOption(option => option
        .setName("repeat")
        .setDescription("Repeats the playlist")
        .setRequired(false)
    );

const Repeat = new CommandBuilder<RepeatParameter>()
    .setName("repeat")
    .setDescription("Allows you to repeat the playlist")
    .setStatus("public")
    .setMode("available")
    .setExamples([
        {command: "Chrez Repeat", description: "Repeats the current playlist"},
        {command: "Chrez Repeat false", description: "Stops repeating the current playlist"},
        {command: "Chrez Repeat true", description: "Repeats the current playlist"},
    ])
    .setSlash({
        slashCommand: slashCommandBuilder,
        getParameter: (interaction) => {
            const voiceChannel = (interaction.member as GuildMember).voice.channel;
            const repeat = interaction.options.getBoolean("repeat") ?? false;

            if(!voiceChannel)
                throw new Error("You must be in a voice channel to use this command");

            return { voiceChannel, repeat };
        },
        interact: async (interaction, args) => {
            if(!args)
                throw new Error("Invalid argument");

            const res = run(args);

            await interaction.reply(res);
        },
    })
    .setChat({
        getParameter: (message, args) => {
            const voiceChannel = message.member?.voice.channel;

            const isRepeat = args[0] === "false" ? false : true;

            if(!voiceChannel)
                throw new Error("You must be in a voice channel to use this command");

            return { voiceChannel, repeat: isRepeat };
        },
        execute: async (message, args) => {
            if(!args)
                throw new Error("Invalid argument");

            const res = run(args);

            await message.reply(res);
        },
    });

export default Repeat;