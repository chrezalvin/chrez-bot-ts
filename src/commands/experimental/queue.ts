import { CommandBuilder, MyEmbedBuilder} from "@library";
import { GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { getDiscordYtPlayer } from "@shared";

async function run(params: QueueParameter){
    const discordYtPlayer = getDiscordYtPlayer(params.voiceChannel.guild.id);

    if(!discordYtPlayer)
        throw new Error("No player found");

    const queue = discordYtPlayer.queue;

    if(queue.length === 0 )
        return "There are no songs to be played!";
    else{
        const queueEmbed = new MyEmbedBuilder();

        queueEmbed.setDescription(queue.map((item, index) => {
            if(index === 0)
                return `**[current]** [${item.title}](${item.videoUrl}) by ${item.author} [${item.duration}]`; 
            else
                return `#${index} [${item.title}](${item.videoUrl}) by ${item.author} [${item.duration}]`;
        }).join("\n"));

        const currentEmbed = new MyEmbedBuilder();

        const current = discordYtPlayer.current;

        if(current){
            currentEmbed.setTitle(`Playing: ${current.title} by ${current.author}`);
            
            if(current.thumbnailUrl)
                currentEmbed.setThumbnail(current.thumbnailUrl);

            if(current.requester)
                currentEmbed.setAuthor({
                    name: `requested by: ${current.requester.name}`,
                    iconURL: current.requester.iconUrl,
                })

            const duration = new Date(discordYtPlayer.durationMs ?? 0);
            const s = duration.getUTCSeconds();
            const m = duration.getUTCMinutes();
            const h = duration.getUTCHours();

            // format the duration 00:00:00 -> hh:mm:ss or mm:ss, use trailing zero
            const durationString = `${h ? h + ":" : ""}${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
            
            currentEmbed.addFields([
                {name: "Duration", value: `${durationString}/${current.duration.replaceAll(".", ":")}`, inline: true},
                {name: "Volume", value: (discordYtPlayer.volume * 100).toFixed(0) + "%", inline: true}
            ]);
        }

        return {embeds: [queueEmbed, currentEmbed]};
    }
}

interface QueueParameter {
    voiceChannel: VoiceBasedChannel;
}

const slashCommandBuilder = new SlashCommandBuilder()
    .setName("queue")
    .setDescription("shows the playlist");

const queue = new CommandBuilder<QueueParameter>()
    .setName("queue")
    .setDescription("shows the playlist")
    .setStatus("public")
    .setMode("available")
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

            const res = await run(args);

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

            const res = await run(args);

            await message.reply(res);
        },
    });

export default queue;