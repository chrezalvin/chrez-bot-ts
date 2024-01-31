import {MyEmbedBuilder, rngInt} from "@library/basicFunctions";

import { MessageCreateOptions, SlashCommandBuilder } from "discord.js";
import { CommandBuilder } from "@library/CommandBuilder";
import { ErrorValidation } from "@library/ErrorValidation";
import { Recommend, addRecommend, getAllRecommend, getRecommendById } from "services/recommend";

const run = async (args?: Recommend): Promise<MessageCreateOptions | ErrorValidation> => {
    if(!args)
        return new ErrorValidation("no_argument_provided");

    const id = await addRecommend(args);
    const resRec = await getRecommendById(id);

    const embed = new MyEmbedBuilder();

    // highly inneficient, but will do for now
    const recommend = resRec;

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

const slashCommand = new SlashCommandBuilder()
        .setName("addrecommend")
        .setDescription("Recommends a random stuff")
        .addStringOption(opt => opt
            .setName("title")
            .setDescription("title of the recommend")
            .setRequired(true)
        )
        .addStringOption(opt => opt
            .setName("description")
            .setDescription("description of the recommend")
            .setRequired(true)
        )
        .addAttachmentOption(opt => opt
            .setName("thumbnail")
            .setDescription("The image thumbnail of the recommend")
            .setRequired(false)
        )
        .addStringOption(opt => opt
            .setName("link")
            .setDescription("The link of the recommend")
            .setRequired(false)
        )
        .addStringOption(opt => opt
            .setName("category")
            .setDescription("category of the recommend (use comma to separate) | ex: \"movie, anime\"")
            .setRequired(false)
        );

const yomama = new CommandBuilder<Recommend>()
        .setName("addrecommend")
        .setDescription("Recommend a random thing")
        .setSlash({
            slashCommand,
            getParameter: (interaction) => {
                const title = interaction.options.getString("title", true);
                const description = interaction.options.getString("description", true);
                const thumbnail = interaction.options.getAttachment("thumbnail", false);
                const link = interaction.options.getString("link", false);
                const category = interaction.options.getString("category", false)?.split(",").map((cat) => cat.trim());
                
                let data: Recommend = {
                    title,
                    description,
                };

                if(thumbnail?.url)
                    data.imgUrl = thumbnail.url;
                if(link)
                    data.link = link;
                if(category)
                    data.category = category;

                return data;
            },
            interact: async (interaction, args) => {
                await interaction.deferReply();
                const embeds = await run(args);

                if(ErrorValidation.isErrorValidation(embeds))
                    return embeds;
    
                await interaction.editReply({
                    content: "new recommendation added, here's the embed preview",
                    embeds: embeds.embeds,
                    files: embeds.files
                });
            }
        });

export default yomama;