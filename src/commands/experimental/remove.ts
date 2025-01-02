import { CommandBuilder} from "@library";
import { GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { getDiscordYtPlayer } from "@shared";

function run(args: RemoveArgs){
    const discordYtPlayer = getDiscordYtPlayer(args.voiceChannel.guild.id);

    if(!discordYtPlayer)
        throw new Error("No player found");

    if(args.index < 0 || args.index >= discordYtPlayer.queue.length)
        throw new Error("Invalid index");

    const removedSong = discordYtPlayer.removeQueue(args.index);

    if(removedSong)
        return `removed ${removedSong.title} by ${removedSong.author}`;
    else
        return "There are no songs to be played!";
}

const slashCommandBuilder = new SlashCommandBuilder()
    .setName("remove")
    .setDescription("removes the specified song from the queue")
    .addIntegerOption((option) => option.setName("index").setDescription("The index of the song to be removed").setRequired(true));

interface RemoveArgs {
    index: number;
    voiceChannel: VoiceBasedChannel;
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

            const voiceChannel = (interaction.member as GuildMember).voice.channel;

            if(!voiceChannel)
                throw new Error("You must be in a voice channel to use this command");

            return { index, voiceChannel };
        },
        interact: async (interaction, args) => {
            if(!args)
                throw new Error("Invalid arguments");

            const res = run(args);

            await interaction.reply(res);
        },
    })
    .setChat({
        getParameter: (message, args) => {
            const index = parseInt(args[0]);

            if(isNaN(index))
                throw new Error("Invalid arguments");

            const voiceChannel = message.member?.voice.channel;

            if(!voiceChannel)
                throw new Error("You must be in a voice channel to use this command");

            return { index, voiceChannel };
        },
        execute: async (message, args) => {
            if(!args)
                throw new Error("Invalid arguments");

            const res = run(args);

            await message.reply(res);
        },
    });

export default remove;