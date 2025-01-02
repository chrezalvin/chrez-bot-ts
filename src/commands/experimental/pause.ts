import { CommandBuilder} from "@library";
import { GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { getDiscordYtPlayer } from "@shared";

interface PauseParameter {
    voiceChannel: VoiceBasedChannel;
}

function run(args: PauseParameter){
    const discordYtPlayer = getDiscordYtPlayer(args.voiceChannel.guild.id);

    if(!discordYtPlayer)
        throw new Error("No player found");

    const result = discordYtPlayer.pause();

    if(result)
        return "Paused the song";
    else
        return "There are no songs to pause!";
}

const slashCommandBuilder = new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current song");

const pause = new CommandBuilder<PauseParameter>()
    .setName("pause")
    .setDescription("Pauses the current song")
    .setStatus("public")
    .setMode("available")
    .setExamples([
        {command: "Chrez pause", description: "pauses the current song"},
    ])
    .setSlash({
        slashCommand: slashCommandBuilder,
        getParameter: (interaction) => {
            if(!interaction.guildId)
                throw new Error("Invalid guild id");

            const voiceChannel = (interaction.member as GuildMember).voice.channel;

            if(!voiceChannel)
                throw new Error("You must be in a voice channel to use this command");

            return { voiceChannel };
        },
        interact: async (interaction, args) => {
            if(!args)
                throw new Error("Invalid argument");

            const res = run(args);

            await interaction.reply(res);
        },
    })
    .setChat({
        getParameter: (message) => {
            const voiceChannel = message.member?.voice.channel;

            if(!voiceChannel)
                throw new Error("You must be in a voice channel to use this command");

            return { voiceChannel };
        },
        execute: async (message, args) => {
            if(!args)
                throw new Error("Invalid argument");

            const res = run(args);

            await message.reply(res);
        },
    });

export default pause;