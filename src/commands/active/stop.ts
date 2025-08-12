import { CommandBuilder} from "@library";
import { ChannelType, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { getDiscordYtPlayer } from "@shared/DiscordYtPlayer";

interface StopParameter {
    voiceChannel: VoiceBasedChannel;
}

function run(args: StopParameter){
    const discordYtPlayer = getDiscordYtPlayer(args.voiceChannel.guild.id);

    if(!discordYtPlayer)
        throw new Error("No player found");

    const result = discordYtPlayer.stop();

    if(result)
        return "Stopped the songs";
    else
        return "There are no songs to stop!";
}

const slashCommandBuilder = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops all the songs in the queue");

const stop = new CommandBuilder<StopParameter>()
    .setName("stop")
    .setDescription("Stops all the songs in the queue")
    .setStatus("public")
    .setMode("available")
    .setChannelTypes([ChannelType.GuildText])
    .setSlash({
        slashCommand: slashCommandBuilder,
        getParameter: (interaction) => {
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

export default stop;