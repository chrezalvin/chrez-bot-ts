import {MyEmbedBuilder, rngInt} from "@library/basicFunctions";

import { MessageCreateOptions, SlashCommandBuilder } from "discord.js";
import { CommandBuilder } from "@library/CommandBuilder";
import { ErrorValidation } from "@library/ErrorValidation";
import { getAllRecommend } from "services/recommend";

const run = async (args?: I_Recommend): Promise<MessageCreateOptions> => {
    const embed = new MyEmbedBuilder();

    // highly inneficient, but will do for now
    const recommends = await getAllRecommend();
    const recommend = recommends[rngInt(0, recommends.length - 1)];

    console.log(recommend.data.category);

    embed
        .setTitle(recommend.data.title)
        .setDescription(recommend.data.description);

    if(recommend.data.imgUrl)
        embed.setThumbnail(recommend.data.imgUrl);
    if(recommend.data.link)
        embed.setURL(recommend.data.link);
    if(recommend.data.category)
        embed.setFooter({text: `category: ${recommend.data.category.join(", ")}`});

    return {embeds: [embed]};
}

interface I_Recommend{

}

const slashCommand = new SlashCommandBuilder().setName("recommend")
        .setDescription("Recommends a random stuff");

const yomama = new CommandBuilder<I_Recommend>()
        .setName("recommend")
        .setDescription("Recommend a random thing")
        .setSlash({
            slashCommand,
            interact: async (interaction, args) => {
                const embeds = await run(args);

                if(ErrorValidation.isErrorValidation(embeds))
                    return embeds;
    
                await interaction.reply({
                    embeds: embeds.embeds,
                    files: embeds.files
                });
            }
        })
        .setChat({
            execute: async (message, args) => {
                const embeds = await run(args);

                if(ErrorValidation.isErrorValidation(embeds))
                    return embeds;
    
                message.channel.send(embeds);
            },
        })

export default yomama;