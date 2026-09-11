import { SlashCommand } from "@commands/types";
import { ErrorValidation, YOLOModelOptions } from "@library";
import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { detect } from "@services/discord/detect";
import { SlashCommandBuilder } from "discord.js";

const slash = new SlashCommandBuilder().setName("detect")
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
        );

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const model = ctx.chatInteraction.options.getString("model", true);
    const image = ctx.chatInteraction.options.getAttachment("image", true);

    if(!image.contentType?.startsWith("image/"))
        throw new ErrorValidation("interaction_error");

    ctx.chatInteraction.deferReply();
    const embeds = await detect({
        model,
        image,
        message: ctx.chatInteraction
    });

    await ctx.chatInteraction.editReply({embeds: embeds.embeds});
}

export default {slash, middlewares: [execute]} as SlashCommand;