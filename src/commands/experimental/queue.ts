import { CommandBuilder, DiscordYtPlayerItem, MyEmbedBuilder} from "@library";
import { SlashCommandBuilder } from "discord.js";
import { discordYtPlayer } from "@shared";

function createSongQueueEmbed(queue: DiscordYtPlayerItem[]){
    const myEmbed = new MyEmbedBuilder();

    if(queue.length !== 0){
        myEmbed.setTitle(`Playing: ${queue[0].title} by ${queue[0].author}`);

        if(queue[0].thumbnailUrl)
            myEmbed.setThumbnail(queue[0].thumbnailUrl);
    }

    if(queue.length > 1){
        myEmbed.setDescription(queue.slice(1).map((item, index) => {
            return `#${index + 1} ${item.title} by ${item.author}`;
        }).join("\n"));
    }

    return myEmbed;
}

const slashCommandBuilder = new SlashCommandBuilder()
    .setName("queue")
    .setDescription("shows the playlist");

const queue = new CommandBuilder<undefined>()
    .setName("queue")
    .setDescription("shows the playlist")
    .setStatus("public")
    .setMode("available")
    .setSlash({
        slashCommand: slashCommandBuilder,
        interact: async (interaction) => {
            const queue = discordYtPlayer.queue;

            if(queue.length === 0 )
                await interaction.reply("There are no songs to be played!");
            else{
                const embed = createSongQueueEmbed(queue);
                await interaction.reply({embeds: [embed]});
            }
            
        },
    })
    .setChat({
        execute: async (message) => {
            const queue = discordYtPlayer.queue;

            if(queue.length === 0 )
                await message.reply("There are no songs to be played!");
            else{
                const embed = createSongQueueEmbed(queue);
                await message.reply({embeds: [embed]});
            }
        },
    });

export default queue;