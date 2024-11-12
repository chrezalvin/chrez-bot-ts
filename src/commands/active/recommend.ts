import {MyEmbedBuilder, ErrorValidation, CommandBuilder} from "@library";
import {RecommendService} from "@services/recommend";

import { MessageCreateOptions, SlashCommandBuilder } from "discord.js";

const run = async (_?: I_Recommend): Promise<MessageCreateOptions> => {
    const embed = new MyEmbedBuilder();

    const recommend = await RecommendService.getRandomRecommend();

    embed
        .setTitle(recommend.title)
        .setDescription(recommend.description);

    if(recommend.imgUrl)
        embed.setThumbnail(recommend.imgUrl);
    if(recommend.link)
        embed.setURL(recommend.link);
    if(recommend.category)
        embed.setFooter({text: `category: ${recommend.category.join(", ")}`});

    return {embeds: [embed]};
}

interface I_Recommend{
    tag: string | null;
}

const slashCommand = new SlashCommandBuilder().setName("recommend")
        .setDescription("Recommends a random stuff")
        .addStringOption(opt => 
            opt
            .setName("tag")
            .setDescription("The tag of the recommend")
            .setRequired(false)
        );

const yomama = new CommandBuilder<I_Recommend>()
        .setName("recommend")
        .setDescription("Recommend a random thing")
        .setSlash({
            slashCommand,
            getParameter: (interaction) => {
                const tag = interaction.options.getString("tag");

                return {
                    tag
                };
            },
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