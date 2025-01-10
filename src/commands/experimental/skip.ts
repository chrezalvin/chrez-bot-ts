import { CommandBuilder} from "@library";
import { GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { getDiscordYtPlayer } from "@shared/DiscordYtPlayer";

interface SkipParameter {
    voiceChannel: VoiceBasedChannel;
}

function run(args: SkipParameter){
    const discordYtPlayer = getDiscordYtPlayer(args.voiceChannel.guild.id);

    if(!discordYtPlayer)
        throw new Error("No player found");

    const result = discordYtPlayer.skip();

    if(result)
        return "Skipped the song";
    else
        return "There are no songs to skip!";
}

const slashCommandBuilder = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song");

const skip = new CommandBuilder<SkipParameter>()
    .setName("skip")
    .setAlias(["s"])
    .setDescription("Skips the current song")
    .setStatus("public")
    .setMode("available")
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

export default skip;