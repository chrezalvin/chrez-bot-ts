import { CommandBuilder, ErrorValidation} from "@library";
import { ChannelType, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { getDiscordYtPlayer } from "@shared/DiscordYtPlayer";

interface PauseParameter {
    voiceChannel: VoiceBasedChannel;
}

function run(args: PauseParameter){
    const discordYtPlayer = getDiscordYtPlayer(args.voiceChannel.guild.id);

    if(!discordYtPlayer)
        return new ErrorValidation("something_not_found", "discord yt player");

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
    .setChannelTypes([ChannelType.GuildText])
    .setExamples([
        {command: "Chrez pause", description: "pauses the current song"},
    ])
    .setSlash({
        slashCommand: slashCommandBuilder,
        getParameter: (interaction) => {
            if(!interaction.guildId)
                return new ErrorValidation("something_not_found", "guild id");

            const voiceChannel = (interaction.member as GuildMember).voice.channel;

            if(!voiceChannel)
                return new ErrorValidation("forbidden", "you must be in a voice channel to use this command");

            return { voiceChannel };
        },
        interact: async (interaction, args) => {
            if(!args)
                return new ErrorValidation("no_argument_provided");

            const res = run(args);

            if(res instanceof ErrorValidation)
                return res;

            await interaction.reply(res);
        },
    })
    .setChat({
        getParameter: (message) => {
            const voiceChannel = message.member?.voice.channel;

            if(!voiceChannel)
                return new ErrorValidation("forbidden", "you must be in a voice channel to use this command");

            return { voiceChannel };
        },
        execute: async (message, args) => {
            if(!args)
                return new ErrorValidation("no_argument_provided");

            const res = run(args);

            if(res instanceof ErrorValidation)
                return res;

            await message.reply(res);
        },
    });

export default pause;