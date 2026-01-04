import {MyEmbedBuilder, CommandBuilder, ErrorValidation, YOLOModelOptions, YOLOModelOption} from "@library";

import { Attachment, AttachmentBuilder, CacheType, ChannelType, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import {yoloService} from "@shared/YoloService";

const run = async (message: Message<boolean> | ChatInputCommandInteraction<CacheType>, args?: I_Detect) => {
    if(!message.channel || message.channel.type !== ChannelType.GuildText)
        return new ErrorValidation("command_restricted", "quote", "guild text channel");

    if(!args)
        return new ErrorValidation("something_not_found", "argument");


    const url = args.image.url + "&format=webp";

    const res = await yoloService.imageDetection(url, args.model as YOLOModelOption);

    const embed = new MyEmbedBuilder();

    if("error" in res){
        embed.setTitle("Detection Error");
        embed.setDescription(res.error);
        return {embeds: [embed]};
    }

    const attachment = new AttachmentBuilder(res.image, {name: `detection.png`});

    embed
        .setImage(`attachment://detection.png`)
        .setTitle(res.content)
        .setFooter({text: `Model used: ${res.model}`});

    return {embeds: [embed], files: [attachment]};
}

interface I_Detect{
    model: string;
    image: Attachment;
};

const quote = new CommandBuilder<I_Detect>()
    .setName("detect")
    .setDescription("AI detection for images")
    .setSlash({
        slashCommand: new SlashCommandBuilder().setName("detect")
            .setDescription("AI detection for images")
            .addStringOption(option => option
                .setName("model")
                .setRequired(true)
                .setDescription("Model to use for detection")
                .addChoices(YOLOModelOptions.map(option => {
                    return {name: option, value: option};
                }))
            )
            .addAttachmentOption(option => option
                .setName("image")
                .setRequired(true)
                .setDescription("Image to detect")
            ),
        interact: async (interaction, args) => {
            interaction.deferReply();
            const embeds = await run(interaction, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await interaction.editReply(embeds);
        },
        getParameter(interaction) {
            const model = interaction.options.getString("model", true);
            const image = interaction.options.getAttachment("image", true);

            if(!image.contentType?.startsWith("image/"))
                throw new ErrorValidation("interaction_error");

            return {
                model: model,
                image: image,
            };
        }
    });

export default quote;