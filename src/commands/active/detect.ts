import {MyEmbedBuilder, CommandBuilder, ErrorValidation} from "@library";

import { Attachment, AttachmentBuilder, CacheType, ChannelType, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import {yoloService} from "@shared/YoloService";

const run = async (message: Message<boolean> | ChatInputCommandInteraction<CacheType>, args?: I_Detect) => {
    if(!message.channel || message.channel.type !== ChannelType.GuildText)
        return new ErrorValidation("command_restricted", "quote", "guild text channel");

    if(!args)
        return new ErrorValidation("something_not_found", "argument");


    const image = await fetch(args.image.url);
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const json_data = {
        image: buffer.toString("base64"),
        model: args.model
    }

    const json_data_buffer = Buffer.from(JSON.stringify(json_data));

    const res = await yoloService.detect(json_data_buffer);

    if(!res){
        
        return new ErrorValidation("interaction_error");
    }

    const resJson = res ? JSON.parse(res) : null;
    if("error" in resJson)
        return new ErrorValidation("interaction_error_with_reason", resJson.error);

    if(!("image" in resJson) || !("image_format" in resJson) || !("content" in resJson))
        return new ErrorValidation("something_not_found", "detection result");

    const embed = new MyEmbedBuilder();

    const imageBuffer = Buffer.from(resJson.image, "base64");
    const imageFormat = resJson.image_format;
    const attachment = new AttachmentBuilder(imageBuffer, {name: `detection${imageFormat}`});

    embed.setImage(`attachment://detection${imageFormat}`);
    if("content" in resJson)
        embed.setTitle(resJson.content);
    else
        embed.setTitle("AI Detection Result");

    if("model" in resJson)
        embed.setFooter({text: `Model used: ${resJson.model}`});

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
                .addChoices(
                    {name: "yolo11m", value: "yolo11m"},
                    {name: "neuronnet", value: "neuronnet"},
                )
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